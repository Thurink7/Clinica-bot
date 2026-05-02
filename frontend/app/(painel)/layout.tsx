'use client';

import { useEffect } from 'react';
import { Nav } from '@/components/Nav';
import { RequireAuth } from '@/components/RequireAuth';

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.setAttribute('data-app-shell', 'true');
    return () => document.body.removeAttribute('data-app-shell');
  }, []);

  return (
    <RequireAuth>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="rounded-2xl border border-white/80 bg-white p-5 shadow-sm sm:p-6">{children}</div>
      </main>
    </RequireAuth>
  );
}
