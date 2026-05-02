const benefits = [
  {
    title: 'Agenda inteligente',
    description: 'Visualize, organize e otimize horários de toda a clínica em uma única tela.',
  },
  {
    title: 'WhatsApp automático',
    description: 'Confirmações, lembretes e reagendamentos enviados sem esforço da recepção.',
  },
  {
    title: 'Lembretes inteligentes',
    description: 'Reduza faltas com mensagens no momento certo para cada paciente.',
  },
  {
    title: 'Relatórios em tempo real',
    description: 'KPIs de comparecimento e ocupação atualizados conforme a agenda.',
  },
  {
    title: 'Gestão de pacientes',
    description: 'Histórico e filtros por profissional para acompanhar atendimentos.',
  },
  {
    title: 'Segurança LGPD',
    description: 'Boas práticas de dados e foco em conformidade para informações de saúde.',
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="relative bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Benefícios</span>
          <h2 className="font-display mt-3 mb-5 text-4xl font-bold tracking-tight text-primary md:text-5xl">
            Por que clínicas escolhem a plataforma
          </h2>
          <p className="text-lg text-muted-foreground">
            Clareza operacional e comunicação com pacientes no mesmo lugar.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 shadow-card sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="group relative bg-card p-8 transition-colors duration-300 hover:bg-secondary/40 lg:p-10"
            >
              <div className="absolute left-0 top-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full" />
              <span className="font-display text-sm font-bold tracking-widest text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display mt-4 mb-3 text-xl font-semibold text-primary">{b.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
