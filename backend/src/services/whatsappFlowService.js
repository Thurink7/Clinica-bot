import { SessionRepository } from '../repositories/sessionRepository.js';
import { ConsultaService } from './consultaService.js';
import { ProfessionalService } from './professionalService.js';
import { sendWhatsAppText } from './whatsappProvider.js';
import { logger } from '../utils/logger.js';

const MENU = `Olá! Sou o assistente da clínica.
1 — Agendar consulta
2 — Falar com atendente

Responda com o número da opção.`;

function formatDateBR(isoDateStr) {
  const [y, m, d] = String(isoDateStr || '').split('-');
  if (!y || !m || !d) return String(isoDateStr || '');
  return `${d}/${m}/${y}`;
}

function normalizePhone(raw) {
  const d = String(raw).replace(/\D/g, '');
  if (d.length <= 11) return `55${d}`;
  return d;
}

export class WhatsappFlowService {
  constructor(
    sessions = new SessionRepository(),
    consultas = new ConsultaService(),
    professionals = new ProfessionalService()
  ) {
    this.sessions = sessions;
    this.consultas = consultas;
    this.professionals = professionals;
  }

  async handleIncoming(telefoneRaw, textoRaw, options = {}) {
    const transport = options.transport || 'provider';
    const telefone = normalizePhone(telefoneRaw);
    const text = String(textoRaw || '')
      .trim()
      .toUpperCase();
    let reply = '';

    const respond = async (message) => {
      reply = message;
      if (transport === 'provider') {
        try {
          await sendWhatsAppText(telefone, message);
        } catch (e) {
          // Não quebra o fluxo/ACK do webhook se o provider falhar; apenas loga.
          logger.error('whatsapp_send_error', {
            err: e?.message || String(e),
            to: telefone,
          });
        }
      }
      return message;
    };

    const confirm = text.match(/^CONFIRMAR\s+(\S+)/);
    const cancel = text.match(/^CANCELAR\s+(\S+)/);
    const reag = text.match(/^REAGENDAR\s+(\S+)/);

    if (confirm) {
      await this.consultas.atualizarStatus(confirm[1], 'confirmado');
      await respond('Consulta confirmada. Obrigado!');
      return { ok: true, reply };
    }
    if (cancel) {
      await this.consultas.cancelar(cancel[1]);
      await respond('Consulta cancelada. O horário foi liberado.');
      return { ok: true, reply };
    }
    if (reag) {
      await this.consultas.cancelar(reag[1]);
      await this.sessions.set(telefone, { step: 'menu' });
      await respond('Consulta anterior cancelada para reagendamento. ' + MENU);
      return { ok: true, reply };
    }

    const session = (await this.sessions.get(telefone)) || { step: 'menu' };

    if (session.step === 'escolher_servico') {
      const si = parseInt(text, 10);
      const chosen = session.servicosOfertados?.[si - 1];
      if (chosen) {
        const dias = await this.consultas.proximosSlotsResumo(5);
        if (!dias.length) {
          await respond('Sem horários nos próximos dias. Tente mais tarde.');
          return { ok: true, reply };
        }
        const lines = dias.map((d, i) => {
          const br = formatDateBR(d.data);
          const [dia, mes, ano] = br.split('/');
          return `${i + 1} — DIA ${dia}, MÊS ${mes} e ANO ${ano}`;
        });
        await respond(
          `Serviço escolhido: ${chosen}\n\nAgora escolha o dia pelo número:\n${lines.join('\n')}`
        );
        await this.sessions.set(telefone, {
          step: 'escolher_data_servico',
          nomePaciente: session.nomePaciente,
          servicoEscolhido: chosen,
          diasOfertados: dias,
        });
        return { ok: true, reply };
      }
    }

    if (session.step === 'escolher_data_servico' && session.diasOfertados) {
      const di = parseInt(text, 10);
      const dia = session.diasOfertados[di - 1];
      if (dia && session.servicoEscolhido) {
        const pros = await this.professionals.profissionaisPorServico(session.servicoEscolhido);
        const disponiveis = [];
        for (const p of pros) {
          const livres = await this.consultas.horariosDisponiveis(dia.data, p.id);
          if (livres.length) disponiveis.push({ id: p.id, nome: p.nome, livresCount: livres.length });
        }
        if (!disponiveis.length) {
          const br = formatDateBR(dia.data);
          const [dd, mm, yy] = br.split('/');
          await respond(
            `Para DIA ${dd}, MÊS ${mm} e ANO ${yy}, não encontrei médicos disponíveis para ${session.servicoEscolhido}. Escolha outro dia (responda o número) ou envie MENU.`
          );
          return { ok: true, reply };
        }
        const br = formatDateBR(dia.data);
        const [dd, mm, yy] = br.split('/');
        const lines = disponiveis.map(
          (p, i) => `${i + 1} — Dr(a). ${p.nome} (${p.livresCount} horários livres)`
        );
        await respond(
          `Médicos disponíveis para ${session.servicoEscolhido} no DIA ${dd}, MÊS ${mm} e ANO ${yy} (escolha o número):\n${lines.join('\n')}`
        );
        await this.sessions.set(telefone, {
          step: 'escolher_profissional',
          nomePaciente: session.nomePaciente,
          servicoEscolhido: session.servicoEscolhido,
          dataEscolhida: dia.data,
          profissionaisOfertados: disponiveis,
        });
        return { ok: true, reply };
      }
    }

    if (session.step === 'escolher_profissional' && session.dataEscolhida) {
      const pi = parseInt(text, 10);
      const p = session.profissionaisOfertados?.[pi - 1];
      if (p?.id) {
        const livres = await this.consultas.horariosDisponiveis(session.dataEscolhida, p.id);
        if (!livres.length) {
          await respond('Esse profissional ficou sem horários. Escolha outro médico ou outro dia.');
          return { ok: true, reply };
        }
        const slotsOfertados = livres.map((hora) => ({
          hora,
          label: `${formatDateBR(session.dataEscolhida)} ${hora}`,
        }));
        const lines = slotsOfertados.map((s, i) => `${i + 1} — ${s.label}`);
        const chunkSize = 20;
        for (let i = 0; i < lines.length; i += chunkSize) {
          const chunk = lines.slice(i, i + chunkSize);
          await respond(
            `Horários do(a) Dr(a). ${p.nome} (escolha o número):\n${chunk.join('\n')}${
              lines.length > chunkSize
                ? `\n\n(Enviando ${Math.min(i + chunkSize, lines.length)}/${lines.length})`
                : ''
            }`
          );
        }
        await this.sessions.set(telefone, {
          step: 'escolher_horario',
          nomePaciente: session.nomePaciente,
          dataEscolhida: session.dataEscolhida,
          servicoEscolhido: session.servicoEscolhido,
          profissionalEscolhido: { id: p.id, nome: p.nome },
          slotsOfertados,
        });
        return { ok: true, reply };
      }
    }

    if (session.step === 'escolher_horario' && session.dataEscolhida) {
      const idx = parseInt(text, 10);
      const slot = session.slotsOfertados?.[idx - 1];
      if (slot && slot.hora) {
        try {
          const created = await this.consultas.agendar(
            {
              nomePaciente: session.nomePaciente || 'Paciente',
              telefone,
              data: session.dataEscolhida,
              hora: slot.hora,
              profissionalId: session.profissionalEscolhido?.id || null,
              servico: session.servicoEscolhido || null,
            },
            { notify: transport === 'provider' }
          );
          await this.sessions.clear(telefone);
          const br = formatDateBR(created.data);
          const [dia, mes, ano] = br.split('/');
          await respond(
            `Consulta agendada para DIA ${dia}, MÊS ${mes} e ANO ${ano} às ${created.hora}. Para cancelar, responda CANCELAR ${created.id}`
          );
        } catch (e) {
          await respond(`Não foi possível agendar: ${e.message}`);
        }
        return { ok: true, reply };
      }
    }

    if (session.step === 'nome' && text && !/^1$|^2$/.test(text)) {
      await this.sessions.set(telefone, {
        step: 'escolher_servico',
        nomePaciente: textoRaw.trim(),
      });
      const servicos = await this.professionals.listarServicos();
      if (!servicos.length) {
        await respond(
          'Nenhum serviço cadastrado no momento. Peça ao atendente para cadastrar os profissionais/serviços.'
        );
        return { ok: true, reply };
      }
      const lines = servicos.map((s, i) => `${i + 1} — ${s}`);
      await respond(`Qual serviço médico você deseja?\n${lines.join('\n')}`);
      await this.sessions.set(telefone, {
        step: 'escolher_servico',
        nomePaciente: textoRaw.trim(),
        servicosOfertados: servicos,
      });
      return { ok: true, reply };
    }

    // (fluxo antigo escolher_data removido; agora a data vem após escolher o serviço)

    if (text === '1' || text.includes('AGENDAR')) {
      await this.sessions.set(telefone, { step: 'nome' });
      await respond('Informe seu nome completo:');
      return { ok: true, reply };
    }

    if (text === '2' || text.includes('ATENDENTE')) {
      await this.sessions.set(telefone, { step: 'menu' });

      await respond(
        'Encaminhamos para um atendente humano. Para voltar ao menu, envie qualquer mensagem.'
      );

      return { ok: true, reply };
    }
    if (text === 'MENU') {
      await respond(MENU);
      await this.sessions.set(telefone, { step: 'menu' });
      return { ok: true, reply };
    }
    await respond(MENU);
    await this.sessions.set(telefone, { step: 'menu' });
    return { ok: true, reply };
  }
}
