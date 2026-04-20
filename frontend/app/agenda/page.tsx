'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebaseClient';
import type { Consulta } from '@/lib/api';
import { fetchJson } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';

export default function AgendaPage() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  });
  const [list, setList] = useState<Consulta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [nomePaciente, setNomePaciente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [hora, setHora] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function criarConsulta() {
    setError(null);
    setSuccess(null);
    if (!nomePaciente || !telefone || !date || !hora) {
      setError('Preencha nome, telefone, data e hora para criar a consulta.');
      return;
    }
    setSaving(true);
    try {
      await fetchJson<Consulta>('/agendar', {
        method: 'POST',
        body: JSON.stringify({ nomePaciente, telefone, data: date, hora }),
      });
      setSuccess('Consulta criada com sucesso.');
      setNomePaciente('');
      setTelefone('');
      setHora('');
      const data = await fetchJson<Consulta[]>(`/consultas?data=${encodeURIComponent(date)}`);
      setList(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function excluirConsulta(id: string) {
    const ok = window.confirm('Deseja realmente excluir esta consulta da agenda?');
    if (!ok) return;
    setError(null);
    setSuccess(null);
    setDeletingId(id);
    try {
      await fetchJson<{ id: string; deleted: boolean }>(`/consultas/${id}`, {
        method: 'DELETE',
      });
      setSuccess('Consulta excluída com sucesso.');
      setList((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    setLoading(true);
    const firestore = getFirebaseDb();
    if (firestore) {
      const q = query(collection(firestore, 'consultas'), where('data', '==', date));
      return onSnapshot(
        q,
        (snap) => {
          const rows: Consulta[] = [];
          snap.forEach((doc) => rows.push({ id: doc.id, ...(doc.data() as Omit<Consulta, 'id'>) }));
          rows.sort((a, b) => a.hora.localeCompare(b.hora));
          setList(rows);
          setError(null);
          setLoading(false);
        },
        (e) => {
          setError(e.message);
          setLoading(false);
        }
      );
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJson<Consulta[]>(`/consultas?data=${encodeURIComponent(date)}`);
        if (!cancelled) setList(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    const id = setInterval(async () => {
      try {
        const data = await fetchJson<Consulta[]>(`/consultas?data=${encodeURIComponent(date)}`);
        setList(data);
      } catch {
        /* ignore */
      }
    }, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-clinic-800">Agenda</h1>
          <p className="text-sm text-slate-600">Crie e acompanhe consultas por data.</p>
        </div>
        <div className="rounded-lg border border-slate-300 bg-white px-3 py-2">
          <label className="mr-2 text-sm text-slate-600">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Nova consulta</h2>
        <p className="mb-4 text-sm text-slate-500">
          A consulta será criada para a data selecionada acima.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            value={nomePaciente}
            onChange={(e) => setNomePaciente(e.target.value)}
            placeholder="Nome do paciente"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={criarConsulta}
            disabled={saving}
            className="rounded-lg bg-clinic-600 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50"
          >
            {saving ? 'Criando...' : 'Criar consulta'}
          </button>
        </div>
      </section>
      {success && <p className="mb-4 text-sm text-emerald-600">{success}</p>}
      {error && (
        <p className="mb-4 text-sm text-rose-600">{error}</p>
      )}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-semibold text-slate-900">Consultas do dia</h2>
        </div>
        {loading ? (
          <div className="space-y-2 p-4">
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {list.length === 0 && (
              <li className="px-4 py-10 text-center text-slate-500">
                Nenhuma consulta nesta data.
              </li>
            )}
            {list.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 transition hover:bg-slate-50"
              >
                <div>
                  <span className="font-medium text-slate-900">{c.hora}</span>
                  <span className="mx-2 text-slate-400">·</span>
                  <span>{c.nomePaciente}</span>
                  <span className="ml-2 text-sm text-slate-500">{c.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.status} />
                  <button
                    type="button"
                    onClick={() => excluirConsulta(c.id)}
                    disabled={deletingId === c.id}
                    className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    {deletingId === c.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
