const testimonials = [
  {
    quote:
      'Em duas semanas as faltas caíram pela metade. A recepção finalmente respira e os pacientes adoram o lembrete pelo WhatsApp.',
    author: 'Dra. Marina Souza',
    role: 'Diretora · Clínica VitaClin',
    initials: 'MS',
  },
  {
    quote:
      'Substituímos várias planilhas por um único painel. Ver ocupação em tempo real mudou nossa rotina.',
    author: 'Carlos Mendes',
    role: 'Gestor · MedCare São Paulo',
    initials: 'CM',
  },
  {
    quote: 'A equipe adotou em um dia. Interface objetiva e confiável para o dia a dia.',
    author: 'Dra. Beatriz Lima',
    role: 'Sócia · BemEstar Clínica',
    initials: 'BL',
  },
];

export function Testimonials() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Depoimentos</span>
          <h2 className="font-display mt-3 mb-5 text-4xl font-bold text-primary md:text-5xl">
            Resultados reais, em clínicas reais
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="relative rounded-2xl border border-border/60 bg-gradient-to-b from-card to-secondary/10 p-7 shadow-card transition-all hover:shadow-elegant"
            >
              <span className="font-display mb-3 block text-5xl leading-none text-accent/30">&ldquo;</span>
              <p className="mb-6 leading-relaxed text-primary">{t.quote}</p>
              <div className="flex items-center gap-3 border-t border-border/60 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
