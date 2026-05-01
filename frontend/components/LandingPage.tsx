import Link from 'next/link';

const benefits = [
  {
    title: 'Menos faltas',
    body: 'Lembretes automáticos por WhatsApp mantêm pacientes informados e reduzem no-show.',
  },
  {
    title: 'Agenda sempre organizada',
    body: 'Visualize confirmados, livres e cancelados em um painel simples e atualizado.',
  },
  {
    title: 'Pronto para escalar',
    body: 'Vários profissionais na mesma clínica, com cadastro claro e histórico centralizado.',
  },
  {
    title: 'Confiança para a saúde',
    body: 'Fluxos pensados para clínicas reais: rápidos de usar no dia a dia da recepção.',
  },
];

const steps = [
  { n: '1', title: 'Configure horários', body: 'Informe expediente e duração das consultas.' },
  { n: '2', title: 'Cadastre profissionais', body: 'Nome, especialidade e contatos para operação alinhada.' },
  { n: '3', title: 'Atenda com WhatsApp', body: 'Pacientes agendam e recebem lembretes sem planilhas.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-muted">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-brand-secondary">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 3v4M12 17v4M3 12h4M17 12h4M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Clínica Agenda
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-secondary"
            >
              Testar grátis
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light/90 via-white to-brand-muted px-4 pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.12),_transparent_65%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-secondary shadow-sm ring-1 ring-brand-light">
              Plataforma B2B para clínicas
            </p>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Reduza faltas e automatize sua clínica com WhatsApp
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-lg text-slate-600">
              Agendamentos automáticos, lembretes inteligentes e mais pacientes atendidos — sem complicar a rotina da
              recepção.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-primary/25 transition hover:bg-brand-secondary"
              >
                Começar agora
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-brand-secondary shadow-sm transition hover:bg-slate-50"
              >
                Ver painel
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Sem taxa de setup no MVP
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                Foco em comparecimento
              </li>
            </ul>
          </div>

          <div className="relative lg:justify-self-end">
            <div className="relative mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-brand-primary/10 ring-1 ring-slate-100">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-semibold text-brand-secondary">Painel — hoje</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Ao vivo
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 rounded-xl bg-brand-muted p-3">
                  <div className="h-12 flex-1 rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
                    <div className="p-2 text-[10px] font-medium text-slate-500">Consultas</div>
                    <div className="px-2 text-xl font-bold text-brand-secondary">24</div>
                  </div>
                  <div className="h-12 flex-1 rounded-lg bg-white shadow-sm ring-1 ring-slate-100">
                    <div className="p-2 text-[10px] font-medium text-slate-500">Confirmadas</div>
                    <div className="px-2 text-xl font-bold text-brand-primary">18</div>
                  </div>
                </div>
                <div className="rounded-xl bg-brand-light/60 p-3 ring-1 ring-brand-light">
                  <div className="text-xs font-medium text-brand-secondary">09:00 · Ana Costa</div>
                  <div className="mt-1 text-[11px] text-slate-600">Confirmado · WhatsApp enviado</div>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3">
                  <div className="text-xs font-medium text-slate-500">10:00 — Horário livre</div>
                </div>
                <div className="rounded-xl bg-red-50 p-3 ring-1 ring-red-100">
                  <div className="text-xs font-medium text-red-900">11:00 · Cancelado</div>
                  <div className="mt-1 text-[11px] text-red-800">Slot liberado para novo agendamento</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-brand-secondary">Por que clínicas escolhem a plataforma</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
          Clareza operacional e comunicação com pacientes no mesmo lugar.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <article
              key={b.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 12l2 2 4-4M12 3v4M12 17v4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-brand-secondary">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-brand-secondary">Como funciona</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-slate-100 bg-brand-muted/50 p-6">
                <span className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white shadow">
                  {s.n}
                </span>
                <h3 className="mt-2 font-semibold text-brand-secondary">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-brand-secondary">Quem já usa</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              quote: 'Reduzimos ligações repetitivas e ganhamos previsibilidade na agenda da manhã.',
              author: 'Dra. Carla Mendes',
              role: 'Clínica Vida Plena — SP',
            },
            {
              quote: 'A equipe da recepção adotou em um dia. Interface objetiva e confiável.',
              author: 'Ricardo Alves',
              role: 'Centro Médico Horizonte — RJ',
            },
            {
              quote: 'Os lembretes no WhatsApp mudaram nosso índice de comparecimento.',
              author: 'Juliana Prado',
              role: 'Odonto Sul — MG',
            },
          ].map((t) => (
            <blockquote
              key={t.author}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm italic text-slate-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm">
                <cite className="not-italic font-semibold text-brand-secondary">{t.author}</cite>
                <div className="text-slate-500">{t.role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-secondary to-brand-primary px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Pronto para organizar sua clínica?</h2>
          <p className="mt-3 text-brand-light/95">
            Acesse o painel e configure profissionais e expediente em poucos minutos.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-3 text-sm font-bold text-brand-secondary shadow-lg transition hover:bg-brand-muted"
          >
            Testar grátis
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Clínica Agenda · Agendamento inteligente para equipes de saúde
      </footer>
    </div>
  );
}
