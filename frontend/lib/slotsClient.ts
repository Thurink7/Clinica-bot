import type { ClinicConfig } from '@/lib/api';

/** Mesma lógica do backend (timezone São Paulo explícito). */
function combineLocal(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00-03:00`);
}

function addMinutes(date: Date, mins: number): Date {
  return new Date(date.getTime() + mins * 60 * 1000);
}

export function generateSlotsForDay(dateStr: string, cfg: ClinicConfig): string[] {
  const d = new Date(`${dateStr}T12:00:00-03:00`);
  const dow = d.getDay();
  if (!cfg.diasUteis.includes(dow)) return [];

  const [oh, om] = cfg.open.split(':').map(Number);
  const [ch, cm] = cfg.close.split(':').map(Number);
  const start = combineLocal(
    dateStr,
    `${String(oh).padStart(2, '0')}:${String(om).padStart(2, '0')}`
  );
  const end = combineLocal(
    dateStr,
    `${String(ch).padStart(2, '0')}:${String(cm).padStart(2, '0')}`
  );
  const slots: string[] = [];
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
