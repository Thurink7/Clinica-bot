import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { isFirebaseConfigured } from '@/lib/isFirebaseConfigured';

let app: FirebaseApp | null = null;

function getOrCreateApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  };
  if (!getApps().length) {
    app = initializeApp(cfg);
  } else {
    app = getApps()[0]!;
  }
  return app;
}

/** Firestore no browser para escuta em tempo real (agenda), quando o env do Firebase estiver configurado. */
export function getFirebaseDb(): Firestore | null {
  const a = getOrCreateApp();
  if (!a) return null;
  return getFirestore(a);
}
