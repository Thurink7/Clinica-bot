'use client';

import { useEffect, useState } from 'react';
import type { PacienteRow, Profissional } from '@/lib/api';
import { fetchJson } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';

export default function PacientesPage() {
  const [list, setList] = useState<PacienteRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [profissionalId, setProfissionalId] = useState<string>('');

  const filtered = list.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return p.nome.toLowerCase().includes(q) || p.telefone.includes(q);
  });

  const proById = new Map(profissionais.map((p) => [p.id, p]));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pros, pacientes] = await Promise.all([
          fetchJson<Profissional[]>('/profissionais'),
          fetchJson<PacienteRow[]>(
            profissionalId
              ? `/pacientes?profissionalId=${encodeURIComponent(profissionalId)}`
              : '/pacientes'
          ),
        ]);
        if (!cancelled) {
          setProfissionais(pros);
          setList(pacientes);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profissionalId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-secondary">Pacientes</h1>
          <p className="text-sm text-slate-600">Histórico básico e contatos (filtrável por médico).</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="w-full rounded-lg border border-slate-200 bg-brand-muted px-3 py-2 sm:w-72">
            <label className="mr-2 text-sm text-slate-600">Médico</label>
            <select
              value={profissionalId}
              onChange={(e) => {
                setError(null);
                setProfissionalId(e.target.value);
              }}
              className="bg-transparent text-sm"
            >
              <option value="">Todos</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-72"
          />
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div
            key={p.telefone}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-900">{p.nome}</div>
                <div className="text-sm text-slate-500">{p.telefone}</div>
              </div>
              <span className="rounded-full bg-brand-muted px-2.5 py-1 text-xs text-slate-600">
                {p.consultas.length} consulta(s)
              </span>
            </div>
            <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
              {p.consultas.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-2">
                  <span>
                    {c.data} {c.hora}
                  </span>
                  {(c.profissionalId || c.servico) && (
                    <span className="text-slate-500">
                      — {c.profissionalId ? `Dr(a). ${proById.get(c.profissionalId)?.nome || '—'}` : 'Dr(a). —'}
                      {c.servico ? ` · ${String(c.servico).toUpperCase()}` : ''}
                    </span>
                  )}
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
