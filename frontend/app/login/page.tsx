'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};
    const em = email.trim();
    if (!em) next.email = 'Informe o e-mail.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) next.email = 'E-mail inválido.';
    if (!password) next.password = 'Informe a senha.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(214,100%,97%)] via-white to-[hsl(214,32%,95%)]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[hsl(214,100%,97%)] via-white to-[hsl(214,32%,95%)] px-4 py-10">
      <div className="mx-auto mb-8 flex items-center gap-2 text-lg font-semibold text-[hsl(224,76%,22%)]">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[hsl(214,32%,91%)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 3v4M12 17v4M3 12h4M17 12h4"
              stroke="currentColor"
              className="text-[hsl(217,91%,60%)]"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
        Clínica Agenda
      </div>

      <div className="mx-auto w-full max-w-[420px]">
        <div className="rounded-2xl border border-white/80 bg-white p-8 shadow-lg shadow-brand-primary/10">
          <h1 className="text-center text-xl font-bold text-[hsl(224,76%,22%)]">Acesso ao painel</h1>
          <p className="mt-1 text-center text-sm text-[hsl(215,20%,45%)]">
            Use o e-mail e a senha cadastrados no sistema (banco de dados).
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm ${
                  fieldErrors.email ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white'
                }`}
                placeholder="clinica@email.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm ${
                  fieldErrors.password ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white'
                }`}
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-brand-primary py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Entrando…
                </span>
              ) : (
                'Entrar'
              )}
            </button>

            <p className="text-center text-xs text-[hsl(215,20%,45%)]">
              Esqueceu a senha? O administrador pode definir uma nova credencial no Firestore ou via variáveis de ambiente
              de bootstrap (consulte a documentação da API).
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/" className="font-medium text-brand-secondary hover:underline">
            Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}
