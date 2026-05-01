'use client';

import { useEffect, useState } from 'react';
import type { ClinicConfig } from '@/lib/api';
import { fetchJson } from '@/lib/api';

const diasLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function ConfigPage() {
  const [cfg, setCfg] = useState<ClinicConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJson<ClinicConfig>('/config');
        if (!cancelled) setCfg(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    if (!cfg) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await fetchJson<ClinicConfig>('/config', {
        method: 'PUT',
        body: JSON.stringify(cfg),
      });
      setCfg(data);
      setSuccess('Configurações salvas com sucesso.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function toggleDia(d: number) {
    if (!cfg) return;
    const set = new Set(cfg.diasUteis);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    setCfg({ ...cfg, diasUteis: [...set].sort((a, b) => a - b) });
  }

  if (!cfg) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-brand-secondary">Configurações</h1>
        {error ? <p className="text-red-600">{error}</p> : <p className="text-slate-500">Carregando…</p>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-brand-secondary">Configurações</h1>
      <p className="mb-6 text-sm text-slate-600">
        Defina o expediente da clínica e a duração padrão das consultas.
      </p>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-4 text-sm text-emerald-600">{success}</p>}

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Abertura</label>
          <input
            type="time"
            value={cfg.open}
            onChange={(e) => setCfg({ ...cfg, open: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Fechamento</label>
          <input
            type="time"
            value={cfg.close}
            onChange={(e) => setCfg({ ...cfg, close: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Duração da consulta (minutos)
          </label>
          <input
            type="number"
            min={5}
            step={5}
            value={cfg.duracaoMinutos}
            onChange={(e) =>
              setCfg({ ...cfg, duracaoMinutos: Number(e.target.value) || 30 })
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Dias de funcionamento</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {diasLabels.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleDia(i)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  cfg.diasUteis.includes(i)
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-brand-muted text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}
