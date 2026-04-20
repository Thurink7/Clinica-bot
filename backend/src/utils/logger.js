const isDev = process.env.NODE_ENV !== 'production';

export function log(level, message, meta = {}) {
  const line = {
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const str = JSON.stringify(line);
  if (level === 'error') console.error(str);
  else if (isDev || level === 'warn') console.warn(str);
  else console.log(str);
}

export const logger = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
};
