/**
 * Ponto de entrada para Firebase Functions (v2).
 * Para produção: copie `backend/src` para dentro de `functions/`
 * ou faça deploy da API no Cloud Run / VM e use Hosting apenas para o Next.js.
 */
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import admin from 'firebase-admin';

setGlobalOptions({ region: 'southamerica-east1' });

export const health = onRequest((req, res) => {
  res.json({ ok: true, service: 'clinica-mvp', hint: 'API Express roda em backend/' });
});

function initAdmin() {
  if (!admin.apps.length) admin.initializeApp();
  return admin.firestore();
}

function combineClinicLocal(dateStr, timeStr) {
  // Clínica no Brasil (São Paulo) em UTC-03:00
  return new Date(`${dateStr}T${timeStr}:00-03:00`);
}

async function sendWhatsAppText(toPhoneE164, body) {
  const twSid = process.env.TWILIO_ACCOUNT_SID;
  const twToken = process.env.TWILIO_AUTH_TOKEN;
  const twFrom = process.env.TWILIO_WHATSAPP_FROM;
  if (twSid && twToken && twFrom) {
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
    if (!res.ok) throw new Error(`Twilio API: ${res.status} ${await res.text()}`);
    return res.json();
  }

  const url = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!url || !token || !phoneId) return { ok: true, mock: true };

  const normalized = String(toPhoneE164).replace(/\D/g, '');
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
  if (!res.ok) throw new Error(`WhatsApp API: ${res.status} ${await res.text()}`);
  return res.json();
}

export const reminders = onSchedule('every 5 minutes', async () => {
  const db = initAdmin();
  const now = Date.now();
  const w =
    (Number(process.env.REMINDER_WINDOW_MINUTES) || 10) * 60 * 1000;

  const statuses = ['agendado', 'confirmado'];
  const out = [];
  for (const st of statuses) {
    const snap = await db.collection('consultas').where('status', '==', st).get();
    snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
  }

  const h24 = 24 * 60 * 60 * 1000;
  const h3 = 3 * 60 * 60 * 1000;

  for (const c of out) {
    if (!c?.data || !c?.hora || !c?.telefone) continue;
    const dt = combineClinicLocal(c.data, c.hora).getTime();
    const until = dt - now;

    if (!c.reminder24hSent && until <= h24 + w && until >= h24 - w) {
      await sendWhatsAppText(
        c.telefone,
        `Lembrete: sua consulta é em 24h (${c.data} ${c.hora}). Responda CONFIRMAR ${c.id}, CANCELAR ${c.id} ou REAGENDAR ${c.id}`
      );
      await db.collection('consultas').doc(c.id).set({ reminder24hSent: true }, { merge: true });
    } else if (!c.reminder3hSent && until <= h3 + w && until >= h3 - w) {
      await sendWhatsAppText(
        c.telefone,
        `Lembrete: sua consulta é em 3h (${c.data} ${c.hora}). Responda CONFIRMAR ${c.id}, CANCELAR ${c.id} ou REAGENDAR ${c.id}`
      );
      await db.collection('consultas').doc(c.id).set({ reminder3hSent: true }, { merge: true });
    }
  }
});
