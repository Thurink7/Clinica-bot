import Link from 'next/link';

const plans = [
  {
    name: 'Essencial',
    price: '97',
    description: 'Para clínicas começando a digitalizar a operação.',
    features: ['Até 5 profissionais', 'Agenda online', 'Lembretes WhatsApp', 'Relatórios básicos', 'Suporte por e-mail'],
    cta: 'Começar grátis',
    highlighted: false,
  },
  {
    name: 'Profissional',
    price: '197',
    description: 'Para clínicas em crescimento que querem escalar.',
    features: [
      'Até 20 profissionais',
      'Confirmações automáticas',
      'Reagendamento',
      'Painel ao vivo',
      'Integração com fluxo de mensagens',
      'Suporte prioritário',
    ],
    cta: 'Testar 14 dias',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    description: 'Para redes e grupos com múltiplas unidades.',
    features: [
      'Profissionais ilimitados',
      'Multi-unidades',
      'API',
      'SLA negociado',
      'Gerente dedicado',
      'Conformidade reforçada',
    ],
    cta: 'Falar com vendas',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="precos" className="relative overflow-hidden bg-surface-cool py-24 lg:py-32">
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="container relative mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Preços</span>
          <h2 className="font-display mt-3 mb-5 text-4xl font-bold text-primary md:text-5xl">
            Planos para cada momento da clínica
          </h2>
          <p className="text-lg text-muted-foreground">Valores ilustrativos no MVP. Sem taxa de setup.</p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 transition-all ${
                plan.highlighted
                  ? 'scale-[1.02] border-[hsl(var(--primary-glow)/0.3)] bg-gradient-to-br from-[hsl(224,80%,14%)] via-primary to-[hsl(217,91%,35%)] shadow-premium lg:-translate-y-2'
                  : 'border-border/60 bg-gradient-to-b from-card to-secondary/20 shadow-card hover:shadow-elegant'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-accent px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-accent-foreground shadow-md">
                  MAIS POPULAR
                </div>
              )}

              <h3
                className={`font-display mb-2 text-2xl font-bold ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`}
              >
                {plan.name}
              </h3>
              <p className={`mb-6 text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                {plan.price === 'Sob consulta' ? (
                  <p className={`font-display text-3xl font-bold ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`}>
                    Sob consulta
                  </p>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-sm font-medium ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                    >
                      R$
                    </span>
                    <span
                      className={`font-display text-5xl font-bold ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`}
                    >
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      /mês
                    </span>
                  </div>
                )}
              </div>

              <Link
                href="/login"
                className={`mb-7 flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${
                  plan.highlighted
                    ? 'bg-accent text-accent-foreground shadow-md hover:bg-accent/90'
                    : 'border border-primary/10 bg-secondary text-primary hover:bg-secondary/80'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3 border-t border-border/40 pt-5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-sm ${plan.highlighted ? 'text-primary-foreground/90' : 'text-primary'}`}
                  >
                    <span
                      className={`mt-2 h-1 w-3 flex-shrink-0 rounded-full ${plan.highlighted ? 'bg-accent' : 'bg-primary/40'}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
