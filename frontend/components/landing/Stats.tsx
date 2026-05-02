const stats = [
  { value: '42%', label: 'redução de faltas em média (referência)' },
  { value: '4.8k', label: 'confirmações por mês por clínica' },
  { value: '98%', label: 'satisfação da recepção (pesquisa interna)' },
  { value: '24h', label: 'tempo médio de implantação' },
];

export function Stats() {
  return (
    <section id="recursos" className="bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(224,80%,14%)] via-primary to-[hsl(217,91%,35%)] p-10 shadow-premium lg:p-14">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[hsl(var(--primary-glow)/0.2)] blur-3xl" />

          <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="font-display mb-2 text-5xl font-bold tracking-tight text-primary-foreground lg:text-6xl">
                  {s.value}
                </p>
                <p className="text-sm leading-snug text-primary-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
