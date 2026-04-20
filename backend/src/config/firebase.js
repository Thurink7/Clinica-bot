import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

let initialized = false;

function loadServiceAccount() {
  const jsonRaw =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (jsonRaw) {
    try {
      return JSON.parse(String(jsonRaw).trim());
    } catch (e) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT_JSON inválido: ${e.message}. Verifique aspas e o JSON completo.`
      );
    }
  }

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) {
    try {
      const cleaned = String(b64).replace(/\s/g, '');
      return JSON.parse(Buffer.from(cleaned, 'base64').toString('utf8'));
    } catch (e) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT_B64 inválido: ${e.message}. Gere de novo com o arquivo JSON (uma linha, sem espaços).`
      );
    }
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    if (existsSync(credPath)) {
      return JSON.parse(readFileSync(credPath, 'utf8'));
    }
    try {
      return JSON.parse(credPath);
    } catch {
      throw new Error(
        'GOOGLE_APPLICATION_CREDENTIALS deve ser um caminho válido para o JSON da service account.'
      );
    }
  }

  return null;
}

export function initFirebase() {
  if (initialized) return admin;

  if (!admin.apps.length) {
    const sa = loadServiceAccount();
    if (sa?.project_id) {
      admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: sa.project_id,
      });
    } else {
      throw new Error(
        'Firebase Admin: configure credenciais. No Render use FIREBASE_SERVICE_ACCOUNT_JSON (JSON inteiro) ou FIREBASE_SERVICE_ACCOUNT_B64 (base64 do JSON). Localmente use GOOGLE_APPLICATION_CREDENTIALS com caminho do arquivo. Veja backend/.env.example.'
      );
    }
  }

  initialized = true;
  return admin;
}

export function getFirestore() {
  initFirebase();
  return admin.firestore();
}
