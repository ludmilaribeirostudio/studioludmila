import re

file_path = r'c:\Users\Usuario\Downloads\Ludmila Ribeiro\Luxury-Website-Studio\artifacts\gente-bonita\src\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update React and Lucide imports
text = text.replace(
    "import { useState, useEffect, type FormEvent, type ReactNode } from 'react';",
    "import { useState, useEffect, useRef, type FormEvent, type ReactNode } from 'react';"
)

old_lucide = """import {
  ArrowDown, ArrowLeft, ArrowUpRight, Check, ChevronRight, Clock3,
  GraduationCap, Instagram, Menu, Shield,
  Sparkles, Star, X, Gem, Scissors, Brush, Heart, MapPin, Phone,
  Lock, Copy, CheckCircle2, Calendar, CreditCard, QrCode, AlertCircle
} from 'lucide-react';"""

new_lucide = """import {
  ArrowDown, ArrowLeft, ArrowUpRight, Check, ChevronRight, ChevronDown, Clock3,
  GraduationCap, Instagram, Menu, Shield, ShoppingBag, Trash2,
  Sparkles, Star, X, Gem, Scissors, Brush, Heart, MapPin, Phone,
  Lock, Copy, CheckCircle2, Calendar, CreditCard, QrCode, AlertCircle
} from 'lucide-react';"""

text = text.replace(old_lucide, new_lucide)

# 2. Enrich SERVICES definition
services_start = text.find('const SERVICES = [')
services_end = text.find('function scrollToSection', services_start)

