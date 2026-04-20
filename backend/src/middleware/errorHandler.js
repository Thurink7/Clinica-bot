import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  const status = err.status || 500;
  logger.error('http_error', {
    path: req.path,
    status,
    message: err.message,
  });
  res.status(status).json({
    error: err.message || 'Erro interno',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
