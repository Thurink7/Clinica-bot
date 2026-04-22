const base = () =>
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method || 'GET').toUpperCase();
  const headers = new Headers(init?.headers as HeadersInit);
  // GET/HEAD com Content-Type JSON dispara preflight CORS desnecessário; não envia em GET.
  if (method !== 'GET' && method !== 'HEAD' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${base()}${path}`;

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch (e) {
    const hint =
      typeof window !== 'undefined' &&
      !window.location.hostname.includes('localhost') &&
      base().includes('localhost')
        ? ' Defina NEXT_PUBLIC_API_URL no Vercel (Production e Preview) e faça redeploy.'
        : ' Verifique se a API está no ar, CORS e URL pública (HTTPS).';
    throw new Error(
      e instanceof Error && e.message === 'Failed to fetch'
        ? `Falha de rede ao chamar a API (${url}).${hint}`
        : e instanceof Error
          ? e.message
          : `${e}`
    );
  }

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

export type Profissional = {
  id: string;
  nome: string;
  servicos: string[];
  ativo: boolean;
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
