/** @param {string} date YYYY-MM-DD @param {string} time HH:mm */
export function combineLocal(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function toDateStr(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60 * 1000);
}
