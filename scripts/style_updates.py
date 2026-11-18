file_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. GUIA DE ATENDIMENTO: solid -> golden transparent glassmorphism
old_guia = '''          {/* Guia de Atendimento */}
          <div className="rounded-2xl p-7 md:p-9 shadow-sm" style={{ border: `1px solid ${C.border}`, background: C.bg }}>'''

new_guia = '''          {/* Guia de Atendimento — Dourado Transparente Glassmorphism */}
          <div
            className="rounded-2xl p-7 md:p-9 shadow-lg backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(171, 132, 69, 0.10) 0%, rgba(197, 158, 95, 0.06) 50%, rgba(171, 132, 69, 0.12) 100%)',
              border: '1.5px solid rgba(171, 132, 69, 0.30)',
              boxShadow: '0 12px 32px rgba(171, 132, 69, 0.10), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
            }}
          >'''

text = text.replace(old_guia, new_guia)

# Also update the separator border colors inside to match transparent style
old_border_guia = '''style={{ borderColor: C.border }}>
                  <p className="font-mono text-[9px] uppercase tracking-[.16em] font-semibold" style={{ color: C.gold }}>'''

new_border_guia = '''style={{ borderColor: 'rgba(171, 132, 69, 0.18)' }}>
                  <p className="font-mono text-[9px] uppercase tracking-[.16em] font-semibold" style={{ color: C.gold }}>'''

text = text.replace(old_border_guia, new_border_guia)

# 2. SERVICES GRID: change from 6 columns to 3 columns (3x2), bigger cards with always-on glow
old_grid = 'className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"'
new_grid = 'className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"'
text = text.replace(old_grid, new_grid)

# Make cards taller and more spacious
old_card_min = 'className="relative z-10 flex w-full min-h-[220px] flex-col items-center justify-between overflow-hidden rounded-2xl p-4 text-center transition-all duration-300 cursor-pointer"'
new_card_min = 'className="relative z-10 flex w-full min-h-[240px] flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl p-7 text-center transition-all duration-300 cursor-pointer"'
text = text.replace(old_card_min, new_card_min)

# Make glow always visible (opacity-50 -> opacity-70, plus group-hover still intensifies)
old_glow = 'className="pointer-events-none absolute -inset-2 rounded-3xl opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"'
new_glow = 'className="pointer-events-none absolute -inset-3 rounded-3xl opacity-70 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"'
text = text.replace(old_glow, new_glow)

# Bigger icon circle
old_icon_circle = 'className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"'
new_icon_circle = 'className="flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"'
text = text.replace(old_icon_circle, new_icon_circle)

# Bigger icon size
old_icon_size = '<Icon size={20} strokeWidth={1.5} />'
new_icon_size = '<Icon size={24} strokeWidth={1.5} />'
text = text.replace(old_icon_size, new_icon_size)

# Bigger service title text
old_title_font = 'className="font-serif text-[14px] font-medium leading-tight my-1.5"'
new_title_font = 'className="font-serif text-base md:text-lg font-medium leading-tight"'
text = text.replace(old_title_font, new_title_font)

# Add description text under each card title
old_detail_badge = '''                  {/* Badge de Preço com borda dourada delicada */}
                  <span
                    className="rounded-full px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[.12em] font-semibold"'''

new_detail_badge = '''                  {/* Descrição breve do serviço */}
                  <p className="text-[11px] leading-relaxed max-w-[220px]" style={{ color: C.textMuted }}>
                    {service.tagline}
                  </p>

                  {/* Badge de Preço com borda dourada delicada */}
                  <span
                    className="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[.12em] font-semibold"'''

text = text.replace(old_detail_badge, new_detail_badge)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Done! Guia de Atendimento is now golden-transparent and Service cards are 3x2 grid with always-on glow.')
