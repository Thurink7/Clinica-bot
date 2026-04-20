import { combineLocal, addMinutes } from './datetime.js';

/**
 * Gera slots entre abertura e fechamento com duração em minutos.
 * @param {string} dateStr YYYY-MM-DD
 * @param {{ open: string, close: string, duracaoMinutos: number, diasUteis: number[] }} cfg
 */
export function generateSlotsForDay(dateStr, cfg) {
  const d = new Date(dateStr + 'T12:00:00');
  const dow = d.getDay();
  if (!cfg.diasUteis.includes(dow)) return [];

  const [oh, om] = cfg.open.split(':').map(Number);
  const [ch, cm] = cfg.close.split(':').map(Number);
  const start = combineLocal(dateStr, `${String(oh).padStart(2, '0')}:${String(om).padStart(2, '0')}`);
  const end = combineLocal(dateStr, `${String(ch).padStart(2, '0')}:${String(cm).padStart(2, '0')}`);
  const slots = [];
  let cursor = start;
  const step = cfg.duracaoMinutos;
  while (addMinutes(cursor, step) <= end) {
    const hh = String(cursor.getHours()).padStart(2, '0');
    const mm = String(cursor.getMinutes()).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    cursor = addMinutes(cursor, step);
  }
  return slots;
}

export function defaultClinicConfig() {
  return {
    open: '08:00',
    close: '18:00',
    duracaoMinutos: 30,
    diasUteis: [1, 2, 3, 4, 5],
  };
}
