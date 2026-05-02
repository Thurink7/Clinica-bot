const faqs = [
  {
    q: 'Quanto tempo leva para implementar a plataforma?',
    a: 'No MVP, você configura expediente e profissionais em poucos minutos. Integrações avançadas seguem o roadmap do produto.',
  },
  {
    q: 'Funciona com WhatsApp?',
    a: 'Sim. O backend está preparado para fluxos de mensagens e webhooks; configure tokens e números conforme o provedor.',
  },
  {
    q: 'A plataforma respeita a LGPD?',
    a: 'Trate dados de saúde com políticas internas da clínica. O produto evolui para trilhas de auditoria e consentimento mais explícitos.',
  },
  {
    q: 'Como faço login no painel?',
    a: 'O acesso é validado na API com usuários armazenados no Firestore (coleção admin_users). O administrador cria credenciais ou usa variáveis de bootstrap no servidor.',
  },
  {
    q: 'Existe fidelidade ou taxa de cancelamento?',
    a: 'Sem fidelidade no modelo atual; combine condições comerciais diretamente com a equipe.',
  },
  {
    q: 'Como funciona o suporte?',
    a: 'Canais por e-mail e documentação do repositório. Planos pagos podem incluir suporte prioritário.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">FAQ</span>
            <h2 className="font-display mt-3 mb-5 text-4xl font-bold text-primary md:text-5xl">Perguntas frequentes</h2>
            <p className="leading-relaxed text-muted-foreground">
              Dúvidas sobre o MVP e o painel administrativo.
            </p>
          </div>

          <div className="space-y-3 lg:col-span-8">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-border/60 bg-gradient-to-b from-card to-secondary/10 px-6 shadow-card open:shadow-elegant"
              >
                <summary className="cursor-pointer list-none py-5 font-display font-semibold text-primary [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="text-accent transition group-open:rotate-180">▼</span>
                  </span>
                </summary>
                <p className="border-t border-border/40 pb-5 pt-2 leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
