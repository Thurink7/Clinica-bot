'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Profissional } from '@/lib/api';
import { fetchJson } from '@/lib/api';

function normalizeServicos(raw: string) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toUpperCase());
}

export default function ProfissionaisPage() {
  const [list, setList] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [servicosRaw, setServicosRaw] = useState('');
  const servicosPreview = useMemo(() => normalizeServicos(servicosRaw), [servicosRaw]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<Profissional[]>('/profissionais');
      setList(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cadastrar() {
    setError(null);
    setSuccess(null);

    const n = nome.trim();
    const servicos = servicosPreview;
    if (!n || servicos.length === 0) {
      setError('Informe o nome do profissional e pelo menos 1 serviço (separado por vírgula).');
      return;
    }

    setSaving(true);
    try {
      await fetchJson<Profissional>('/profissionais', {
        method: 'POST',
        body: JSON.stringify({ nome: n, servicos }),
      });
      setSuccess('Profissional cadastrado com sucesso.');
      setNome('');
      setServicosRaw('');
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-clinic-800">Profissionais</h1>
          <p className="text-sm text-slate-600">
            Cadastre médicos/profissionais e os serviços que realizam (isso alimenta o bot).
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Atualizar lista
        </button>
      </div>

      {success && <p className="text-sm text-emerald-600">{success}</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Cadastrar profissional</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria Souza"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Serviços (vírgula)</label>
            <input
              type="text"
              value={servicosRaw}
              onChange={(e) => setServicosRaw(e.target.value)}
              placeholder="Ex: Cardiologia, Clínico Geral"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            {servicosPreview.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {servicosPreview.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-clinic-50 px-2.5 py-1 text-xs font-medium text-clinic-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={cadastrar}
            disabled={saving}
            className="rounded-lg bg-clinic-600 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50"
          >
            {saving ? 'Cadastrando…' : 'Cadastrar'}
          </button>
          <p className="text-xs text-slate-500">
            Dica: use nomes de serviços consistentes (ex.: “CARDIOLOGIA”).
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900">Cadastrados</h2>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          </div>
        ) : list.length === 0 ? (
          <div className="px-4 py-10 text-center text-slate-500">Nenhum profissional cadastrado.</div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {list.map((p) => (
              <li key={p.id} className="px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-slate-900">{p.nome}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(p.servicos || []).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.ativo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

