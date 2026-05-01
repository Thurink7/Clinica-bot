'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, authRequired } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authRequired || loading) return;
    if (!user) router.replace('/login');
  }, [authRequired, loading, user, router]);

  if (!authRequired) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" aria-hidden />
        <span className="sr-only">Carregando sessão…</span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
