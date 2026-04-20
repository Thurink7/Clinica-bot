import { ConsultaRepository } from '../repositories/consultaRepository.js';
import { ConfigRepository } from '../repositories/configRepository.js';
import { generateSlotsForDay } from '../utils/slots.js';
import { combineLocal } from '../utils/datetime.js';
import { sendWhatsAppText } from './whatsappProvider.js';
import { logger } from '../utils/logger.js';

const VALID_STATUS = new Set(['agendado', 'confirmado', 'cancelado']);

export class ConsultaService {
  constructor(
    consultas = new ConsultaRepository(),
    config = new ConfigRepository()
  ) {
    this.consultas = consultas;
    this.config = config;
  }

  async agendar({ nomePaciente, telefone, data, hora }, opts = {}) {
    if (!nomePaciente || !telefone || !data || !hora) {
      const err = new Error('Campos obrigatórios: nomePaciente, telefone, data, hora');
      err.status = 400;
      throw err;
    }

    const cfg = await this.config.get();
    const slots = generateSlotsForDay(data, cfg);
    if (!slots.includes(hora)) {
      const err = new Error('Horário inválido ou fora do expediente');
      err.status = 409;
      throw err;
    }

    const conflict = await this.consultas.hasConflict(data, hora);
    if (conflict) {
      const err = new Error('Horário já ocupado');
      err.status = 409;
      throw err;
    }

    const row = {
      nomePaciente: String(nomePaciente).trim(),
      telefone: String(telefone).replace(/\D/g, ''),
      data,
      hora,
      status: 'agendado',
      reminder24hSent: false,
      reminder3hSent: false,
    };

    const created = await this.consultas.create(row);
    logger.info('consulta_criada', { id: created.id, data, hora });

    const shouldNotify = opts.notify !== false;
    if (shouldNotify) {
      try {
        await sendWhatsAppText(
          row.telefone,
          `Consulta agendada para ${data} às ${hora}. Status: agendado. Para cancelar, responda CANCELAR ${created.id}`
        );
      } catch (e) {
        logger.warn('whatsapp_pos_agendar', { message: e.message });
      }
    }

    return created;
  }

  async listar({ data, de, ate } = {}) {
    if (data) return this.consultas.listByDate(data);
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const s =
      de ||
      `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const e =
      ate ||
      `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    return this.consultas.listByDateRange(s, e);
  }

  async cancelar(id) {
    if (!id) {
      const err = new Error('id obrigatório');
      err.status = 400;
      throw err;
    }
    const cur = await this.consultas.getById(id);
    if (!cur) {
      const err = new Error('Consulta não encontrada');
      err.status = 404;
      throw err;
    }
    await this.consultas.update(id, { status: 'cancelado' });
    return this.consultas.getById(id);
  }

  async atualizarStatus(id, status) {
    if (!VALID_STATUS.has(status)) {
      const err = new Error('status inválido');
      err.status = 400;
      throw err;
    }
    const cur = await this.consultas.getById(id);
    if (!cur) {
      const err = new Error('Consulta não encontrada');
      err.status = 404;
      throw err;
    }
    return this.consultas.update(id, { status });
  }

  async excluir(id) {
    if (!id) {
      const err = new Error('id obrigatório');
      err.status = 400;
      throw err;
    }
    const cur = await this.consultas.getById(id);
    if (!cur) {
      const err = new Error('Consulta não encontrada');
      err.status = 404;
      throw err;
    }
    return this.consultas.delete(id);
  }

  async horariosDisponiveis(dataStr) {
    const cfg = await this.config.get();
    const slots = generateSlotsForDay(dataStr, cfg);
    const ocupadas = await this.consultas.listByDate(dataStr);
    const taken = new Set(
      ocupadas.filter((c) => c.status !== 'cancelado').map((c) => c.hora)
    );
    return slots.filter((h) => !taken.has(h));
  }

  /** Próximos N dias com slots livres (para menu WhatsApp) */
  async proximosSlotsResumo(dias = 3) {
    const out = [];
    const d = new Date();
    for (let i = 0; i < dias; i++) {
      const cur = new Date(d);
      cur.setDate(d.getDate() + i);
      const pad = (n) => String(n).padStart(2, '0');
      const ds = `${cur.getFullYear()}-${pad(cur.getMonth() + 1)}-${pad(cur.getDate())}`;
      const livres = await this.horariosDisponiveis(ds);
      if (livres.length) out.push({ data: ds, horarios: livres });
    }
    return out;
  }

  appointmentDateTime(consulta) {
    return combineLocal(consulta.data, consulta.hora);
  }
}
