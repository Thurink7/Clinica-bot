import { logger } from '../utils/logger.js';

/**
 * Envio de WhatsApp com fallback:
 * 1) Twilio (se TWILIO_* estiver configurado)
 * 2) Meta Cloud API (se WHATSAPP_* estiver configurado)
 * 3) Mock (somente log em desenvolvimento)
 */
export async function sendWhatsAppText(toPhoneE164, body) {
  const twSid = process.env.TWILIO_ACCOUNT_SID;
  const twToken = process.env.TWILIO_AUTH_TOKEN;
  const twFrom = process.env.TWILIO_WHATSAPP_FROM;
  if (twSid && twToken && twFrom) {
    logger.info('whatsapp_provider_selected', {
      provider: 'twilio',
      to: String(toPhoneE164),
      from: String(twFrom),
    });
    const toDigits = String(toPhoneE164).replace(/\D/g, '');
    const to = `whatsapp:+${toDigits}`;
    const from = twFrom.startsWith('whatsapp:') ? twFrom : `whatsapp:${twFrom}`;
    const auth = Buffer.from(`${twSid}:${twToken}`).toString('base64');

    const params = new URLSearchParams();
    params.set('From', from);
    params.set('To', to);
    params.set('Body', body);

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      logger.error('twilio_send_failed', { status: res.status, errText });
      throw new Error(`Twilio API: ${res.status}`);
    }
    return res.json();
  }

  const url = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!url || !token || !phoneId) {
    logger.info('whatsapp_mock_send', { to: toPhoneE164, body: body.slice(0, 200) });
    return { ok: true, mock: true };
  }

  logger.info('whatsapp_provider_selected', {
    provider: 'meta_cloud',
    to: String(toPhoneE164),
    phoneId: String(phoneId),
  });

  const normalized = toPhoneE164.replace(/\D/g, '');
  const payload = {
    messaging_product: 'whatsapp',
    to: normalized,
    type: 'text',
    text: { body },
  };

  const res = await fetch(`${url.replace(/\/$/, '')}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    logger.error('whatsapp_send_failed', { status: res.status, errText });
    throw new Error(`WhatsApp API: ${res.status}`);
  }

  return res.json();
}
