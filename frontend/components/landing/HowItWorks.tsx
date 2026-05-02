const steps = [
  {
    n: '01',
    title: 'Conecte sua agenda',
    description: 'Configure expediente, profissionais e especialidades em poucos minutos.',
  },
  {
    n: '02',
    title: 'Ative o WhatsApp',
    description: 'Integração com seu fluxo de mensagens para lembretes e confirmações.',
  },
  {
    n: '03',
    title: 'Acompanhe os resultados',
    description: 'Painel ao vivo com ocupação, status das consultas e histórico.',
  },
];

export function HowItWorks() {
  return (
    <section id="funcionamento" className="relative overflow-hidden bg-surface-cool py-24 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="container relative mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Como funciona</span>
          <h2 className="font-display mt-3 mb-5 text-4xl font-bold text-primary md:text-5xl">
            Comece em menos de 24 horas
          </h2>
          <p className="text-lg text-muted-foreground">Onboarding guiado, sem dor de cabeça técnica.</p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3 lg:gap-8">
          <div className="absolute left-[16%] right-[16%] top-16 hidden h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block" />

          {steps.map((step) => (
            <div
              key={step.n}
              className="relative rounded-2xl border border-border/60 bg-gradient-to-b from-card to-secondary/20 p-8 shadow-card transition-all hover:shadow-elegant"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-md">
                  <span className="font-display text-xl font-bold text-primary-foreground">{step.n}</span>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>
              <h3 className="font-display mb-3 text-xl font-semibold text-primary">{step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
