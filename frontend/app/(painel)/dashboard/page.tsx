'use client';

import { useConsultasHoje } from '@/lib/useConsultasHoje';
import { StatusBadge } from '@/components/StatusBadge';

function IconClipboard() {
  return (
    <svg className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconPercent() {
  return (
    <svg className="h-5 w-5 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

export default function DashboardPage() {
  const { list, error, loading, date } = useConsultasHoje();

  const total = list.length;
  const confirmadas = list.filter((c) => c.status === 'confirmado').length;
  const canceladas = list.filter((c) => c.status === 'cancelado').length;
  const ativas = list.filter((c) => c.status !== 'cancelado').length;
  const taxaComparecimento =
    ativas > 0 ? Math.round((confirmadas / ativas) * 100) : total > 0 ? Math.round((confirmadas / Math.max(total, 1)) * 100) : 0;

  const proximas = [...list]
    .filter((c) => c.status !== 'cancelado')
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-secondary">Dashboard</h1>
          <p className="text-sm text-slate-600">Visão rápida das consultas de hoje ({date})</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-secondary">
          Atualização automática
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-brand-muted" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Consultas do dia" value={total} icon={<IconClipboard />} ring="brand" />
            <StatCard title="Confirmadas" value={confirmadas} icon={<IconCheck />} ring="brand" />
            <StatCard title="Canceladas" value={canceladas} icon={<IconX />} ring="rose" />
            <StatCard
              title="Taxa de comparecimento"
              value={`${taxaComparecimento}%`}
              subtitle="Confirmadas sobre consultas ativas"
              icon={<IconPercent />}
              ring="brand"
            />
          </div>
          <section className="rounded-xl border border-slate-200 bg-brand-muted/40 p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-brand-secondary">
              Próximas consultas de hoje
            </h2>
            {proximas.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma consulta ativa para hoje.</p>
            ) : (
              <ul className="space-y-2">
                {proximas.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className="text-sm">
                      <span className="font-medium text-slate-900">{c.hora}</span>
                      <span className="mx-2 text-slate-400">·</span>
                      <span>{c.nomePaciente}</span>
                      <span className="ml-2 text-slate-500">{c.telefone}</span>
                    </div>
                    <StatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  ring,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  ring: 'brand' | 'rose';
}) {
  const ringClass =
    ring === 'rose' ? 'ring-red-100 hover:ring-red-200' : 'ring-brand-light hover:ring-brand-primary/30';
  return (
    <div
      className={`rounded-xl bg-white p-5 shadow-sm ring-1 transition ${ringClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-brand-secondary">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="rounded-lg bg-brand-muted p-2">{icon}</div>
      </div>
    </div>
  );
}
