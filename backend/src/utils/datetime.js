/**
 * Constrói Date para o horário "local" da clínica (Brasil).
 * Importante: ambientes de deploy costumam rodar em UTC; então não podemos depender do timezone do servidor.
 *
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} timeStr HH:mm
 */
export function combineLocal(dateStr, timeStr) {
  // Brasil (São Paulo) atualmente opera em UTC-03:00 (sem horário de verão).
  // Usamos offset explícito para manter lembretes/agenda consistentes em qualquer ambiente.
  return new Date(`${dateStr}T${timeStr}:00-03:00`);
}

export function toDateStr(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60 * 1000);
}
