'use client';

import { useEffect, useState } from 'react';
import type { PacienteRow } from '@/lib/api';
import { fetchJson } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';

export default function PacientesPage() {
  const [list, setList] = useState<PacienteRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = list.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.nome.toLowerCase().includes(q) || p.telefone.includes(q);
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJson<PacienteRow[]>('/pacientes');
        if (!cancelled) setList(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-clinic-800">Pacientes</h1>
          <p className="text-sm text-slate-600">Histórico básico e contatos.</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou telefone"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:w-72"
        />
      </div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div
            key={p.telefone}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium text-slate-900">{p.nome}</div>
                <div className="text-sm text-slate-500">{p.telefone}</div>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {p.consultas.length} consulta(s)
              </span>
            </div>
            <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
              {p.consultas.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-2">
                  <span>
                    {c.data} {c.hora}
                  </span>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length === 0 && !error && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Nenhum paciente encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
