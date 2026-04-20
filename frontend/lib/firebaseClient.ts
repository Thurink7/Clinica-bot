import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseDb(): Firestore | null {
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
  if (!cfg.apiKey || !cfg.projectId) return null;
  if (!getApps().length) {
    app = initializeApp(cfg);
  } else {
    app = getApps()[0]!;
  }
  if (!db) db = getFirestore(app);
  return db;
}
