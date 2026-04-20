/**
 * Ponto de entrada para Firebase Functions (v2).
 * Para produção: copie `backend/src` para dentro de `functions/`
 * ou faça deploy da API no Cloud Run / VM e use Hosting apenas para o Next.js.
 */
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({ region: 'southamerica-east1' });

export const health = onRequest((req, res) => {
  res.json({ ok: true, service: 'clinica-mvp', hint: 'API Express roda em backend/' });
});
