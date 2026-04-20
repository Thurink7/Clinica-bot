import { WhatsappFlowService } from '../services/whatsappFlowService.js';
import { logger } from '../utils/logger.js';

const flow = new WhatsappFlowService();

/**
 * Extrai telefone e texto do webhook Meta Cloud API.
 */
function parseMetaBody(body) {
  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const msg = change?.messages?.[0];
    if (!msg) return null;
    const from = msg.from;
    const text =
      msg.type === 'text'
        ? msg.text?.body
        : msg.type === 'interactive'
          ? msg.interactive?.button_reply?.title ||
            msg.interactive?.list_reply?.title
          : '';
    return { from, text: text || '' };
  } catch {
    return null;
  }
}

export async function postWebhookWhatsapp(req, res, next) {
  try {
    logger.info('webhook_whatsapp_received', {
      hasBody: !!req.body,
      topKeys: Object.keys(req.body || {}).slice(0, 10),
    });
    const parsed = parseMetaBody(req.body);
    // Meta/WhatsApp exige ACK rápido no webhook; processamos em background
    // para não estourar timeout e não bloquear em chamadas externas (ex.: envio WhatsApp).
    res.status(200).send('OK');

    if (parsed?.from && parsed.text !== undefined) {
      logger.info('webhook_whatsapp_parsed', {
        from: parsed.from,
        textPreview: String(parsed.text || '').slice(0, 120),
      });
      flow.handleIncoming(parsed.from, parsed.text).catch((e) => {
        logger.error('webhook_whatsapp_handle_failed', {
          err: e?.message || String(e),
          from: parsed.from,
        });
      });
    } else if (req.body?.from && req.body?.message !== undefined) {
      logger.info('webhook_whatsapp_custom_shape', {
        from: req.body?.from,
        textPreview: String(req.body?.message || '').slice(0, 120),
      });
      flow.handleIncoming(req.body.from, req.body.message).catch((e) => {
        logger.error('webhook_whatsapp_handle_failed', {
          err: e?.message || String(e),
          from: req.body?.from,
        });
      });
    } else {
      logger.warn('webhook_whatsapp_unknown_shape', {
        keys: Object.keys(req.body || {}),
      });
    }
  } catch (e) {
    next(e);
  }
}

/**
 * Webhook Twilio WhatsApp (form-urlencoded).
 * Campos usuais: From=whatsapp:+5511..., Body=texto
 */
export async function postWebhookTwilio(req, res, next) {
  try {
    console.log('Webhook recebido:', req.body);

    const fromRaw = req.body?.From || req.body?.from || '';
    const bodyRaw = String(req.body?.Body || req.body?.message || '').trim();
    const from = String(fromRaw).replace(/^whatsapp:/i, '');
    // Twilio pode “engasgar” se o webhook demorar (ex.: Firestore + regras de agenda).
    // Para máxima confiabilidade, respondemos IMEDIATAMENTE com TwiML vazio (200)
    // e enviamos a mensagem real via API do Twilio em background.
    //
    // Observação: o envio real usa sendWhatsAppText → Twilio REST quando TWILIO_* está setado.
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

    if (!fromRaw) {
      logger.warn('webhook_twilio_unknown_shape', {
        keys: Object.keys(req.body || {}),
      });
    }

    res.set('Content-Type', 'text/xml');
    res.status(200).send(twiml);

    if (!from || !bodyRaw) {
      flow
        .handleIncoming(from || 'unknown', bodyRaw || '', { transport: 'provider' })
        .catch((e) =>
          logger.error('webhook_twilio_handle_failed', {
            err: e?.message || String(e),
            from,
          })
        );
      return;
    }

    flow.handleIncoming(from, bodyRaw, { transport: 'provider' }).catch((e) => {
      logger.error('webhook_twilio_handle_failed', {
        err: e?.message || String(e),
        from,
      });
    });
  } catch (e) {
    next(e);
  }
}

/** Verificação Meta (challenge) */
export function getWebhookVerify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verify = process.env.WHATSAPP_VERIFY_TOKEN;
  if (mode === 'subscribe' && token && token === verify) {
    res.status(200).send(challenge);
    return;
  }
  res.sendStatus(403);
}
