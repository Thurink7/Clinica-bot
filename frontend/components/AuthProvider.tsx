'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '@/lib/isFirebaseConfigured';
import { subscribeAuth } from '@/lib/firebaseAuth';

type AuthState = {
  user: User | null;
  loading: boolean;
  /** false quando não há projeto Firebase no env — painel fica aberto (desenvolvimento). */
  authRequired: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authRequired = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(authRequired);

  useEffect(() => {
    if (!authRequired) {
      setLoading(false);
      return;
    }
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [authRequired]);

  const value = useMemo(() => ({ user, loading, authRequired }), [user, loading, authRequired]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve estar dentro de AuthProvider');
  return ctx;
}
