import admin from 'firebase-admin';
import { readFileSync } from 'fs';

let initialized = false;

export function initFirebase() {
  if (initialized) return admin;

  if (!admin.apps.length) {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath) {
      const serviceAccount = JSON.parse(readFileSync(credPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp();
    }
  }

  initialized = true;
  return admin;
}

export function getFirestore() {
  initFirebase();
  return admin.firestore();
}
