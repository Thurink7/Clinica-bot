import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();
  // MVP: permite origens do painel (Vercel, localhost). Evita bloqueio CORS em navegador.
  const extra = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (extra.length && extra.includes(origin)) return cb(null, true);
        try {
          const hostname = new URL(origin).hostname;
          if (hostname === 'localhost' || hostname === '127.0.0.1') return cb(null, true);
          if (hostname.endsWith('.vercel.app')) return cb(null, true);
        } catch {
          /* ignore */
        }
        return cb(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      if (ms > 500) logger.warn('slow_request', { path: req.path, ms });
    });
    next();
  });

  app.use('/', router);
  app.use(errorHandler);
  return app;
}
