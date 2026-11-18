file_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Hero component with dynamic curved background
hero_start = text.find('function Hero() {')
hero_end = text.find('function Services(', hero_start)

new_hero = """function Hero() {
  const heroImg = useSiteImage('hero_ludmila', '/images/ludmila-hero.jpg');
  const content = useSiteContent();

  const isShapeActive = content.heroShapeEnabled !== false && content.heroShapeType !== 'nenhum';
  const shapeType = content.heroShapeType || 'curva-organica';
  const color1 = content.heroShapeColor1 || '#d4b27c';
  const color2 = content.heroShapeColor2 || '#ab8445';
  const opacityVal = (content.heroShapeOpacity ?? 95) / 100;

  // Path SVG conforme o formato escolhido no Painel ADM
  const getShapePath = () => {
    switch (shapeType) {
      case 'onda-suave':
        return 'M 650,0 C 580,200 700,450 620,650 C 560,800 680,880 620,900 L 1440,900 L 1440,0 Z';
      case 'diagonal-moderna':
        return 'M 750,0 L 520,900 L 1440,900 L 1440,0 Z';
      case 'curva-organica':
      default:
        // Curva orgânica contornando a foto de Ludmila até a base da seção
        return 'M 690,0 C 620,160 550,320 590,500 C 630,680 560,820 510,900 L 1440,900 L 1440,0 Z';
    }
  };

  return (
    <section id="inicio" className="relative flex min-h-[680px] lg:min-h-[730px] items-center overflow-hidden py-16 md:py-24" style={{ background: C.bg }}>
      {/* DIVISÃO CURVADA DOURADA EDITÁVEL (PAINEL ADM) */}
      {isShapeActive && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full transition-all duration-700 hidden sm:block"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hero-curved-gold" x1="30%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1} stopOpacity={opacityVal} />
              <stop offset="100%" stopColor={color2} stopOpacity={opacityVal} />
            </linearGradient>
            <filter id="gold-wave-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="-10" dy="0" stdDeviation="20" floodColor="#ab8445" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Forma Curvada / Onda Preenchida */}
          <path
            d={getShapePath()}
            fill="url(#hero-curved-gold)"
            filter="url(#gold-wave-shadow)"
          />

          {/* Linha de brilho reflexivo na borda da curva */}
          <path
            d={getShapePath().split(' L 1440')[0]}
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      )}

      {/* Luz ambiente suave decorativa */}
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full" style={{ background: `radial-gradient(circle, rgba(171, 132, 69, 0.15), transparent 70%)`, filter: 'blur(50px)' }} />

      <div className="gb-shell relative z-10 w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Lado Esquerdo - Frase Oficial */}
          <div className="max-w-[680px] gb-reveal">
            <h1
              className="gb-display text-[clamp(2.4rem,5.4vw,4.5rem)] leading-[1.08] font-normal"
              style={{ color: C.text }}
            >
              {content.heroTitleLead}
              <span
                className="block mt-4 text-[clamp(2.1rem,4.8vw,4.1rem)] font-light tracking-[.16em]"
                style={{
                  color: C.gold,
                  letterSpacing: '0.14em',
                }}
              >
                {content.heroTitleHighlight}
              </span>
            </h1>
          </div>

          {/* Lado Direito - Moldura Arqueada Delicada com a Foto de Ludmila */}
          <div className="relative flex items-center justify-center gb-reveal gb-reveal-delay">
            {/* Brilho decorativo dourado ao redor do arco */}
            <div className="absolute -inset-4 rounded-t-[220px] rounded-b-3xl opacity-50 blur-2xl" style={{ background: `radial-gradient(circle, rgba(171, 132, 69, 0.40), transparent 70%)` }} />

            {/* Foto no arco clássico da identidade */}
            <div
              className="relative w-full max-w-[380px] aspect-[3/4] overflow-hidden rounded-t-[200px] rounded-b-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
              style={{
                border: '1.5px solid rgba(255, 255, 255, 0.85)',
                background: C.card,
                boxShadow: '0 28px 65px rgba(0, 0, 0, 0.15), 0 10px 25px rgba(171, 132, 69, 0.25)',
              }}
            >
              <img
                src={heroImg}
                alt="Ludmila Ribeiro - Nail Designer"
                className="h-full w-full object-cover object-top"
              />

              {/* Degradê suave na base */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(250, 248, 245, 0.9) 0%, rgba(250, 248, 245, 0) 35%)' }} />

              {/* Tag elegante flutuante com borda dourada */}
              <div
                className="absolute bottom-5 left-5 right-5 rounded-xl px-5 py-3.5 backdrop-blur-md shadow-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.94)',
                  border: `1px solid ${C.borderGold}`,
                }}
              >
                <p className="font-serif text-sm font-semibold tracking-wide" style={{ color: C.text }}>
                  {content.heroBadgeName}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest mt-0.5" style={{ color: C.gold }}>
                  {content.heroBadgeSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"""

if hero_start != -1 and hero_end != -1:
    text = text[:hero_start] + new_hero + text[hero_end:]

# Atualiza também o Guia de Atendimento com fundo dourado translúcido bem evidente e nítido
old_guia = text.find('{/* Guia de Atendimento')
if old_guia != -1:
    end_guia = text.find('</div>\n          </div>\n        </div>\n      </div>\n    </section>', old_guia)
    if end_guia != -1:
        new_guia_block = """{/* Guia de Atendimento — Dourado Translúcido Rico de Luxo */}
          <div
            className="rounded-3xl p-7 md:p-9 shadow-2xl backdrop-blur-md relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 178, 124, 0.50) 0%, rgba(171, 132, 69, 0.42) 50%, rgba(146, 109, 50, 0.46) 100%)',
              border: '2px solid rgba(171, 132, 69, 0.65)',
              boxShadow: '0 24px 50px -12px rgba(171, 132, 69, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.15)',
            }}
          >
            <SectionEyebrow>Guia de Atendimento</SectionEyebrow>
            <div className="space-y-4">
              {[
                { label: 'Horário de Atendimento', text: content.hours },
                { label: 'Diante de Imprevistos', text: 'Pedimos aviso com 24h de antecedência sempre que possível.' },
                { label: 'Não Comparecimento', text: 'Cancelamentos sem aviso prévio estarão sujeitos a taxa de 40% do valor agendado.' },
                { label: 'Pontualidade', text: 'Em caso de atraso superior a 15 minutos, o horário poderá ser ajustado ou reagendado.' },
                { label: 'Chegue com Calma', text: 'Recomendamos chegar com 10 minutos de antecedência para desfrutar da sua experiência.' },
                { label: 'Acompanhantes', text: 'Permitidos apenas em casos de extrema necessidade para preservar o ambiente de tranquilidade.' },
              ].map(({ label, text }) => (
                <div key={label} className="border-b pb-3.5 last:border-0 last:pb-0" style={{ borderColor: 'rgba(171, 132, 69, 0.28)' }}>
                  <p className="font-mono text-[9.5px] uppercase tracking-[.18em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                    {label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-[#2C241E]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>"""
        text = text[:old_guia] + new_guia_block + text[end_guia + len('</div>\n          </div>'):]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('App.tsx updated with dynamic editable hero curve and rich golden glass!')
