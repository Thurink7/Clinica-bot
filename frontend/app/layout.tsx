import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Painel — Clínica',
  description: 'Agendamento e lembretes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur sm:p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
