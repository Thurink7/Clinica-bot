const base = () =>
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json() as Promise<T>;
}

export type Consulta = {
  id: string;
  nomePaciente: string;
  telefone: string;
  data: string;
  hora: string;
  status: 'agendado' | 'confirmado' | 'cancelado';
};

export type ClinicConfig = {
  open: string;
  close: string;
  duracaoMinutos: number;
  diasUteis: number[];
};

export type PacienteRow = {
  telefone: string;
  nome: string;
  consultas: { id: string; data: string; hora: string; status: string }[];
};
