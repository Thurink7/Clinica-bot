import { ConsultaRepository } from '../repositories/consultaRepository.js';
import { combineLocal } from '../utils/datetime.js';
import { sendWhatsAppText } from './whatsappProvider.js';
import { logger } from '../utils/logger.js';

const WINDOW_MS = () =>
  (Number(process.env.REMINDER_WINDOW_MINUTES) || 10) * 60 * 1000;

/**
 * Dispara lembretes 24h e 3h antes (janela alinhada ao cron de 5 min).
 */
export class ReminderService {
  constructor(consultas = new ConsultaRepository()) {
    this.consultas = consultas;
  }

  async run() {
    const now = Date.now();
    const w = WINDOW_MS();
    const list = await this.consultas.listAllForReminders();
    let sent = 0;

    for (const c of list) {
      const dt = combineLocal(c.data, c.hora).getTime();
      const until = dt - now;

      const h24 = 24 * 60 * 60 * 1000;
      const h3 = 3 * 60 * 60 * 1000;

      if (!c.reminder24hSent && until <= h24 + w && until >= h24 - w) {
        await this._send(
          c,
          '24h',
          `Lembrete: sua consulta é em 24h (${c.data} ${c.hora}). Responda CONFIRMAR ${c.id}, CANCELAR ${c.id} ou REAGENDAR ${c.id}`
        );
        sent++;
      } else if (!c.reminder3hSent && until <= h3 + w && until >= h3 - w) {
        await this._send(
          c,
          '3h',
          `Lembrete: sua consulta é em 3h (${c.data} ${c.hora}). Responda CONFIRMAR ${c.id}, CANCELAR ${c.id} ou REAGENDAR ${c.id}`
        );
        sent++;
      }
    }

    logger.info('reminder_job_done', { checked: list.length, sent });
    return { checked: list.length, sent };
  }

  async _send(consulta, kind, text) {
    try {
      await sendWhatsAppText(consulta.telefone, text);
      const patch =
        kind === '24h'
          ? { reminder24hSent: true }
          : { reminder3hSent: true };
      await this.consultas.update(consulta.id, patch);
    } catch (e) {
      logger.error('reminder_send_error', { id: consulta.id, kind, message: e.message });
    }
  }
}
