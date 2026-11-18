file_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Guia de Atendimento to rich translucent gold (dourado mais meio transparente, bem perceptível e elegante)
old_guia_snippet = '''          {/* Guia de Atendimento — Dourado Transparente Glassmorphism */}
          <div
            className="rounded-2xl p-7 md:p-9 shadow-lg backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(171, 132, 69, 0.10) 0%, rgba(197, 158, 95, 0.06) 50%, rgba(171, 132, 69, 0.12) 100%)',
              border: '1.5px solid rgba(171, 132, 69, 0.30)',
              boxShadow: '0 12px 32px rgba(171, 132, 69, 0.10), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
            }}
          >'''

new_guia_snippet = '''          {/* Guia de Atendimento — Dourado Rico Translúcido Glassmorphism */}
          <div
            className="rounded-3xl p-7 md:p-9 shadow-2xl backdrop-blur-md relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 178, 124, 0.38) 0%, rgba(171, 132, 69, 0.30) 50%, rgba(146, 109, 50, 0.35) 100%)',
              border: '2px solid rgba(171, 132, 69, 0.50)',
              boxShadow: '0 24px 50px -12px rgba(171, 132, 69, 0.32), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >'''

text = text.replace(old_guia_snippet, new_guia_snippet)

# Also update the inner typography of Guia de Atendimento for high contrast against the richer golden glass
old_guia_inner = '''                <div key={label} className="border-b pb-3.5 last:border-0 last:pb-0" style={{ borderColor: 'rgba(171, 132, 69, 0.18)' }}>
                  <p className="font-mono text-[9px] uppercase tracking-[.16em] font-semibold" style={{ color: C.gold }}>
                    {label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: C.textMuted }}>
                    {text}
                  </p>
                </div>'''

new_guia_inner = '''                <div key={label} className="border-b pb-3.5 last:border-0 last:pb-0" style={{ borderColor: 'rgba(171, 132, 69, 0.28)' }}>
                  <p className="font-mono text-[9.5px] uppercase tracking-[.18em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
                    {label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-[#2C241E]">
                    {text}
                  </p>
                </div>'''

text = text.replace(old_guia_inner, new_guia_inner)

# 2. Service Cards: 3 on top row, 3 on bottom row (lg:grid-cols-3), bigger, tech-modern, always-on golden glow
old_services_grid = '''        {/* Cards de serviços em 3D nítido com aura de luz dourada */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">'''

new_services_grid = '''        {/* Cards de serviços modernos em 3D de alta tecnologia (3 na fila de cima, 3 na de baixo) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">'''

text = text.replace(old_services_grid, new_services_grid)

# Make the always-on golden glow behind the cards more vivid and permanently illuminated
old_card_glow = '''                {/* Luz ambiente dourada posicionada atrás do card */}
                <div
                  className="pointer-events-none absolute -inset-3 rounded-3xl opacity-70 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(171, 132, 69, 0.45) 0%, rgba(197, 158, 95, 0.22) 55%, transparent 75%)',
                  }}
                />'''

new_card_glow = '''                {/* Luz ambiente dourada SEMPRE ACESA com aura tecnológica atrás do card */}
                <div
                  className="pointer-events-none absolute -inset-4 rounded-3xl opacity-85 blur-2xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-3xl group-hover:scale-105"
                  style={{
                    background: 'radial-gradient(circle, rgba(212, 178, 124, 0.55) 0%, rgba(171, 132, 69, 0.38) 45%, rgba(146, 109, 50, 0.20) 70%, transparent 85%)',
                  }}
                />'''

text = text.replace(old_card_glow, new_card_glow)

# Enhance card container size, padding, modern glass-metallic feel
old_card_body = '''                {/* Card com efeito 3D em relevo elegante */}
                <div
                  onClick={() => setActiveModal(service)}
                  className="relative z-10 flex w-full min-h-[240px] flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl p-7 text-center transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'linear-gradient(155deg, #FFFFFF 0%, #FAF7F2 60%, #F5EFE6 100%)',
                    border: hasItems ? '2px solid #ab8445' : '1px solid rgba(171, 132, 69, 0.32)',
                    boxShadow: hasItems
                      ? '0 16px 36px -4px rgba(171, 132, 69, 0.35), 0 0 0 1px #ab8445'
                      : '0 12px 28px -4px rgba(171, 132, 69, 0.16), 0 20px 35px -8px rgba(34, 29, 25, 0.08), inset 0 1px 1px #FFFFFF, inset 0 -2px 4px rgba(171, 132, 69, 0.1)',
                  }}'''

new_card_body = '''                {/* Card com efeito 3D em relevo elegante e alta tecnologia */}
                <div
                  onClick={() => setActiveModal(service)}
                  className="relative z-10 flex w-full min-h-[270px] flex-col items-center justify-between gap-3.5 overflow-hidden rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer backdrop-blur-xs"
                  style={{
                    background: 'linear-gradient(155deg, #FFFFFF 0%, #FAF8F5 55%, #F4ECE0 100%)',
                    border: hasItems ? '2px solid #ab8445' : '1.5px solid rgba(171, 132, 69, 0.40)',
                    boxShadow: hasItems
                      ? '0 20px 42px -4px rgba(171, 132, 69, 0.40), 0 0 0 2px #ab8445, inset 0 2px 2px #FFFFFF'
                      : '0 16px 36px -6px rgba(171, 132, 69, 0.22), 0 24px 45px -10px rgba(34, 29, 25, 0.08), inset 0 1.5px 2px #FFFFFF, inset 0 -2px 4px rgba(171, 132, 69, 0.12)',
                  }}'''

text = text.replace(old_card_body, new_card_body)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated App.tsx successfully!')
