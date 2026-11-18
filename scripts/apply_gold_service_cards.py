app_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Locate the services cards grid block
grid_start = text.find('{/* Cards de serviços')
grid_end = text.find('{/* MODAL DEDICADO DO SERVIÇO', grid_start)

new_grid_block = """{/* Cards de serviços: 2 em 2 no celular, 3 em 3 no desktop, em degradê DOURADO com letras BRANCAS e botão SAIBA MAIS ESCURO */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-7">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const itemsFromService = cartItems.filter((c) => c.serviceId === service.id);
            const hasItems = itemsFromService.length > 0;

            return (
              <div key={service.id} className="relative group">
                {/* Luz ambiente dourada SEMPRE ACESA com aura tecnológica atrás do card */}
                <div
                  className="pointer-events-none absolute -inset-2.5 sm:-inset-4 rounded-3xl opacity-75 blur-xl sm:blur-2xl transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                  style={{
                    background: 'radial-gradient(circle, rgba(212, 178, 124, 0.60) 0%, rgba(171, 132, 69, 0.45) 45%, transparent 75%)',
                  }}
                />

                {/* Card DOURADO com efeito 3D em relevo e letras BRANCAS */}
                <div
                  onClick={() => setActiveModal(service)}
                  className="relative z-10 flex w-full min-h-[220px] sm:min-h-[250px] md:min-h-[270px] flex-col items-center justify-between gap-2.5 sm:gap-3.5 overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 text-center transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, #d8b884 0%, #ab8445 45%, #8d662c 100%)',
                    border: hasItems ? '2.5px solid #FFFFFF' : '2px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: hasItems
                      ? '0 20px 45px -5px rgba(0, 0, 0, 0.35), 0 0 0 2px #FFFFFF, inset 0 2px 3px rgba(255, 255, 255, 0.8), inset 0 -3px 5px rgba(0, 0, 0, 0.3)'
                      : '0 16px 36px -6px rgba(171, 132, 69, 0.40), 0 10px 22px -6px rgba(0, 0, 0, 0.25), inset 0 2px 2px rgba(255, 255, 255, 0.7), inset 0 -2px 4px rgba(0, 0, 0, 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-6px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0) scale(1)';
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveModal(service); }}
                  aria-label={`${service.title} - Saiba mais`}
                >
                  {/* Ícone 3D Flutuante com Anel Translúcido e Branco */}
                  <span
                    className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 shrink-0"
                    style={{
                      border: '1.5px solid rgba(255, 255, 255, 0.85)',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.12) 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 1px #FFFFFF',
                    }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
                  </span>

                  {/* Título do Serviço em BRANCO com relevo */}
                  <span className="font-serif text-sm sm:text-base md:text-lg font-medium leading-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.45)]">
                    {service.title}
                  </span>

                  {/* Descrição breve do serviço em BRANCO SUAVE (oculta ou compacta no mobile) */}
                  <p className="text-[10px] sm:text-[11px] leading-tight sm:leading-relaxed max-w-[220px] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] line-clamp-2">
                    {service.tagline}
                  </p>

                  {/* Badge de Preço com borda branca delicada */}
                  <span
                    className="rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[.12em] font-bold text-white shadow-xs"
                    style={{
                      background: 'rgba(255, 255, 255, 0.20)',
                      border: '1px solid rgba(255, 255, 255, 0.50)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {service.detail}
                  </span>

                  {/* Botão Saiba mais no TOM MAIS ESCURO */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal(service);
                    }}
                    className="mt-1 sm:mt-2 inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer hover:scale-105"
                    style={{
                      background: hasItems ? '#2E7D32' : '#181513',
                      color: '#FFFFFF',
                      border: '1.5px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)',
                    }}
                  >
                    {hasItems ? `✓ ${itemsFromService.length} no Carrinho` : 'Saiba mais'} <ChevronRight size={11} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      """

if grid_start != -1 and grid_end != -1:
    text = text[:grid_start] + new_grid_block + text[grid_end:]

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Services cards with gold background, white text, dark Saiba mais button, and 2-col mobile layout!')
