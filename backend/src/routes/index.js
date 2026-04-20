import { Router } from 'express';
import {
  postAgendar,
  getConsultas,
  putCancelar,
  patchStatus,
  deleteConsulta,
  getSlots,
  getConfig,
  putConfig,
  getPacientes,
} from '../controllers/consultaController.js';
import {
  postWebhookWhatsapp,
  postWebhookTwilio,
  getWebhookVerify,
} from '../controllers/webhookController.js';

const router = Router();

router.post('/agendar', postAgendar);
router.get('/consultas', getConsultas);
router.put('/cancelar', putCancelar);
router.patch('/consultas/status', patchStatus);
router.delete('/consultas/:id', deleteConsulta);
router.get('/slots', getSlots);
router.get('/config', getConfig);
router.put('/config', putConfig);
router.get('/pacientes', getPacientes);

router.post('/webhook-whatsapp', postWebhookWhatsapp);
router.post('/webhook', postWebhookTwilio);
router.get('/webhook-whatsapp', getWebhookVerify);

router.get('/health', (req, res) => {
  res.json({ ok: true, t: Date.now() });
});

export default router;
