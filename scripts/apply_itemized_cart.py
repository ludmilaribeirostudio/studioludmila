import re

app_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx'
with open(app_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Ensure Plus icon is imported from lucide-react
text = text.replace(
    "Check, ChevronRight, ChevronDown, Clock3,",
    "Check, ChevronRight, ChevronDown, Clock3, Plus,"
)

# 2. Add CartItem and helpers right above SERVICES
cart_item_def = """export interface CartItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  label: string;
  price: number;
  priceLabel: string;
}

export function parsePriceNumber(priceStr: string): number {
  if (!priceStr || priceStr.toLowerCase().includes('consulta')) return 0;
  const clean = priceStr.replace('R$', '').trim();
  const match = clean.match(/(\d+(?:\\.\\d+)?(?:,\\d+)?)/);
  if (!match) return 0;
  const numStr = match[1].replace('.', '').replace(',', '.');
  const val = parseFloat(numStr);
  return isNaN(val) ? 0 : val;
}

export function makeCartItemId(serviceId: string, category: string, label: string): string {
  return `${serviceId}_${category}_${label}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

"""

if 'export interface CartItem' not in text:
    target_pos = text.find('const SERVICES: ServiceItem[] = [')
    if target_pos != -1:
        text = text[:target_pos] + cart_item_def + text[target_pos:]

# 3. Replace Services component
services_start = text.find('function Services({')
services_end = text.find('{/* Seção Convite para a Página Dedicada de Cursos */}', services_start)
if services_end == -1:
    services_end = text.find('function CoursesTeaser()', services_start)

new_services_component = """function Services({
  cartItems = [],
  onToggleItem,
  onRemoveItem,
  onGoToBooking,
}: {
  cartItems?: CartItem[];
  onToggleItem?: (item: CartItem) => void;
  onRemoveItem?: (id: string) => void;
  onGoToBooking?: () => void;
}) {
  const [activeModal, setActiveModal] = useState<ServiceItem | null>(null);

  return (
    <section id="servicos" className="scroll-mt-8 py-20 md:py-24 relative" style={{ background: C.card }}>
      <div className="gb-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-xl">
            <SectionEyebrow>Serviços & Cuidados</SectionEyebrow>
            <h2 className="gb-display text-4xl leading-tight md:text-5xl" style={{ color: C.text }}>
              Escolha o seu<br /><em style={{ color: C.gold }}>próximo ritual.</em>
            </h2>
            <p className="mt-3 text-sm text-[#6E665E]">
              Clique em <strong>Saiba mais</strong> para ver todos os procedimentos e acréscimos com valores individuais. Você pode clicar e somar cada procedimento separadamente no carrinho.
            </p>
          </div>
        </div>

        {/* Cards de serviços em 3D nítido com aura de luz dourada */}
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const itemsFromService = cartItems.filter((c) => c.serviceId === service.id);
            const hasItems = itemsFromService.length > 0;

            return (
              <div key={service.id} className="relative group">
                {/* Luz ambiente dourada posicionada atrás do card */}
                <div
                  className="pointer-events-none absolute -inset-2 rounded-3xl opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(171, 132, 69, 0.45) 0%, rgba(197, 158, 95, 0.22) 55%, transparent 75%)',
                  }}
                />

                {/* Card com efeito 3D em relevo elegante */}
                <div
                  onClick={() => setActiveModal(service)}
                  className="relative z-10 flex w-full min-h-[220px] flex-col items-center justify-between overflow-hidden rounded-2xl p-4 text-center transition-all duration-300 cursor-pointer"
                  style={{
                    background: 'linear-gradient(155deg, #FFFFFF 0%, #FAF7F2 60%, #F5EFE6 100%)',
                    border: hasItems ? '2px solid #ab8445' : '1px solid rgba(171, 132, 69, 0.32)',
                    boxShadow: hasItems
                      ? '0 16px 36px -4px rgba(171, 132, 69, 0.35), 0 0 0 1px #ab8445'
                      : '0 12px 28px -4px rgba(171, 132, 69, 0.16), 0 20px 35px -8px rgba(34, 29, 25, 0.08), inset 0 1px 1px #FFFFFF, inset 0 -2px 4px rgba(171, 132, 69, 0.1)',
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
                  {/* Ícone 3D Flutuante com Anel Dourado */}
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{
                      border: '1px solid rgba(171, 132, 69, 0.45)',
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F5EFE6 100%)',
                      color: C.gold,
                      boxShadow: '0 6px 14px rgba(171, 132, 69, 0.18), inset 0 1px 1px #FFFFFF',
                    }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </span>

                  {/* Título do Serviço */}
                  <span className="font-serif text-[14px] font-medium leading-tight my-1.5" style={{ color: C.text }}>
                    {service.title}
                  </span>

                  {/* Badge de Preço com borda dourada delicada */}
                  <span
                    className="rounded-full px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[.12em] font-semibold"
                    style={{
                      background: 'rgba(171, 132, 69, 0.08)',
                      border: '1px solid rgba(171, 132, 69, 0.22)',
                      color: C.gold,
                    }}
                  >
                    {service.detail}
                  </span>

                  {/* Botão Saiba mais elegante */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal(service);
                    }}
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold transition-all shadow-xs"
                    style={{
                      background: hasItems ? '#181513' : '#FFFFFF',
                      color: hasItems ? '#FFFFFF' : '#ab8445',
                      border: hasItems ? '1px solid #181513' : '1px solid #d4b27c',
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

      {/* MODAL DEDICADO DO SERVIÇO COM ITENS INDIVIDUAIS CLICÁVEIS E SOMA SEPARADA */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 text-left shadow-2xl animate-in zoom-in-95 duration-200"
            style={{
              background: '#FAF8F5',
              border: '2px solid #ab8445',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(171, 132, 69, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar Modal */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8E1D5]">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F5EFE6 100%)',
                  border: '1.5px solid #ab8445',
                  color: '#ab8445',
                }}
              >
                {(() => {
                  const Icon = activeModal.icon;
                  return <Icon size={24} strokeWidth={1.8} />;
                })()}
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[.22em] font-bold text-[#ab8445]">
                  ✦ Escolha os Procedimentos Desejados
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#181513]">
                  {activeModal.title}
                </h3>
              </div>
            </div>

            {/* Tags de Destaque & Duração */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider font-bold bg-[#181513] text-white">
                <Clock3 size={12} className="text-[#c59e5f]" /> Duração: {activeModal.duration}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider font-semibold bg-[#FAF4EA] text-[#ab8445] border border-[#ab8445]/30">
                <Sparkles size={11} /> {activeModal.detail}
              </span>
            </div>

            {/* Descrição Detalhada */}
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#4A433B]">
              <p>{activeModal.fullDescription}</p>
            </div>

            {/* Diferenciais */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {activeModal.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl p-2.5 bg-white border border-[#E8E1D5] text-xs font-medium text-[#181513]">
                  <Check size={14} className="text-[#ab8445] shrink-0" strokeWidth={2.5} />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* TABELA DE PREÇOS COM CADA ITEM CLICÁVEL SEPARADAMENTE */}
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-[#181513]">
                    Selecione os Serviços & Variações
                  </h4>
                  <p className="font-sans text-xs text-[#6E665E]">
                    Clique em qualquer opção para adicionar ou remover do seu carrinho
                  </p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ab8445] font-bold">
                  Valores Oficiais
                </span>
              </div>

              {activeModal.pricingSections.map((sec, idx) => (
                <div key={idx} className="rounded-2xl p-4 bg-white border border-[#E8E1D5] shadow-xs space-y-3">
                  <div>
                    <p className="font-serif text-sm font-bold text-[#181513]">{sec.title}</p>
                    {sec.subtitle && (
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#6E665E]">{sec.subtitle}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {sec.items.map((item, itemIdx) => {
                      const itemId = makeCartItemId(activeModal.id, sec.title, item.label);
                      const isSelected = cartItems.some((c) => c.id === itemId);
                      const priceNum = parsePriceNumber(item.price);

                      return (
                        <div
                          key={itemIdx}
                          onClick={() => {
                            if (onToggleItem) {
                              onToggleItem({
                                id: itemId,
                                serviceId: activeModal.id,
                                serviceTitle: activeModal.title,
                                category: sec.title.split('·')[0].trim(),
                                label: item.label,
                                price: priceNum,
                                priceLabel: item.price,
                              });
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF4EA] border-[#ab8445] shadow-xs scale-[1.005]'
                              : 'bg-white border-[#E8E1D5] hover:border-[#ab8445] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-lg border text-xs transition-colors shrink-0 ${
                              isSelected
                                ? 'bg-[#ab8445] text-white border-[#ab8445]'
                                : 'bg-white text-gray-400 border-gray-300'
                            }`}>
                              {isSelected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                            </div>
                            <div>
                              <p className={`text-xs font-semibold ${isSelected ? 'text-[#181513]' : 'text-[#2C2723]'}`}>
                                {item.label}
                              </p>
                              <p className="font-mono text-[9px] uppercase tracking-wider text-[#6E665E]">
                                {sec.title.split('·')[0].trim()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <strong className="font-mono text-xs md:text-sm font-bold text-[#ab8445]">
                              {item.price}
                            </strong>
                            <span className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold transition-all ${
                              isSelected
                                ? 'bg-[#ab8445] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[#181513] border border-gray-200'
                            }`}>
                              {isSelected ? '✓ Adicionado' : '+ Escolher'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* SEÇÃO DE ACRÉSCIMOS & CUIDADOS AVULSOS CLICÁVEIS */}
              {activeModal.addons && activeModal.addons.length > 0 && (
                <div className="rounded-2xl p-4 bg-white border border-[#E8E1D5] space-y-3">
                  <div>
                    <p className="font-serif text-sm font-bold text-[#181513]">Acréscimos & Cuidados Avulsos</p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[#6E665E]">
                      Clique para somar ao agendamento
                    </p>
                  </div>

                  <div className="space-y-2">
                    {activeModal.addons.map((addon, aIdx) => {
                      const addonId = makeCartItemId(activeModal.id, 'Acréscimo', addon.label);
                      const isSelected = cartItems.some((c) => c.id === addonId);
                      const priceNum = parsePriceNumber(addon.price);

                      return (
                        <div
                          key={aIdx}
                          onClick={() => {
                            if (onToggleItem) {
                              onToggleItem({
                                id: addonId,
                                serviceId: activeModal.id,
                                serviceTitle: activeModal.title,
                                category: 'Acréscimo',
                                label: addon.label,
                                price: priceNum,
                                priceLabel: addon.price,
                              });
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF4EA] border-[#ab8445] shadow-xs scale-[1.005]'
                              : 'bg-white border-[#E8E1D5] hover:border-[#ab8445] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-lg border text-xs transition-colors shrink-0 ${
                              isSelected
                                ? 'bg-[#ab8445] text-white border-[#ab8445]'
                                : 'bg-white text-gray-400 border-gray-300'
                            }`}>
                              {isSelected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                            </div>
                            <span className="text-xs font-medium text-[#2C2723]">{addon.label}</span>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-mono text-xs md:text-sm font-bold text-[#ab8445]">
                              {addon.price}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold transition-all ${
                              isSelected
                                ? 'bg-[#ab8445] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[#181513] border border-gray-200'
                            }`}>
                              {isSelected ? '✓ Adicionado' : '+ Escolher'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RODAPÉ DO MODAL COM RESUMO E BOTÕES DE AÇÃO */}
            <div className="mt-7 pt-5 border-t border-[#E8E1D5] space-y-3">
              {(() => {
                const modalItems = cartItems.filter((c) => c.serviceId === activeModal.id);
                const modalTotal = modalItems.reduce((acc, c) => acc + c.price, 0);

                return (
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#ab8445]">
                        ✦ {modalItems.length} {modalItems.length === 1 ? 'item selecionado' : 'itens selecionados'} deste procedimento
                      </span>
                      {modalItems.length > 0 && (
                        <p className="text-[#6E665E] truncate max-w-sm mt-0.5">
                          {modalItems.map((m) => m.label).join(' + ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-[#6E665E] mr-1">Subtotal deste serviço:</span>
                      <strong className="font-serif text-base font-bold text-[#181513]">
                        R$ {modalTotal},00
                      </strong>
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 inline-flex items-center justify-center min-h-[48px] px-6 rounded-full font-mono text-xs uppercase tracking-wider font-semibold bg-white text-[#181513] border-2 border-[#D4C8B5] hover:bg-[#FAF7F2] transition-all"
                >
                  Continuar Escolhendo Outros Serviços
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    if (onGoToBooking) {
                      onGoToBooking();
                    } else {
                      scrollToSection('#agendamento');
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md bg-[#181513] text-white hover:bg-black cursor-pointer"
                >
                  Ver Carrinho & Finalizar Agendamento →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"""

if services_start != -1 and services_end != -1:
    text = text[:services_start] + new_services_component + text[services_end:]

# 4. Update Booking component to accept cartItems and allow removing items
booking_start = text.find('function Booking({')
booking_end = text.find('function CoursesTeaser()', booking_start)
if booking_end == -1:
    booking_end = text.find('{/* Seção Convite para a Página Dedicada de Cursos */}', booking_start)
if booking_end == -1:
    booking_end = text.find('function InstagramCta()', booking_start)

# Let's inspect how Booking ends
new_booking_component = """function Booking({
  cartItems = [],
  onRemoveItem,
  onClearCart,
  onAddItem,
}: {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onAddItem: (item: CartItem) => void;
}) {
  const content = useSiteContent();
  const [step, setStep] = useState<'dados' | 'pagamento' | 'sucesso'>('dados');
  const [serviceError, setServiceError] = useState(false);
  const [timeConflictError, setTimeConflictError] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [existingBookings, setExistingBookings] = useState<BookingType[]>([]);
  const [createdBooking, setCreatedBooking] = useState<BookingType | null>(null);

  // Inicializa data com amanhã útil
  const defaultDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const timeSlots = content.bookingTimeSlots && content.bookingTimeSlots.length > 0
    ? content.bookingTimeSlots
    : AVAILABLE_TIME_SLOTS;

  const [form, setForm] = useState<{
    name: string;
    whatsapp: string;
    date: string;
    time: string;
    observations: string;
    paymentMethod: 'pix' | 'cartao' | 'presencial';
  }>({
    name: '',
    whatsapp: '',
    date: defaultDate,
    time: timeSlots[0] || '09:00',
    observations: '',
    paymentMethod: 'pix',
  });

  useEffect(() => {
    getBookings().then(setExistingBookings);
  }, []);

  function updateField<K extends keyof typeof form>(field: K, value: typeof form[K]) {
    setForm((c) => ({ ...c, [field]: value }));
    if (field === 'date' || field === 'time') {
      setTimeConflictError(false);
    }
  }

  // Soma exata de todos os itens e acréscimos selecionados individualmente no carrinho
  const calculatedTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  function handleGoToPayment(e: FormEvent) {
    e.preventDefault();
    if (cartItems.length === 0) {
      setServiceError(true);
      return;
    }

    const taken = isSlotTaken(existingBookings, form.date, form.time);
    if (taken) {
      setTimeConflictError(true);
      return;
    }

    setStep('pagamento');
  }

  async function handleFinalizeBooking() {
    const serviceNames = cartItems.map((c) => `${c.label} (${c.category}) - R$ ${c.price},00`);

    const newBooking: BookingType = {
      id: 'book-' + Date.now().toString(),
      name: form.name.trim(),
      whatsapp: form.whatsapp.trim(),
      services: serviceNames,
      date: form.date,
      time: form.time,
      observations: form.observations.trim(),
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentMethod === 'pix' ? 'pendente' : 'no_local',
      status: 'pendente',
      estimatedTotal: calculatedTotal,
      createdAt: new Date().toISOString(),
    };

    await saveBooking(newBooking);
    setCreatedBooking(newBooking);

    // Mensagem detalhada para o WhatsApp com cada item discriminado
    const dataFmt = form.date.split('-').reverse().join('/');
    const itemsFormatted = cartItems.map((c) => `  • ${c.label} (${c.category}): ${c.priceLabel}`).join('\\n');

    const msg =
      `Olá Studio Ludmila Ribeiro! Acabei de fazer um pedido de agendamento pelo site:\\n\\n` +
      `👤 *Nome:* ${form.name}\\n` +
      `📱 *WhatsApp:* ${form.whatsapp}\\n` +
      `📅 *Data desejada:* ${dataFmt} às ${form.time}\\n\\n` +
      `💅 *Procedimentos Selecionados:*\\n${itemsFormatted}\\n\\n` +
      `💰 *Total Estimado:* R$ ${calculatedTotal},00\\n` +
      `💳 *Forma de Pagamento:* ${form.paymentMethod.toUpperCase()}\\n` +
      (form.observations ? `📝 *Obs:* ${form.observations}\\n\\n` : `\\n`) +
      `Gostaria de confirmar a disponibilidade e validação do meu horário!`;

    const cleanNumber = content.whatsappNumber || CONTACTS.whatsappNumber;
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    setStep('sucesso');
  }

  function copyPixKey() {
    navigator.clipboard.writeText(content.pixKey || CONTACTS.pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  }

  if (step === 'sucesso' && createdBooking) {
    return (
      <section id="agendamento" className="scroll-mt-8 py-20 md:py-24" style={{ background: C.bgAlt }}>
        <div className="gb-shell">
          <div className="mx-auto max-w-xl text-center rounded-3xl p-10 md:p-14 shadow-sm" style={{ background: C.card, border: `1px solid ${C.borderGold}` }}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ border: `1px solid ${C.borderGold}`, background: C.bg, color: C.gold }}>
              <CheckCircle2 size={32} />
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] font-semibold" style={{ color: C.gold }}>
              Pedido Registrado no Salão
            </p>
            <h2 className="gb-display mt-2 text-3xl md:text-4xl font-medium" style={{ color: C.text }}>
              Seu horário foi pré-reservado!
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed" style={{ color: C.textMuted }}>
              Seu pedido já foi salvo na agenda do Studio para o dia <strong>{createdBooking.date.split('-').reverse().join('/')}</strong> às <strong>{createdBooking.time}</strong>.
            </p>

            <div className="mt-6 rounded-2xl p-5 text-left text-xs space-y-2" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
              <p><strong>Cliente:</strong> {createdBooking.name}</p>
              <div>
                <strong>Serviços:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                  {createdBooking.services.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Forma de Pagamento:</strong> {createdBooking.paymentMethod.toUpperCase()}</p>
              <p><strong>Total Estimado:</strong> R$ {createdBooking.estimatedTotal},00</p>
            </div>

            <p className="mt-5 text-xs" style={{ color: C.textDim }}>
              Nossa equipe já recebeu sua notificação. Caso o WhatsApp não tenha aberto automaticamente, clique no botão abaixo:
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${CONTACTS.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-mono text-[10px] uppercase tracking-wider font-semibold shadow-sm"
                style={{ background: '#25D366', color: '#FFFFFF' }}
              >
                Abrir WhatsApp do Salão <ArrowUpRight size={14} />
              </a>

              <button
                type="button"
                onClick={() => {
                  setStep('dados');
                  onClearCart();
                }}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-[10px] uppercase tracking-wider transition-all"
                style={{ border: `1px solid ${C.border}`, color: C.text, background: C.card }}
              >
                Fazer outro agendamento
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agendamento" className="scroll-mt-8 py-20 md:py-28 relative overflow-hidden" style={{ background: '#FAF8F5' }}>
      {/* Luzes de ambientação douradas 3D */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(171, 132, 69, 0.20), transparent 70%)', filter: 'blur(70px)' }} />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-[500px] w-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(171, 132, 69, 0.16), transparent 70%)', filter: 'blur(60px)' }} />

      <div className="gb-shell relative z-10">
        {/* TABELA/CARD PRINCIPAL 3D DOURADO COM LETRAS BRANCAS & PRETAS DE ALTO DESTAQUE */}
        <div
          className="rounded-3xl p-8 md:p-14 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #d4b27c 0%, #ab8445 35%, #926d32 100%)',
            border: '2px solid rgba(255, 255, 255, 0.85)',
            boxShadow: '0 25px 60px -10px rgba(60, 40, 10, 0.45), 0 16px 32px -8px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.7), inset 0 -3px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          {step === 'dados' ? (
            /* ETAPA 1: SELEÇÃO DE SERVIÇOS & DADOS */
            <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-[.25em] font-bold bg-[#181513] text-white shadow-md border border-white/30 mb-4">
                  ✦ Reserva de Horário
                </span>

                <h2 className="gb-display text-4xl leading-tight md:text-5xl font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                  Vamos reservar<br />
                  <span className="text-white font-serif italic font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    um tempo para você?
                  </span>
                </h2>

                <p className="mt-5 text-sm md:text-[15px] leading-relaxed text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
                  Selecione os procedimentos desejados e seu horário de preferência. Em seguida, você terá acesso à <strong className="text-white underline decoration-white font-bold underline-offset-2">área de pagamento</strong> para confirmar seu pedido sem conflito de horários.
                </p>

                <div className="mt-8 flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-white shadow-md text-[#181513]">
                  <div className="p-2.5 rounded-full bg-[#181513] text-[#c59e5f] shrink-0 shadow-sm">
                    <Clock3 size={18} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#6E665E] font-bold">Atendimento Oficial</p>
                    <p className="text-xs font-bold text-[#181513] mt-0.5">{CONTACTS.hours}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 backdrop-blur-xs border border-white shadow-md text-[#181513]">
                  <div className="p-2.5 rounded-full bg-[#181513] text-[#c59e5f] shrink-0 shadow-sm">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#6E665E] font-bold">Garantia & Exclusividade</p>
                    <p className="text-xs font-bold text-[#181513] mt-0.5">Controle em tempo real para evitar sobreposição de horários.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleGoToPayment} className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[.14em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                      Seu Nome *
                    </span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#181513] bg-white border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#181513] focus:ring-2 focus:ring-[#181513] placeholder-[#8a8075] transition-all"
                      placeholder="Como podemos chamar você?"
                    />
                  </label>
                  <label>
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[.14em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                      WhatsApp *
                    </span>
                    <input
                      required
                      value={form.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#181513] bg-white border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#181513] focus:ring-2 focus:ring-[#181513] placeholder-[#8a8075] transition-all"
                      placeholder="(66) 99999-9999"
                    />
                  </label>
                </div>

                {/* PROCEDIMENTOS DISCRIMINADOS SEPARADAMENTE NO CARRINHO */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-[.14em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                      Procedimentos Selecionados ({cartItems.length})
                    </span>
                    <a
                      href="#servicos"
                      className="font-mono text-[10px] uppercase tracking-wider font-bold text-white bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full border border-white/40 transition-all"
                    >
                      + Abrir Tabela de Serviços
                    </a>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="space-y-2 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border-2 border-white shadow-md">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-[#181513] truncate">{item.label}</p>
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#6E665E]">
                              {item.serviceTitle} · {item.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="font-mono font-bold text-[#ab8445] text-xs">
                              {item.priceLabel}
                            </span>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Remover este procedimento"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#6E665E] font-bold">
                          Total Estimado dos Itens:
                        </span>
                        <strong className="font-serif text-lg font-bold text-[#181513]">
                          R$ {calculatedTotal},00
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl p-5 bg-white/95 border-2 border-white shadow-md text-center space-y-3">
                      <p className="text-xs text-[#6E665E] font-medium">
                        Nenhum procedimento selecionado no momento.
                      </p>
                      <p className="text-[11px] text-[#181513] font-semibold">
                        Escolha diretamente abaixo ou clique na tabela acima:
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {SERVICES.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              onAddItem({
                                id: makeCartItemId(s.id, 'Principal', s.title),
                                serviceId: s.id,
                                serviceTitle: s.title,
                                category: 'Principal',
                                label: s.title,
                                price: s.basePrice,
                                priceLabel: `A partir de R$ ${s.basePrice}`,
                              });
                            }}
                            className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D5] hover:border-[#ab8445] text-[11px] font-bold text-[#181513] transition-all text-left flex items-center justify-between"
                          >
                            <span className="truncate">{s.title}</span>
                            <Plus size={13} className="text-[#ab8445] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {serviceError && (
                    <p className="mt-2 text-xs font-bold text-red-900 bg-white px-3 py-1.5 rounded-xl border border-red-500 shadow-sm inline-block">
                      ⚠ Por favor, selecione pelo menos um procedimento para avançar.
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[.14em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                      Data Preferida *
                    </span>
                    <input
                      required
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#181513] bg-white border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#181513] focus:ring-2 focus:ring-[#181513] transition-all"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[.14em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                      Horário Preferido *
                    </span>
                    <CustomGoldTimeSelect
                      value={form.time}
                      onChange={(val) => updateField('time', val)}
                      timeSlots={timeSlots}
                      existingBookings={existingBookings}
                      date={form.date}
                    />
                  </label>
                </div>

                {timeConflictError && (
                  <div className="flex items-center gap-2 rounded-2xl p-3.5 bg-white border-2 border-red-500 text-red-900 text-xs font-bold shadow-md">
                    <AlertCircle size={18} className="shrink-0 text-red-600" />
                    <span>Este horário já possui uma reserva na data selecionada. Por favor, escolha outro horário livre.</span>
                  </div>
                )}

                <label>
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[.14em] font-bold text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                    Observações (Opcional)
                  </span>
                  <textarea
                    value={form.observations}
                    onChange={(e) => updateField('observations', e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-[#181513] bg-white border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#181513] focus:ring-2 focus:ring-[#181513] placeholder-[#8a8075] transition-all min-h-[75px] resize-y"
                    placeholder="Tem alguma preferência de cor, decoração ou cuidado especial?"
                  />
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 min-h-[52px] px-10 rounded-full font-mono text-xs uppercase tracking-[.16em] font-bold text-[#181513] bg-[#FAF7F2] border-2 border-white shadow-[0_12px_28px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:bg-white hover:text-black hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] transition-all cursor-pointer"
                  >
                    Avançar para Pagamento & Resumo <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ETAPA 2: ÁREA DEDICADA DE PAGAMENTO & FINALIZAÇÃO */
            <div>
              <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-white/40">
                <div>
                  <button
                    type="button"
                    onClick={() => setStep('dados')}
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider mb-2 text-[#181513] font-bold hover:underline"
                  >
                    <ArrowLeft size={16} strokeWidth={2.5} /> Voltar e alterar dados
                  </button>
                  <h3 className="gb-display text-3xl md:text-4xl font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
                    Área de Pagamento & Resumo do Pedido
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-widest mt-1 text-[#181513] font-bold">
                    Finalize para encaminhar ao Studio
                  </p>
                </div>

                <span
                  className="rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider font-bold bg-[#181513] text-white border-2 border-white/60 shadow-lg"
                >
                  Etapa Final
                </span>
              </div>

              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Métodos de Pagamento */}
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-widest font-bold block mb-3 text-[#181513] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                      Selecione a Forma de Pagamento
                    </span>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => updateField('paymentMethod', 'pix')}
                        className={`rounded-2xl p-4 text-left transition-all ${
                          form.paymentMethod === 'pix'
                            ? 'bg-[#181513] text-white border-2 border-black shadow-[0_8px_20px_rgba(0,0,0,0.35)] scale-[1.02]'
                            : 'bg-white text-[#181513] border-2 border-white shadow-md hover:border-[#181513]'
                        }`}
                      >
                        <QrCode size={24} style={{ color: form.paymentMethod === 'pix' ? '#c59e5f' : C.gold }} />
                        <p className="font-serif text-base font-bold mt-2">PIX</p>
                        <p className={`font-mono text-[9px] uppercase tracking-wider font-semibold mt-0.5 ${
                          form.paymentMethod === 'pix' ? 'text-green-300' : 'text-green-700'
                        }`}>
                          ✦ Mais Rápido
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField('paymentMethod', 'cartao')}
                        className={`rounded-2xl p-4 text-left transition-all ${
                          form.paymentMethod === 'cartao'
                            ? 'bg-[#181513] text-white border-2 border-black shadow-[0_8px_20px_rgba(0,0,0,0.35)] scale-[1.02]'
                            : 'bg-white text-[#181513] border-2 border-white shadow-md hover:border-[#181513]'
                        }`}
                      >
                        <CreditCard size={24} style={{ color: form.paymentMethod === 'cartao' ? '#c59e5f' : C.gold }} />
                        <p className="font-serif text-base font-bold mt-2">Cartão</p>
                        <p className={`font-mono text-[9px] uppercase tracking-wider font-semibold mt-0.5 ${
                          form.paymentMethod === 'cartao' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Crédito / Débito
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField('paymentMethod', 'presencial')}
                        className={`rounded-2xl p-4 text-left transition-all ${
                          form.paymentMethod === 'presencial'
                            ? 'bg-[#181513] text-white border-2 border-black shadow-[0_8px_20px_rgba(0,0,0,0.35)] scale-[1.02]'
                            : 'bg-white text-[#181513] border-2 border-white shadow-md hover:border-[#181513]'
                        }`}
                      >
                        <MapPin size={24} style={{ color: form.paymentMethod === 'presencial' ? '#c59e5f' : C.gold }} />
                        <p className="font-serif text-base font-bold mt-2">No Salão</p>
                        <p className={`font-mono text-[9px] uppercase tracking-wider font-semibold mt-0.5 ${
                          form.paymentMethod === 'presencial' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          No Atendimento
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Detalhes de acordo com a opção selecionada */}
                  {form.paymentMethod === 'pix' && (
                    <div className="rounded-2xl p-6 bg-white border-2 border-white shadow-xl text-[#181513]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#ab8445]">
                          Chave Pix Oficial do Studio
                        </span>
                        <span className="text-xs font-bold text-[#181513] bg-[#FAF8F5] px-3 py-1 rounded-full border border-gray-200">
                          CNPJ · Ludmila Ribeiro
                        </span>
                      </div>

                      <div className="mt-3.5 flex items-center justify-between gap-3 rounded-xl p-3.5 bg-[#FAF8F5] border-2 border-[#E8E1D5]">
                        <code className="font-mono text-base font-bold tracking-wider text-[#181513]">
                          {content.pixKey || CONTACTS.pixKey}
                        </code>
                        <button
                          type="button"
                          onClick={copyPixKey}
                          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-[11px] uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
                          style={{
                            background: pixCopied ? '#2E7D32' : '#181513',
                            color: '#FFFFFF',
                          }}
                        >
                          {pixCopied ? (
                            <>
                              <Check size={14} /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copiar Chave
                            </>
                          )}
                        </button>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-[#4A433B] font-medium">
                        Você pode realizar o pagamento ou sinal de agendamento via Pix. O comprovante será enviado junto à confirmação com a equipe do Studio no WhatsApp.
                      </p>
                    </div>
                  )}

                  {form.paymentMethod === 'cartao' && (
                    <div className="rounded-2xl p-6 bg-white border-2 border-white shadow-xl text-[#181513]">
                      <p className="font-serif text-base font-bold text-[#181513]">
                        Pagamento no Cartão
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[#4A433B] font-medium">
                        Aceitamos as principais bandeiras (Visa, Mastercard, Elo). É possível parcelar na máquina do salão ou solicitar link de pagamento antecipado à equipe.
                      </p>
                    </div>
                  )}

                  {form.paymentMethod === 'presencial' && (
                    <div className="rounded-2xl p-6 bg-white border-2 border-white shadow-xl text-[#181513]">
                      <p className="font-serif text-base font-bold text-[#181513]">
                        Pagamento no Atendimento
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[#4A433B] font-medium">
                        O valor será acertado diretamente no Studio após a conclusão do seu atendimento, via Pix, dinheiro ou cartão.
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5 text-xs text-[#181513] font-semibold bg-white/80 p-3.5 rounded-xl border border-white">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#181513]" />
                    <span>
                      Todos os horários ficam salvos na agenda do salão para não haver conflito. O salão faz a confirmação instantânea no seu WhatsApp.
                    </span>
                  </div>
                </div>

                {/* Resumo do Pedido & Botão de Finalizar */}
                <div className="rounded-2xl p-6 md:p-8 flex flex-col justify-between bg-white border-2 border-white shadow-xl text-[#181513]">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#ab8445]">
                      Resumo da Reserva
                    </p>

                    <div className="mt-4 space-y-3 pb-5 text-xs border-b border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-[#6E665E] font-medium">Cliente:</span>
                        <strong className="text-[#181513]">{form.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E665E] font-medium">Contato:</span>
                        <strong className="text-[#181513]">{form.whatsapp}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E665E] font-medium">Data & Horário:</span>
                        <strong className="text-[#ab8445] font-mono font-bold">
                          {form.date.split('-').reverse().join('/')} às {form.time}
                        </strong>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[#6E665E] font-bold mb-2">
                        Procedimentos ({cartItems.length}):
                      </p>
                      <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
                        {cartItems.map((c) => (
                          <div key={c.id} className="flex justify-between items-center text-[#181513] py-1 border-b border-gray-100 last:border-none">
                            <div>
                              <p className="font-semibold">{c.label}</p>
                              <p className="text-[10px] text-gray-500 font-mono">{c.category}</p>
                            </div>
                            <span className="font-mono font-bold text-[#ab8445]">{c.priceLabel}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-[#6E665E] font-bold">
                          Total Estimado
                        </p>
                        <p className="text-[10px] text-gray-500 font-sans">
                          (Confirmado com a equipe)
                        </p>
                      </div>
                      <span className="font-serif text-2xl font-bold text-[#181513]">
                        R$ {calculatedTotal},00
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleFinalizeBooking}
                      className="w-full inline-flex items-center justify-center gap-2.5 min-h-[52px] rounded-full font-mono text-xs uppercase tracking-[.16em] font-bold text-[#181513] bg-[#FAF7F2] border-2 border-[#c59e5f] shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:bg-white hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      Confirmar e Enviar ao WhatsApp <ArrowUpRight size={16} />
                    </button>
                    <p className="mt-2.5 text-center text-[10px] text-gray-500 font-sans">
                      🔒 Seus dados e horário estão protegidos contra conflitos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

"""

if booking_start != -1 and booking_end != -1:
    text = text[:booking_start] + new_booking_component + text[booking_end:]

# 5. Update Home to manage cartItems
home_start = text.find('function Home() {')
home_end = text.find('function Router() {', home_start)

new_home_component = """function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function toggleCartItem(item: CartItem) {
    setCartItems((prev) => {
      const exists = prev.some((c) => c.id === item.id);
      if (exists) {
        return prev.filter((c) => c.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }

  function addCartItem(item: CartItem) {
    setCartItems((prev) => (prev.some((c) => c.id === item.id) ? prev : [...prev, item]));
  }

  function removeCartItem(id: string) {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  }

  function clearCart() {
    setCartItems([]);
  }

  function handleGoToBooking() {
    document.getElementById('agendamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', '#agendamento');
  }

  const totalCart = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-[100dvh] overflow-x-hidden relative" style={{ background: C.bg }}>
      <Header />
      <main>
        <Hero />
        <Services
          cartItems={cartItems}
          onToggleItem={toggleCartItem}
          onRemoveItem={removeCartItem}
          onGoToBooking={handleGoToBooking}
        />
        <About />
        <Booking
          cartItems={cartItems}
          onRemoveItem={removeCartItem}
          onClearCart={clearCart}
          onAddItem={addCartItem}
        />
        <CoursesTeaser />
        <InstagramCta />
      </main>
      <Footer />

      {/* CARRINHO FLUTUANTE DE PROCEDIMENTOS SEPARADOS */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div
            className="rounded-3xl p-4 md:p-5 shadow-2xl backdrop-blur-md space-y-3"
            style={{
              background: '#181513',
              border: '2px solid #ab8445',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(171, 132, 69, 0.35)',
            }}
          >
            {/* Linha Principal do Carrinho */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ab8445] text-white shrink-0 shadow-md">
                  <ShoppingBag size={20} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#c59e5f]">
                      ✦ {cartItems.length} {cartItems.length === 1 ? 'Procedimento' : 'Procedimentos'} no Carrinho
                    </span>
                  </div>
                  <p className="font-mono text-xs md:text-sm font-bold text-white mt-0.5">
                    Total Estimado: <span className="text-[#c59e5f] font-serif text-base font-bold">R$ {totalCart},00</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <button
                  type="button"
                  onClick={clearCart}
                  className="px-3 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Limpar todos os itens do carrinho"
                >
                  Limpar
                </button>

                <button
                  type="button"
                  onClick={handleGoToBooking}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #d4b27c 0%, #ab8445 100%)',
                    color: '#FFFFFF',
                  }}
                >
                  Finalizar Agendamento <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Lista dos Itens Selecionados com Botão 'X' para remover individualmente */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10 max-h-24 overflow-y-auto">
              {cartItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-white/10 text-white border border-white/20"
                >
                  <span className="truncate max-w-[170px]">{item.label}</span>
                  <span className="text-[#c59e5f] font-mono text-[10px] font-bold">
                    {item.price > 0 ? `R$ ${item.price}` : 'Cons.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCartItem(item.id)}
                    className="p-0.5 rounded-full hover:bg-red-500/80 hover:text-white text-gray-400 transition-colors cursor-pointer"
                    title={`Remover ${item.label}`}
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"""

if home_start != -1 and home_end != -1:
    text = text[:home_start] + new_home_component + text[home_end:]

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated App.tsx successfully with individual itemized cart!')
