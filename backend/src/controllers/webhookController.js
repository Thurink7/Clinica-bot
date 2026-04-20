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
    const parsed = parseMetaBody(req.body);
    if (parsed?.from && parsed.text !== undefined) {
      await flow.handleIncoming(parsed.from, parsed.text);
    } else if (req.body?.from && req.body?.message !== undefined) {
      await flow.handleIncoming(req.body.from, req.body.message);
    } else {
      logger.warn('webhook_whatsapp_unknown_shape', {
        keys: Object.keys(req.body || {}),
      });
    }
    res.status(200).send('OK');
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
    let resposta = 'Olá! Sou o assistente da clínica 👋';

    if (!from || !bodyRaw) {
      resposta =
        'Não consegui identificar sua mensagem. Responda: 1 para agendar ou 2 para falar com atendente.';
    } else {
      const result = await flow.handleIncoming(from, bodyRaw, {
        transport: 'twiml',
      });
      if (result?.reply) resposta = result.reply;
    }

    // Escapa caracteres para XML válido.
    const safe = resposta
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const twiml = `<Response><Message>${safe}</Message></Response>`;

    if (!fromRaw) {
      logger.warn('webhook_twilio_unknown_shape', {
        keys: Object.keys(req.body || {}),
      });
    }

    res.set('Content-Type', 'text/xml');
    res.status(200).send(twiml);
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