new_services_code = """export interface ServicePriceOption {
  label: string;
  price: string;
}

export interface ServicePricingSection {
  title: string;
  subtitle?: string;
  items: ServicePriceOption[];
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  detail: string;
  basePrice: number;
  duration: string;
  icon: any;
  highlights: string[];
  fullDescription: string;
  pricingSections: ServicePricingSection[];
  addons?: ServicePriceOption[];
}

const SERVICES: ServiceItem[] = [
  {
    id: 'alongamento',
    title: 'Alongamento em Fibra',
    tagline: 'Alongamento técnico com acabamento natural, curvatura e estrutura personalizada.',
    description: 'Alongamento técnico com acabamento natural, curvatura e estrutura personalizada.',
    detail: 'A partir de R$ 200',
    basePrice: 200,
    duration: '2h a 3h',
    icon: Gem,
    highlights: [
      'Filamentos de fibra ultrafina de alta pureza',
      'Curvatura C simétrica e ponto de tensão equilibrado',
      'Acabamento slim idêntico à unha natural',
      'Esterilização hospitalar e biossegurança rigorosa'
    ],
    fullDescription: 'Técnica de excelência com filamentos de fibra de vidro moldados individualmente sobre a lâmina natural. Proporciona resistência mecânica exemplar, acabamento ultrafino que não pesa e curvatura personalizada que valoriza o formato das suas mãos.',
    pricingSections: [
      {
        title: 'Ludmila Ribeiro · Atendimento Exclusivo',
        subtitle: 'Duração: 2 a 3 horas · Atendimento personalizado',
        items: [
          { label: 'Aplicação com esmaltação em gel', price: 'R$ 295,00' },
          { label: 'Aplicação com decoração simples', price: 'R$ 295,00' },
          { label: 'Aplicação natural', price: 'R$ 280,00' },
          { label: 'Aplicação com decoração complexa', price: 'Sob consulta' },
        ]
      },
      {
        title: 'Equipe Studio Ludmila',
        subtitle: 'Profissionais qualificadas pelo padrão Ludmila Ribeiro',
        items: [
          { label: 'Aplicação Decorada Simples', price: 'R$ 220,00' },
          { label: 'Aplicação Natural', price: 'R$ 200,00' },
        ]
      }
    ],
    addons: [
      { label: 'Jóias delicadas (par)', price: 'R$ 15,00' },
      { label: 'Reposição de unha quebrada', price: 'R$ 10,00' },
      { label: 'Remoção de alongamento com higienização', price: 'R$ 60,00' },
    ]
  },
  {
    id: 'manutencao',
    title: 'Manutenção de Fibra',
    tagline: 'Essencial para a saúde e resistência das unhas. Recomendada de 15 a 20 dias.',
    description: 'Essencial para a saúde e resistência das unhas. Recomendada de 15 a 20 dias.',
    detail: 'A partir de R$ 140',
    basePrice: 140,
    duration: '1h30 a 2h',
    icon: Scissors,
    highlights: [
      'Preservação integral da lâmina ungueal',
      'Reposicionamento do ponto de tensão',
      'Nivelamento perfeito e novo brilho espelhado',
      'Intervalo ideal: 15 a 20 dias'
    ],
    fullDescription: 'Procedimento indispensável para garantir a integridade da sua lâmina natural e evitar infiltrações ou quebras. Nivelamos o crescimento, alinhamos a simetria, recolocamos o gel estrutural e renovamos o acabamento brilhante ou a sua cor favorita.',
    pricingSections: [
      {
        title: 'Ludmila Ribeiro · Atendimento Exclusivo',
        subtitle: 'Recomendado de 15 a 20 dias',
        items: [
          { label: 'Manutenção com esmaltação em gel', price: 'R$ 180,00' },
          { label: 'Manutenção com decoração simples', price: 'R$ 180,00' },
          { label: 'Manutenção natural', price: 'R$ 160,00' },
          { label: 'Manutenção com decoração complexa', price: 'Sob consulta' },
        ]
      },
      {
        title: 'Equipe Studio Ludmila',
        subtitle: 'Recomendado de 15 a 30 dias',
        items: [
          { label: 'Manutenção Decorada Simples', price: 'R$ 160,00' },
          { label: 'Manutenção Natural', price: 'R$ 140,00' },
        ]
      }
    ],
    addons: [
      { label: 'Reposição avulsa durante a manutenção', price: 'R$ 10,00' },
      { label: 'Troca total de formato / arte complexa', price: 'Sob consulta' },
    ]
  },
  {
    id: 'banho-gel',
    title: 'Banho de Gel',
    tagline: 'Camada protetora nas unhas naturais que promove fortalecimento e crescimento saudável.',
    description: 'Camada protetora nas unhas naturais que promove fortalecimento e crescimento saudável.',
    detail: 'A partir de R$ 130',
    basePrice: 130,
    duration: '1h30 a 2h',
    icon: Sparkles,
    highlights: [
      'Blindagem sem alterar o comprimento natural',
      'Evita descamações, lascas e quebras',
      'Brilho espelhado de alta durabilidade',
      'Esmaltação tradicional dura até 3x mais'
    ],
    fullDescription: 'Uma blindagem sofisticada realizada com gel de alta aderência sobre a sua própria unha, sem qualquer prótese ou extensão. Indicada para clientes que desejam unhas naturais compridas e protegidas contra as agressões diárias, com aspecto polido e sofisticado.',
    pricingSections: [
      {
        title: 'Tabela de Banho de Gel',
        subtitle: 'Tempo médio: 1h30 a 2h',
        items: [
          { label: 'Aplicação inicial de blindagem', price: 'R$ 130,00' },
          { label: 'Manutenção natural', price: 'R$ 140,00' },
          { label: 'Aplicação com esmaltação em gel', price: 'R$ 160,00' },
        ]
      }
    ]
  },
  {
    id: 'manicure-pedicure',
    title: 'Manicure & Pedicure',
    tagline: 'Cuidado clássico e minucioso para unhas e cutículas com acabamento impecável.',
    description: 'Cuidado clássico e minucioso para unhas e cutículas com acabamento impecável.',
    detail: 'R$ 40 a R$ 90',
    basePrice: 90,
    duration: '45min a 1h30',
    icon: Brush,
    highlights: [
      'Cutilagem russa combinada ou tradicional delicada',
      'Alicates e brocas esterilizados em autoclave grau cirúrgico',
      'Lixas, palitos e toalhas 100% descartáveis',
      'Esmaltação uniforme e finalização hidratante'
    ],
    fullDescription: 'O cuidado essencial elevado ao mais alto padrão de higiene e acabamento. Tratamento completo das cutículas sem agressão, desenho harmônico do contorno das unhas e esmaltação impecável com ampla cartela de tonalidades nacionais e importadas.',
    pricingSections: [
      {
        title: 'Menu de Cuidados Mãos & Pés',
        subtitle: 'Atendimento com produtos esterilizados',
        items: [
          { label: 'Pé e Mão completos', price: 'R$ 90,00' },
          { label: 'Pedicure exclusivo', price: 'R$ 60,00' },
          { label: 'Manicure exclusiva', price: 'R$ 40,00' },
          { label: 'Esmaltação em gel (Pé)', price: 'R$ 110,00' },
        ]
      }
    ]
  },
  {
    id: 'spa-pes',
    title: 'Spa dos Pés',
    tagline: 'Ritual terapêutico com escalda-pés, sais, ervas naturais, massagem e bem-estar.',
    description: 'Ritual terapêutico com escalda-pés, sais, ervas naturais, massagem e bem-estar.',
    detail: 'R$ 80 a R$ 160',
    basePrice: 100,
    duration: '1 hora',
    icon: Star,
    highlights: [
      'Escalda-pés aquecido em infusão botânica',
      'Sal grosso e blend de camomila, alecrim e calêndula',
      'Esfoliação suave e renovadora',
      'Massagem relaxante com creme hipernutritivo'
    ],
    fullDescription: 'Uma pausa revigorante criada especialmente para aliviar o cansaço e renovar as energias. O ritual inicia com uma imersão aromática com sais marinhos e flores desidratadas, seguida de esfoliação enzimática para maciez extrema e massagem terapêutica que ativa a circulação.',
    pricingSections: [
      {
        title: 'Menu Spa dos Pés',
        subtitle: 'Infusão botânica de camomila, alecrim e calêndula',
        items: [
          { label: 'Spa dos Pés Completo', price: 'R$ 100,00' },
          { label: 'Spa dos Pés + Pedicure Tradicional', price: 'R$ 160,00' },
          { label: 'Sal Grosso com Ervas (Escalda-pés)', price: 'R$ 80,00' },
          { label: 'Sal Grosso com Ervas + Pedicure', price: 'R$ 140,00' },
        ]
      }
    ]
  },
  {
    id: 'argiloterapia',
    title: 'Argiloterapia & Óleos',
    tagline: 'Argila branca enriquecida com lavanda, melaleuca e copaíba para renovação profunda.',
    description: 'Argila branca enriquecida com lavanda, melaleuca e copaíba para renovação profunda.',
    detail: 'R$ 90 a R$ 180',
    basePrice: 90,
    duration: '1 hora',
    icon: Heart,
    highlights: [
      'Argila branca pura rica em oligoelementos',
      'Blend exclusivo de lavanda, melaleuca e copaíba',
      'Ação desintoxicante, clareadora e cicatrizante',
      'Sensação de leveza e maciez imediata'
    ],
    fullDescription: 'Tratamento natural de alta performance indicado para desintoxicar, nutrir e acalmar a pele dos pés e tornozelos. A sinergia entre a argila micronizada e óleos essenciais terapêuticos regenera rachaduras superficiais, combate inflamações e promove relaxamento sensorial pleno.',
    pricingSections: [
      {
        title: 'Menu Argiloterapia & Sinergias',
        subtitle: 'Lavanda, melaleuca (tea tree) e bálsamo de copaíba',
        items: [
          { label: 'Argiloterapia Pura', price: 'R$ 90,00' },
          { label: 'Argiloterapia + Pedicure Tradicional', price: 'R$ 150,00' },
          { label: 'Completo: Pedicure + Spa dos Pés + Argiloterapia', price: 'R$ 180,00' },
        ]
      }
    ]
  },
];

"""

