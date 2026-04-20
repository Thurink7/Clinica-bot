'use client';

import { useConsultasHoje } from '@/lib/useConsultasHoje';
import { StatusBadge } from '@/components/StatusBadge';

export default function DashboardPage() {
  const { list, error, loading, date } = useConsultasHoje();

  const total = list.length;
  const confirmadas = list.filter((c) => c.status === 'confirmado').length;
  const canceladas = list.filter((c) => c.status === 'cancelado').length;
  const proximas = [...list]
    .filter((c) => c.status !== 'cancelado')
    .sort((a, b) => a.hora.localeCompare(b.hora))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-clinic-800">Dashboard</h1>
          <p className="text-sm text-slate-600">Visão rápida das consultas de hoje ({date})</p>
        </div>
        <span className="rounded-full bg-clinic-50 px-3 py-1 text-xs font-medium text-clinic-700">
          Atualização automática
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Total do dia" value={total} />
            <StatCard title="Confirmadas" value={confirmadas} accent="emerald" />
            <StatCard title="Canceladas" value={canceladas} accent="rose" />
          </div>
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-slate-900">Próximas consultas de hoje</h2>
            {proximas.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma consulta ativa para hoje.</p>
            ) : (
              <ul className="space-y-2">
                {proximas.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
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
  accent,
}: {
  title: string;
  value: number;
  accent?: 'emerald' | 'rose';
}) {
  const ring =
    accent === 'emerald'
      ? 'ring-emerald-200'
      : accent === 'rose'
        ? 'ring-rose-200'
        : 'ring-clinic-100';
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ring-1 ${ring}`}>
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-2 text-3xl font-bold text-clinic-800">{value}</p>
    </div>
  );
}
