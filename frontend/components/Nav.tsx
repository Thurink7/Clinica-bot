"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/pacientes', label: 'Pacientes' },
  { href: '/configuracoes', label: 'Configurações' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-clinic-800">
          Clínica Agenda
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 transition ${
                pathname === l.href
                  ? 'bg-clinic-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-clinic-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