if services_start != -1 and services_end != -1:
    text = text[:services_start] + new_services_code + text[services_end:]

# 3. Replace Services() component with new version (including modal, saiba mais button, and removal of old static table)
serv_start = text.find('function Services(')
if serv_start == -1:
    serv_start = text.find('function Services()')
serv_end = text.find('{/* Seção Convite para a Página Dedicada de Cursos */}', serv_start)
if serv_end == -1:
    serv_end = text.find('function CoursesTeaser()', serv_start)

new_services_component = """function Services({
  selectedServices = [],
  onToggleService,
  onGoToBooking,
}: {
  selectedServices?: string[];
  onToggleService?: (title: string) => void;
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
              Clique em <strong>Saiba mais</strong> em qualquer serviço para visualizar a tabela detalhada de valores e adicionar ao seu agendamento.
            </p>
          </div>
        </div>

        {/* Cards de serviços em 3D nítido com aura de luz dourada */}
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedServices.includes(service.title);

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
                    border: isSelected ? '2px solid #ab8445' : '1px solid rgba(171, 132, 69, 0.32)',
                    boxShadow: isSelected
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
                      background: isSelected ? '#181513' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#ab8445',
                      border: isSelected ? '1px solid #181513' : '1px solid #d4b27c',
                    }}
                  >
                    {isSelected ? '✓ Selecionado' : 'Saiba mais'} <ChevronRight size={11} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DEDICADO DO SERVIÇO COM TABELA DE VALORES, EXPLICAÇÃO E BOTÕES DE AÇÃO */}
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
                  ✦ Procedimento Exclusivo
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

            {/* Tabela de Preços do Serviço */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
                <h4 className="font-serif text-lg font-semibold text-[#181513]">
                  Tabela Completa de Valores
                </h4>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#ab8445] font-bold">
                  Valores Oficiais
                </span>
              </div>

              {activeModal.pricingSections.map((sec, idx) => (
                <div key={idx} className="rounded-2xl p-4 bg-white border border-[#E8E1D5] shadow-xs">
                  <div className="mb-2.5">
                    <p className="font-serif text-sm font-bold text-[#181513]">{sec.title}</p>
                    {sec.subtitle && (
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#6E665E]">{sec.subtitle}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {sec.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-none text-xs">
                        <span className="text-[#4A433B] font-medium">{item.label}</span>
                        <strong className="font-mono text-[#ab8445] text-sm font-bold">{item.price}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {activeModal.addons && activeModal.addons.length > 0 && (
                <div className="rounded-2xl p-4 bg-white border border-[#E8E1D5]">
                  <p className="font-serif text-xs font-bold text-[#181513] mb-2">Acréscimos & Cuidados Avulsos</p>
                  <div className="space-y-1.5 text-xs">
                    {activeModal.addons.map((addon, aIdx) => (
                      <div key={aIdx} className="flex justify-between py-1 border-b border-gray-100 last:border-none">
                        <span className="text-[#6E665E]">{addon.label}</span>
                        <span className="font-mono text-[#ab8445] font-semibold">{addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ações do Modal: Adicionar, Continuar Selecionando, Ir para Agendamento */}
            <div className="mt-7 pt-5 border-t border-[#E8E1D5] space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Botão de Adicionar / Remover do Agendamento */}
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleService) {
                      onToggleService(activeModal.title);
                    }
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
                    selectedServices.includes(activeModal.title)
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-[#181513] text-white hover:bg-black hover:scale-[1.01]'
                  }`}
                >
                  {selectedServices.includes(activeModal.title) ? (
                    <>
                      <Check size={16} strokeWidth={2.5} /> Procedimento Adicionado! (Clique p/ remover)
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="text-[#c59e5f]" /> ✦ Adicionar ao Agendamento
                    </>
                  )}
                </button>

                {/* Botão Continuar Selecionando */}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full font-mono text-xs uppercase tracking-wider font-semibold bg-white text-[#181513] border-2 border-[#D4C8B5] hover:bg-[#FAF7F2] transition-all"
                >
                  Continuar Selecionando Outros
                </button>
              </div>

              {/* Botão Direto para o Agendamento */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedServices.includes(activeModal.title) && onToggleService) {
                      onToggleService(activeModal.title);
                    }
                    setActiveModal(null);
                    if (onGoToBooking) {
                      onGoToBooking();
                    } else {
                      scrollToSection('#agendamento');
                    }
                  }}
                  className="font-mono text-xs uppercase tracking-wider text-[#ab8445] hover:text-[#7d5e2e] font-bold underline underline-offset-4 cursor-pointer"
                >
                  Ir direto para Agendamento e Pagamento →
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

if serv_start != -1 and serv_end != -1:
    text = text[:serv_start] + new_services_component + text[serv_end:]

# 4. Insert CustomGoldTimeSelect component before Booking()
time_select_component = """function CustomGoldTimeSelect({
  value,
  onChange,
  timeSlots,
  existingBookings,
  date,
}: {
  value: string;
  onChange: (val: string) => void;
  timeSlots: string[];
  existingBookings: BookingType[];
  date: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedIsTaken = isSlotTaken(existingBookings, date, value);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Botão de Disparo do Select */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#181513] bg-white border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-between focus:outline-none focus:border-[#ab8445] transition-all text-left cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 truncate">
          <Clock3 size={16} className="text-[#ab8445] shrink-0" />
          <span>{value} {selectedIsTaken ? '(Já reservado)' : '(Disponível)'}</span>
        </span>
        <ChevronDown size={18} className={`text-[#ab8445] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu com visual Dourado Luxuoso (SEM AZUL!) */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-2xl bg-white border-2 border-[#ab8445] shadow-[0_16px_36px_rgba(0,0,0,0.22)] py-1.5 animate-in fade-in zoom-in-95 duration-150"
          role="listbox"
        >
          {timeSlots.map((t) => {
            const isTaken = isSlotTaken(existingBookings, date, t);
            const isSelected = t === value;

            return (
              <button
                key={t}
                type="button"
                disabled={isTaken}
                onClick={() => {
                  if (!isTaken) {
                    onChange(t);
                    setIsOpen(false);
                  }
                }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#ab8445] text-white font-bold'
                    : isTaken
                    ? 'opacity-35 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'text-[#181513] font-medium hover:bg-[#FAF5EC] hover:text-[#8d6728] cursor-pointer'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono">{t}</span>
                  <span className={`text-[11px] font-mono uppercase tracking-wider ${isSelected ? 'text-white/90' : isTaken ? 'text-gray-400' : 'text-[#ab8445]'}`}>
                    {isTaken ? '· Já reservado' : '· Disponível'}
                  </span>
                </div>
                {isSelected && (
                  <Check size={16} className="text-white shrink-0" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

"""

booking_def = text.find('function Booking({')
if booking_def != -1 and 'function CustomGoldTimeSelect' not in text:
    text = text[:booking_def] + time_select_component + text[booking_def:]

# 5. Fix Booking text colors, button colors, and time dropdown
# 5a. Title highlight: "um tempo para você?" -> white
old_title_snippet = """<h2 className="gb-display text-4xl leading-tight md:text-5xl font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  Vamos reservar<br />
                  <em className="text-[#181513] not-italic font-bold tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                    um tempo para você?
                  </em>
                </h2>"""

new_title_snippet = """<h2 className="gb-display text-4xl leading-tight md:text-5xl font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                  Vamos reservar<br />
                  <span className="text-white font-serif italic font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    um tempo para você?
                  </span>
                </h2>"""

text = text.replace(old_title_snippet, new_title_snippet)

# 5b. Description paragraph -> white text
old_desc_snippet = """<p className="mt-5 text-sm md:text-[15px] leading-relaxed text-[#181513] font-semibold drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                  Selecione os procedimentos desejados e seu horário de preferência. Em seguida, você terá acesso à <strong className="text-white underline decoration-white/70">área de pagamento</strong> para confirmar seu pedido sem conflito de horários.
                </p>"""

new_desc_snippet = """<p className="mt-5 text-sm md:text-[15px] leading-relaxed text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
                  Selecione os procedimentos desejados e seu horário de preferência. Em seguida, você terá acesso à <strong className="text-white underline decoration-white font-bold underline-offset-2">área de pagamento</strong> para confirmar seu pedido sem conflito de horários.
                </p>"""

text = text.replace(old_desc_snippet, new_desc_snippet)

# 5c. Time dropdown in Booking -> CustomGoldTimeSelect
old_select_snippet = """<select
                      value={form.time}
                      onChange={(e) => updateField('time', e.target.value)}
                      className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-[#181513] bg-white border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#181513] focus:ring-2 focus:ring-[#181513] transition-all"
                    >
                      {timeSlots.map((t) => {
                        const isTaken = isSlotTaken(existingBookings, form.date, t);
                        return (
                          <option key={t} value={t} disabled={isTaken}>
                            {t} {isTaken ? '(Já reservado)' : '(Disponível)'}
                          </option>
                        );
                      })}
                    </select>"""

new_select_snippet = """<CustomGoldTimeSelect
                      value={form.time}
                      onChange={(val) => updateField('time', val)}
                      timeSlots={timeSlots}
                      existingBookings={existingBookings}
                      date={form.date}
                    />"""

text = text.replace(old_select_snippet, new_select_snippet)

# 5d. Button "Avançar para Pagamento & Resumo" -> Bege com letras mais escuras
old_btn1 = """<button
                    type="submit"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 min-h-[52px] px-10 rounded-full font-mono text-xs uppercase tracking-[.16em] font-bold text-white bg-[#181513] border-2 border-[#f0d5a3] shadow-[0_12px_28px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:bg-black hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(0,0,0,0.55)] transition-all cursor-pointer"
                  >
                    Avançar para Pagamento & Resumo <ChevronRight size={16} strokeWidth={2.5} />
                  </button>"""

new_btn1 = """<button
                    type="submit"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 min-h-[52px] px-10 rounded-full font-mono text-xs uppercase tracking-[.16em] font-bold text-[#181513] bg-[#FAF7F2] border-2 border-white shadow-[0_12px_28px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:bg-white hover:text-black hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] transition-all cursor-pointer"
                  >
                    Avançar para Pagamento & Resumo <ChevronRight size={16} strokeWidth={2.5} />
                  </button>"""

text = text.replace(old_btn1, new_btn1)

# 5e. Step 2 Button "Confirmar e Enviar ao WhatsApp" -> Bege com letras escuras
old_btn2 = """<button
                      type="button"
                      onClick={handleFinalizeBooking}
                      className="w-full inline-flex items-center justify-center gap-2.5 min-h-[52px] rounded-full font-mono text-xs uppercase tracking-[.16em] font-bold text-white bg-[#181513] border-2 border-[#c59e5f] shadow-[0_12px_28px_rgba(0,0,0,0.35)] hover:bg-black hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      Confirmar e Enviar ao WhatsApp <ArrowUpRight size={16} />
                    </button>"""

new_btn2 = """<button
                      type="button"
                      onClick={handleFinalizeBooking}
                      className="w-full inline-flex items-center justify-center gap-2.5 min-h-[52px] rounded-full font-mono text-xs uppercase tracking-[.16em] font-bold text-[#181513] bg-[#FAF7F2] border-2 border-[#c59e5f] shadow-[0_12px_28px_rgba(0,0,0,0.25)] hover:bg-white hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      Confirmar e Enviar ao WhatsApp <ArrowUpRight size={16} />
                    </button>"""

text = text.replace(old_btn2, new_btn2)

# 6. Update Home() to manage selectedServices, pass to Services, and show Floating Cart Bar
home_start = text.find('function Home() {')
home_end = text.find('function Router() {', home_start)

new_home = """function Home() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  function toggleService(title: string) {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  }

  function handleGoToBooking() {
    document.getElementById('agendamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', '#agendamento');
  }

  const estimatedTotal = selectedServices.reduce((acc, title) => {
    const s = SERVICES.find((item) => item.title === title);
    return acc + (s ? s.basePrice : 100);
  }, 0);

  return (
    <div className="min-h-[100dvh] overflow-x-hidden relative" style={{ background: C.bg }}>
      <Header />
      <main>
        <Hero />
        <Services
          selectedServices={selectedServices}
          onToggleService={toggleService}
          onGoToBooking={handleGoToBooking}
        />
        <About />
        <Booking
          key={selectedServices.join('|')}
          selectedServices={selectedServices}
          onClearSelection={() => setSelectedServices([])}
        />
        <CoursesTeaser />
        <InstagramCta />
      </main>
      <Footer />

      {/* CARRINHO FLUTUANTE DE PROCEDIMENTOS SELECIONADOS */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl animate-in slide-in-from-bottom-5 duration-300">
          <div
            className="rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md"
            style={{
              background: '#181513',
              border: '2px solid #ab8445',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(171, 132, 69, 0.35)',
            }}
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ab8445] text-white shrink-0 shadow-md">
                <ShoppingBag size={20} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#c59e5f]">
                    ✦ {selectedServices.length} {selectedServices.length === 1 ? 'Procedimento' : 'Procedimentos'} no Carrinho
                  </span>
                </div>
                <p className="text-xs text-white/90 truncate max-w-[260px] md:max-w-xs font-serif">
                  {selectedServices.join(', ')}
                </p>
                <p className="font-mono text-[11px] font-bold text-white mt-0.5">
                  Total Estimado: <span className="text-[#c59e5f]">R$ {estimatedTotal},00</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedServices([])}
                className="px-3 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Limpar seleção"
              >
                Limpar
              </button>

              <button
                type="button"
                onClick={handleGoToBooking}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #d4b27c 0%, #ab8445 100%)',
                  color: '#FFFFFF',
                }}
              >
                Finalizar Agendamento <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"""

if home_start != -1 and home_end != -1:
    text = text[:home_start] + new_home + text[home_end:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('App.tsx updated successfully!')
