import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
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

export function getFirebaseDb(): Firestore | null {
  const a = getOrCreateApp();
  if (!a) return null;
  return getFirestore(a);
}

export function getFirebaseAuth() {
  const a = getOrCreateApp();
  if (!a) return null;
  return getAuth(a);
}

export async function authSignIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase não configurado.');
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export async function authSignOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

export async function authSendReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase não configurado.');
  await sendPasswordResetEmail(auth, email.trim());
}

export function subscribeAuth(cb: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}
