'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getFirebaseDb } from './firebaseClient';
import type { Consulta } from './api';
import { fetchJson } from './api';

function todayStr() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function useConsultasHoje() {
  const [list, setList] = useState<Consulta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const date = todayStr();
    const firestore = getFirebaseDb();

    if (firestore) {
      const q = query(collection(firestore, 'consultas'), where('data', '==', date));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const rows: Consulta[] = [];
          snap.forEach((doc) => {
            rows.push({ id: doc.id, ...(doc.data() as Omit<Consulta, 'id'>) });
          });
          rows.sort((a, b) => a.hora.localeCompare(b.hora));
          setList(rows);
          setLoading(false);
          setError(null);
        },
        (e) => setError(e.message)
      );
      return () => unsub();
    }

    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchJson<Consulta[]>(`/consultas?data=${encodeURIComponent(date)}`);
        if (!cancelled) {
          setList(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { list, error, loading, date: todayStr() };
}
