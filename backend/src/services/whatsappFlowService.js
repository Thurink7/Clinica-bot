import { SessionRepository } from '../repositories/sessionRepository.js';
import { ConsultaService } from './consultaService.js';
import { sendWhatsAppText } from './whatsappProvider.js';
import { logger } from '../utils/logger.js';

const MENU = `Olá! Sou o assistente da clínica.
1 — Agendar consulta
2 — Falar com atendente

Responda com o número da opção.`;

function normalizePhone(raw) {
  const d = String(raw).replace(/\D/g, '');
  if (d.length <= 11) return `55${d}`;
  return d;
}

export class WhatsappFlowService {
  constructor(
    sessions = new SessionRepository(),
    consultas = new ConsultaService()
  ) {
    this.sessions = sessions;
    this.consultas = consultas;
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
        await sendWhatsAppText(telefone, message);
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
            },
            { notify: transport === 'provider' }
          );
          await this.sessions.clear(telefone);
          await respond(
            `Consulta agendada para ${created.data} às ${created.hora}. Para cancelar, responda CANCELAR ${created.id}`
          );
        } catch (e) {
          await respond(`Não foi possível agendar: ${e.message}`);
        }
        return { ok: true, reply };
      }
    }

    if (session.step === 'nome' && text && !/^1$|^2$/.test(text)) {
      await this.sessions.set(telefone, {
        step: 'escolher_data',
        nomePaciente: textoRaw.trim(),
      });
      const dias = await this.consultas.proximosSlotsResumo(5);
      if (!dias.length) {
        await respond('Sem horários nos próximos dias. Tente mais tarde.');
        return { ok: true, reply };
      }
      const lines = dias.map(
        (d, i) => `${i + 1} — ${d.data} (${d.horarios.length} horários livres)`
      );
      await respond(`Escolha o dia pelo número:\n${lines.join('\n')}`);
      await this.sessions.set(telefone, {
        step: 'escolher_data',
        nomePaciente: textoRaw.trim(),
        diasOfertados: dias,
      });
      return { ok: true, reply };
    }

    if (session.step === 'escolher_data' && session.diasOfertados) {
      const di = parseInt(text, 10);
      const dia = session.diasOfertados[di - 1];
      if (dia) {
        const livres = await this.consultas.horariosDisponiveis(dia.data);
        const slotsOfertados = livres.slice(0, 8).map((hora) => ({
          hora,
          label: `${dia.data} ${hora}`,
        }));
        const lines = slotsOfertados.map((s, i) => `${i + 1} — ${s.label}`);
        await respond(`Horários disponíveis (escolha o número):\n${lines.join('\n')}`);
        await this.sessions.set(telefone, {
          step: 'escolher_horario',
          nomePaciente: session.nomePaciente,
          dataEscolhida: dia.data,
          slotsOfertados,
        });
        return { ok: true, reply };
      }
    }

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
    await respond(MENU);
    await this.sessions.set(telefone, { step: 'menu' });
    return { ok: true, reply };
  }
}
