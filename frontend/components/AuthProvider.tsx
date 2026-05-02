'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchJson, type FetchJsonOptions } from '@/lib/api';
import { getStoredToken, setStoredToken } from '@/lib/session';

export type SessionUser = {
  id: string;
  email: string;
  nome: string | null;
};

type AuthState = {
  user: SessionUser | null;
  loading: boolean;
  /** Sempre true: o painel exige login via API (usuários em Firestore / admin_users). */
  authRequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  /** fetch autenticado; use skipAuth no login. */
  fetchWithAuth: <T>(path: string, init?: FetchJsonOptions) => Promise<T>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setUser(null);
      return;
    }
    try {
      const r = await fetchJson<{ user: SessionUser }>('/auth/me');
      setUser(r.user);
    } catch {
      setStoredToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshSession();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await fetchJson<{ token: string; user: SessionUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    setStoredToken(r.token);
    setUser(r.user);
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const fetchWithAuth = useCallback(
    <T,>(path: string, init?: FetchJsonOptions) => fetchJson<T>(path, init),
    []
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      authRequired: true,
      login,
      logout,
      fetchWithAuth,
    }),
    [user, loading, login, logout, fetchWithAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve estar dentro de AuthProvider');
  return ctx;
}
