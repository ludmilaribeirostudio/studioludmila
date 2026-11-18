file_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\pages\AdminPage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Insert Hero background shape controls right after the intro card in Tab 3 (personalizacao)
target = '{/* SEÇÃO 1: CORES DO RODAPÉ (FOOTER) */}'

hero_shape_control_jsx = """{/* SEÇÃO ESPECIAL: DIVISÃO CURVADA DOURADA DO TOPO (HERO) */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm space-y-6" style={{ background: C.card, border: `1.5px solid ${C.borderGold}` }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2.5">
                  <Sparkles size={20} style={{ color: C.gold }} />
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-semibold" style={{ color: C.text }}>
                      Fundo Dourado Curvado da Abertura (Hero)
                    </h3>
                    <p className="text-xs text-[#6E665E] mt-0.5">
                      Controle a cor, curvatura ou desative deixando o fundo 100% branco/limpo
                    </p>
                  </div>
                </div>

                {/* Switch Ativar / Remover (Deixar todo branco) */}
                <label className="inline-flex items-center gap-3 cursor-pointer select-none bg-[#FAF8F5] px-4 py-2 rounded-2xl border border-gray-200">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-gray-700">
                    {siteContentForm.heroShapeEnabled ? '✦ Fundo Curvado Ativo' : '○ Removido (Todo Branco)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={siteContentForm.heroShapeEnabled !== false && siteContentForm.heroShapeType !== 'nenhum'}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setSiteContentForm((prev) => ({
                        ...prev,
                        heroShapeEnabled: enabled,
                        heroShapeType: enabled ? (prev.heroShapeType === 'nenhum' ? 'curva-organica' : prev.heroShapeType) : 'nenhum',
                      }));
                    }}
                    className="h-4 w-4 rounded accent-[#ab8445] cursor-pointer"
                  />
                </label>
              </div>

              {siteContentForm.heroShapeEnabled !== false && siteContentForm.heroShapeType !== 'nenhum' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Seletor de Formato */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-semibold">
                      Formato da Divisão Curvada
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'curva-organica', label: 'Curva Orgânica (Padrão)', desc: 'Contorna suavemente a foto até a base' },
                        { id: 'onda-suave', label: 'Onda Suave', desc: 'Dupla ondulação moderna e elegante' },
                        { id: 'diagonal-moderna', label: 'Diagonal Moderna', desc: 'Linha reta inclinada de alta tecnologia' },
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setSiteContentForm((prev) => ({ ...prev, heroShapeType: shape.id as any }))}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            siteContentForm.heroShapeType === shape.id
                              ? 'border-[#ab8445] bg-[#FAF5EC] shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <p className="font-serif text-sm font-bold text-[#181513]">{shape.label}</p>
                          <p className="text-[11px] text-[#6E665E] mt-0.5">{shape.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cores do Degradê */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                        Cor Inicial do Degradê
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={siteContentForm.heroShapeColor1 || '#d4b27c'}
                          onChange={(e) => setSiteContentForm((prev) => ({ ...prev, heroShapeColor1: e.target.value }))}
                          className="h-10 w-12 rounded-xl cursor-pointer border border-gray-200 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={siteContentForm.heroShapeColor1 || '#d4b27c'}
                          onChange={(e) => setSiteContentForm((prev) => ({ ...prev, heroShapeColor1: e.target.value }))}
                          className="gb-field font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                        Cor Final (Mesmo tom da Logo)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={siteContentForm.heroShapeColor2 || '#ab8445'}
                          onChange={(e) => setSiteContentForm((prev) => ({ ...prev, heroShapeColor2: e.target.value }))}
                          className="h-10 w-12 rounded-xl cursor-pointer border border-gray-200 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={siteContentForm.heroShapeColor2 || '#ab8445'}
                          onChange={(e) => setSiteContentForm((prev) => ({ ...prev, heroShapeColor2: e.target.value }))}
                          className="gb-field font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                        Intensidade / Opacidade ({siteContentForm.heroShapeOpacity ?? 95}%)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={siteContentForm.heroShapeOpacity ?? 95}
                        onChange={(e) => setSiteContentForm((prev) => ({ ...prev, heroShapeOpacity: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ab8445] mt-3"
                      />
                    </div>
                  </div>

                  {/* Prévia do Degradê */}
                  <div
                    className="h-12 w-full rounded-2xl flex items-center justify-between px-4 text-xs font-mono font-bold text-white shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, ${siteContentForm.heroShapeColor1 || '#d4b27c'} 0%, ${siteContentForm.heroShapeColor2 || '#ab8445'} 100%)`,
                      opacity: (siteContentForm.heroShapeOpacity ?? 95) / 100,
                    }}
                  >
                    <span>✦ Prévia da Cor da Divisão Curvada</span>
                    <span>{siteContentForm.heroShapeColor1 || '#d4b27c'} → {siteContentForm.heroShapeColor2 || '#ab8445'}</span>
                  </div>
                </div>
              )}
            </div>

            """

if target in text:
    text = text.replace(target, hero_shape_control_jsx + target, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('AdminPage.tsx updated with Hero shape controls successfully!')
