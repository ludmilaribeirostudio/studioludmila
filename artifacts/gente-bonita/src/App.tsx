import { useState, useEffect, useRef, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDown, ArrowLeft, ArrowUpRight, Check, ChevronRight, ChevronDown, Clock3, Plus,
  GraduationCap, Instagram, Menu, Shield, ShoppingBag, Trash2,
  Sparkles, Star, X, Gem, Scissors, Brush, Heart, MapPin, Phone,
  Lock, Copy, CheckCircle2, Calendar, CreditCard, QrCode, AlertCircle
} from 'lucide-react';
import NotFound from '@/pages/not-found';
import CursosPage from '@/pages/CursosPage';
import AdminPage from '@/pages/AdminPage';
import {
  getBookings,
  saveBooking,
  isSlotTaken,
  AVAILABLE_TIME_SLOTS,
  type Booking as BookingType,
} from '@/lib/bookingService';
import { useSiteImage, useAboutGallery } from '@/lib/imageService';
import { useSiteContent } from '@/lib/contentService';
import { Route, Switch, useLocation, Link, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const CONTACTS = {
  whatsappNumber: '5566992008906',
  whatsappLabel: '(66) 99200-8906',
  coursesWhatsapp: '5527998661708',
  coursesWhatsappLabel: '(27) 99866-1708',
  address: 'Av. Brasil, nº 484, Bom Jesus, Sorriso - MT (Interfone 01 · acima da Brasil Dourado)',
  mapsUrl: 'https://maps.google.com/?q=Av.+Brasil,+484,+Bom+Jesus,+Sorriso+MT',
  hours: 'Seg–Sex: 08h–17h · Sábado: 08h–15h',
  instagramHandle: '@studio.ludmilaribeiro',
  instagramUrl: 'https://instagram.com/studio.ludmilaribeiro',
  instagramNails: '@ludmilaribeiro.naildesigner',
  instagramNailsUrl: 'https://instagram.com/ludmilaribeiro.naildesigner',
  pixKey: '51660723000158',
};

const NAV_ITEMS = [
  { label: 'Início', href: '#inicio', isPage: false },
  { label: 'Serviços', href: '#servicos', isPage: false },
  { label: 'Cursos', href: '/cursos', isPage: true },
  { label: 'Sobre', href: '#sobre', isPage: false },
];

export interface ServicePriceOption {
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

export interface CartItem {
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
  const match = clean.match(/(\d+(?:\.\d+)?(?:,\d+)?)/);
  if (!match) return 0;
  const numStr = match[1].replace('.', '').replace(',', '.');
  const val = parseFloat(numStr);
  return isNaN(val) ? 0 : val;
}

export function makeCartItemId(serviceId: string, category: string, label: string): string {
  return `${serviceId}_${category}_${label}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
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

function scrollToSection(href: string) {
  const id = href.replace('#', '');
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', href);
}

// ─── Identidade Visual Off-White & Dourado (#ab8445) ───
const C = {
  bg: '#FAF8F5',         // Off-white suave e acolhedor
  bgAlt: '#F4EFE7',      // Off-white aquecido para seções alternadas
  card: '#FFFFFF',       // Branco puro para os cartões
  gold: '#ab8445',       // Cor exata da logo do Studio
  goldLight: '#c59e5f',  // Dourado iluminado
  goldSoft: '#EFE6D6',   // Tom dourado translúcido para fundos e bordas delicadas
  text: '#221D19',       // Carvão quente/expresso para texto com leitura cristalina
  textMuted: '#6E665E',  // Taupe neutro para parágrafos
  textDim: '#9E958A',    // Cinza quente claro para legendas e detalhes
  border: '#E8E1D5',     // Linha delicada e sutil
  borderGold: 'rgba(171, 132, 69, 0.32)',
};

function BrandMark() {
  const logoSrc = useSiteImage('logo_gold', '/images/logo-gold-cropped.png');
  return (
    <a
      href="#inicio"
      onClick={(e) => { e.preventDefault(); scrollToSection('#inicio'); }}
      data-testid="link-brand"
      className="inline-flex items-center group transition-transform duration-300 hover:scale-[1.02]"
    >
      <img
        src={logoSrc}
        alt="Studio Ludmila Ribeiro - Nail Spa & Beauty"
        className="h-14 md:h-16 w-auto object-contain py-1"
      />
    </a>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <p className="font-mono text-[10px] uppercase tracking-[.25em] font-semibold" style={{ color: C.gold }}>
        {children}
      </p>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md transition-all shadow-[0_2px_12px_rgba(171,132,69,0.06)]"
      style={{ background: 'rgba(250, 248, 245, 0.95)', borderBottom: `1px solid ${C.border}` }}
    >
      <div className="gb-shell flex h-[88px] items-center justify-between">
        <BrandMark />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => {
            if (item.isPage) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[11px] uppercase tracking-[.15em] font-medium transition-colors duration-200"
                  style={{ color: C.textMuted }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className="text-[11px] uppercase tracking-[.15em] font-medium transition-colors duration-200"
                style={{ color: C.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <a
          href="#agendamento"
          onClick={(e) => { e.preventDefault(); scrollToSection('#agendamento'); }}
          className="hidden min-h-[44px] px-7 md:inline-flex items-center gap-2 rounded-full text-[10px] uppercase tracking-[.15em] font-mono transition-all duration-200 shadow-sm"
          style={{ border: `1px solid ${C.gold}`, color: C.gold, background: C.card }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = C.gold;
            (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(171, 132, 69, 0.25)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = C.card;
            (e.currentTarget as HTMLElement).style.color = C.gold;
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
          data-testid="link-header-booking"
        >
          Agendar Horário
        </a>
        <button
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="rounded-full p-2.5 md:hidden transition-colors"
          style={{ border: `1px solid ${C.border}`, color: C.text }}
          onClick={() => setOpen((v) => !v)}
          data-testid="button-mobile-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="px-6 py-6 md:hidden shadow-lg" style={{ background: C.card, borderBottom: `1px solid ${C.border}` }}>
          <nav className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => {
              if (item.isPage) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-[.14em] font-medium"
                    style={{ color: C.gold }}
                  >
                    {item.label} ✦
                  </Link>
                );
              }
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); setOpen(false); scrollToSection(item.href); }}
                  className="text-sm uppercase tracking-[.14em] font-medium"
                  style={{ color: C.text }}
                  data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <button
            type="button"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 min-h-[46px] rounded-full text-[10px] uppercase tracking-[.16em] font-mono shadow-sm"
            style={{ background: C.gold, color: '#FFFFFF' }}
            onClick={() => { setOpen(false); scrollToSection('#agendamento'); }}
            data-testid="button-mobile-booking"
          >
            Agendar Horário <ArrowUpRight size={14} />
          </button>
        </div>
      )}
    </header>
  );
}

function Hero() {
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
        return 'M 840,0 C 780,250 870,500 810,700 C 770,820 830,880 790,900 L 1440,900 L 1440,0 Z';
      case 'diagonal-moderna':
        return 'M 880,0 L 760,900 L 1440,900 L 1440,0 Z';
      case 'curva-organica':
      default:
        // Curva orgânica posicionada mais no rumo da foto para não cobrir nenhum texto
        return 'M 830,0 C 790,180 760,360 800,540 C 830,700 780,820 750,900 L 1440,900 L 1440,0 Z';
    }
  };

  return (
    <section id="inicio" className="relative flex min-h-[680px] lg:min-h-[730px] items-center overflow-visible py-16 md:py-24" style={{ background: C.bg }}>
      {/* DIVISÃO CURVADA DOURADA UNIFICADA (Hero até o topo de Serviços) */}
      {isShapeActive && (
        <svg
          className="pointer-events-none absolute top-0 left-0 w-full h-[calc(100%+240px)] z-0 transition-all duration-700 hidden sm:block"
          viewBox="0 0 1440 1140"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hero-curved-gold-unified" x1="40%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1} stopOpacity={opacityVal} />
              <stop offset="100%" stopColor={color2} stopOpacity={opacityVal} />
            </linearGradient>
            <filter id="gold-wave-shadow-unified" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="-8" dy="6" stdDeviation="18" floodColor="#ab8445" floodOpacity="0.22" />
            </filter>
          </defs>

          {/* Curva contínua perfeita, sem corte nem emenda: inicia no topo (830,0), desce pela Hero contornando a foto, entra na seção de Serviços e retorna para a borda direita (1440, 970) */}
          <path
            d="M 830,0 C 790,180 760,360 800,540 C 830,700 780,820 750,900 C 720,970 780,1040 890,1065 C 1020,1095 1250,1070 1440,965 L 1440,0 Z"
            fill="url(#hero-curved-gold-unified)"
            filter="url(#gold-wave-shadow-unified)"
          />

          {/* Linha de brilho reflexivo na borda contínua */}
          <path
            d="M 830,0 C 790,180 760,360 800,540 C 830,700 780,820 750,900 C 720,970 780,1040 890,1065 C 1020,1095 1250,1070 1440,965"
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

function Services({
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
    <section id="servicos" className="scroll-mt-8 py-20 md:py-24 relative overflow-hidden" style={{ background: 'transparent' }}>
      <div className="gb-shell relative z-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-xl">
            <SectionEyebrow>Serviços & Cuidados</SectionEyebrow>
            <h2 className="gb-display text-4xl leading-tight md:text-5xl" style={{ color: C.text }}>
              Experiências exclusivas<br /><em style={{ color: C.gold }}>para o seu momento.</em>
            </h2>
            <p className="mt-3 text-sm text-[#6E665E]">
              Clique em <strong>Saiba mais</strong> para ver todos os procedimentos e acréscimos com valores individuais. Você pode clicar e somar cada procedimento separadamente no carrinho.
            </p>
          </div>
        </div>

        {/* Cards de serviços: 2 em 2 no celular, 3 em 3 no desktop, em degradê DOURADO com letras BRANCAS e botão SAIBA MAIS ESCURO */}
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

{/* Seção Convite para a Página Dedicada de Cursos */}
function CoursesTeaser() {
  const teaserImg = useSiteImage('hero_ludmila', '/images/ludmila-hero.jpg');
  return (
    <section id="cursos" className="scroll-mt-8 py-20 md:py-24" style={{ background: C.bgAlt }}>
      <div className="gb-shell">
        <div className="rounded-3xl p-8 md:p-14 shadow-sm" style={{ background: C.card, border: `1px solid ${C.borderGold}` }}>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <SectionEyebrow>Educação & Mentoria Profissional</SectionEyebrow>
              <h2 className="gb-display text-3xl md:text-5xl font-medium leading-tight" style={{ color: C.text }}>
                Aprenda a arte do alongamento<br />
                <em style={{ color: C.gold }}>com quem vive a prática do salão.</em>
              </h2>
              <p className="mt-5 text-sm md:text-base leading-relaxed" style={{ color: C.textMuted }}>
                Cursos completos e individualizados criados por Ludmila Ribeiro. Da formação inicial do zero ao aperfeiçoamento avançado de curvatura e decorações de alto padrão.
              </p>

              {/* 4 Cursos em Destaque Rápido */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  'Alongamento de Fibra (Iniciante)',
                  'Fibra de Vidro (Avançado Slim)',
                  'Banho de Gel & Esmaltação',
                  'Aquarelart Nail Art',
                ].map((courseName) => (
                  <div key={courseName} className="flex items-center gap-2 rounded-xl p-3" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                    <Check size={14} style={{ color: C.gold }} className="shrink-0" />
                    <span className="text-xs font-medium" style={{ color: C.text }}>{courseName}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/cursos"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-mono text-[10px] uppercase tracking-[.16em] font-semibold transition-all shadow-md"
                  style={{ background: C.gold, color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = C.goldLight;
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(171, 132, 69, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = C.gold;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  Acessar Página Completa dos Cursos <ArrowUpRight size={14} />
                </Link>

                <a
                  href={`https://wa.me/${CONTACTS.coursesWhatsapp}?text=${encodeURIComponent(
                    'Olá! Gostaria de consultar datas e valores para os cursos no Studio Ludmila Ribeiro.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-[10px] uppercase tracking-[.16em] font-medium transition-all"
                  style={{ border: `1px solid ${C.borderGold}`, background: C.bg, color: C.text }}
                >
                  WhatsApp Cursos <Phone size={13} style={{ color: C.gold }} />
                </a>
              </div>
            </div>

            {/* Ilustração / Foto em Destaque */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] overflow-hidden rounded-2xl shadow-xl" style={{ border: `1px solid ${C.borderGold}` }}>
                <img
                  src={teaserImg}
                  alt="Ludmila Ribeiro Cursos"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#EFE6D6]">Mentoria VIP</p>
                  <p className="font-serif text-lg font-medium">Turmas Reduzidas & Prática Real</p>
                  <p className="text-xs text-white/80 mt-1">Certificado oficial chancelado por Ludmila Ribeiro.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const content = useSiteContent();
  const gallery = useAboutGallery();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Troca automática de fotos a cada 3 segundos em looping infinito
  useEffect(() => {
    if (gallery.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gallery.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [gallery.length]);

  // Exibe par de fotos consecutivas para preencher a moldura dupla clássica do salão
  const img1 = gallery[currentIndex] || gallery[0];
  const nextIdx = gallery.length > 1 ? (currentIndex + 1) % gallery.length : 0;
  const img2 = gallery[nextIdx] || gallery[0];

  return (
    <section id="sobre" className="scroll-mt-8 py-20 md:py-24" style={{ background: C.card }}>
      <div className="gb-shell">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Texto e Fotos de Atendimento */}
          <div>
            <SectionEyebrow>O Espaço & Excelência</SectionEyebrow>
            <h2 className="gb-display text-4xl leading-tight md:text-5xl" style={{ color: C.text }}>
              {content.aboutTitle}<br />
              <em style={{ color: C.gold }}>{content.aboutTitleHighlight}</em>
            </h2>

            <div className="mt-7 space-y-4 text-[15px] leading-relaxed" style={{ color: C.textMuted }}>
              <p>{content.aboutParagraph1}</p>
              <p>{content.aboutParagraph2}</p>
            </div>

            {/* Carrossel Dinâmico que passa automaticamente a cada 3 segundos em looping contínuo */}
            <div className="mt-8 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="overflow-hidden rounded-2xl shadow-sm transition-all duration-700 relative group"
                  style={{ border: `1px solid ${C.borderGold}`, background: C.bg }}
                >
                  <img
                    key={`about-carousel-1-${img1?.id || currentIndex}`}
                    src={img1?.url}
                    alt={img1?.caption || 'Atendimento no Studio Ludmila Ribeiro'}
                    className="h-44 w-full object-cover object-top transition-transform duration-700 hover:scale-105 animate-in fade-in"
                  />
                  {img1?.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-[11px] text-white line-clamp-1 font-sans">{img1.caption}</p>
                    </div>
                  )}
                </div>

                <div
                  className="overflow-hidden rounded-2xl shadow-sm transition-all duration-700 relative group"
                  style={{ border: `1px solid ${C.borderGold}`, background: C.bg }}
                >
                  <img
                    key={`about-carousel-2-${img2?.id || nextIdx}`}
                    src={img2?.url}
                    alt={img2?.caption || 'Studio Ludmila Ribeiro'}
                    className="h-44 w-full object-cover object-center transition-transform duration-700 hover:scale-105 animate-in fade-in"
                  />
                  {img2?.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-[11px] text-white line-clamp-1 font-sans">{img2.caption}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Indicadores delicados do carrossel em looping */}
              <div className="flex items-center justify-center pt-2">
                <div className="flex items-center gap-2">
                  {gallery.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-7 bg-[#ab8445] shadow-sm'
                          : 'w-2 bg-[#ab8445]/30 hover:bg-[#ab8445]/60'
                      }`}
                      aria-label={`Ir para foto ${idx + 1}`}
                      title={`Foto ${idx + 1}: ${item.caption}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs" style={{ color: C.textDim }}>
              {content.aboutFooterNote}
            </p>
          </div>

          {/* Guia de Atendimento — Dourado Translúcido Rico de Luxo */}
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
          </div>
        </div>
      </div>
    </section>
  );
}

type BookingFormData = {
  name: string;
  whatsapp: string;
  services: string[];
  date: string;
  time: string;
  observations: string;
  paymentMethod: 'pix' | 'cartao' | 'presencial';
};

function CustomGoldTimeSelect({
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

function Booking({
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
    const itemsFormatted = cartItems.map((c) => `  • ${c.label} (${c.category}): ${c.priceLabel}`).join('\n');

    const msg =
      `Olá Studio Ludmila Ribeiro! Acabei de fazer um pedido de agendamento pelo site:\n\n` +
      `👤 *Nome:* ${form.name}\n` +
      `📱 *WhatsApp:* ${form.whatsapp}\n` +
      `📅 *Data desejada:* ${dataFmt} às ${form.time}\n\n` +
      `💅 *Procedimentos Selecionados:*\n${itemsFormatted}\n\n` +
      `💰 *Total Estimado:* R$ ${calculatedTotal},00\n` +
      `💳 *Forma de Pagamento:* ${form.paymentMethod.toUpperCase()}\n` +
      (form.observations ? `📝 *Obs:* ${form.observations}\n\n` : `\n`) +
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

function InstagramCta() {
  return (
    <section id="instagram" className="py-20 md:py-24" style={{ background: C.bg }}>
      <div className="gb-shell relative overflow-hidden rounded-3xl p-8 md:p-16 text-center shadow-sm" style={{ border: `1px solid ${C.border}`, background: C.card }}>
        <div className="mx-auto max-w-xl">
          <SectionEyebrow>Redes Sociais</SectionEyebrow>
          <h2 className="gb-display text-4xl leading-tight md:text-5xl font-medium" style={{ color: C.text }}>
            Mais beleza & inspiração<br /><em style={{ color: C.gold }}>no seu dia a dia.</em>
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: C.textMuted }}>
            Acompanhe o dia a dia do estúdio, transformações de clientes e bastidores dos cursos.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={CONTACTS.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 min-h-[46px] px-7 rounded-full font-mono text-[10px] uppercase tracking-[.14em] transition-all shadow-sm"
              style={{ border: `1px solid ${C.gold}`, color: C.gold, background: '#FFFFFF' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = C.gold;
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.color = C.gold;
              }}
              data-testid="link-instagram-studio"
            >
              <Instagram size={15} /> Studio: {CONTACTS.instagramHandle}
            </a>
            <a
              href={CONTACTS.instagramNailsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 min-h-[46px] px-7 rounded-full font-mono text-[10px] uppercase tracking-[.14em] transition-all shadow-sm"
              style={{ border: `1px solid ${C.border}`, color: C.textMuted, background: C.bg }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                (e.currentTarget as HTMLElement).style.color = C.gold;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = C.border;
                (e.currentTarget as HTMLElement).style.color = C.textMuted;
              }}
              data-testid="link-instagram-nails"
            >
              <Instagram size={15} /> Cursos: {CONTACTS.instagramNails}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* Rodapé na Cor Personalizada com Logo Branca e Detalhes Sofisticados */}
function Footer() {
  const logoWhite = useSiteImage('logo_white', '/images/logo-white-cropped.png');
  const content = useSiteContent();

  return (
    <footer
      className="pb-10 pt-20 transition-colors duration-300"
      style={{
        background: content.footerBg,
        color: content.footerTextColor,
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25)',
      }}
    >
      <div className="gb-shell">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.3fr_1fr_1fr]" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
          {/* Logo branca em destaque */}
          <div>
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); scrollToSection('#inicio'); }}
              className="inline-block transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src={logoWhite}
                alt="Studio Ludmila Ribeiro"
                className="h-24 w-auto object-contain filter drop-shadow-sm"
              />
            </a>
            <p className="mt-5 max-w-sm text-xs leading-relaxed opacity-90">
              {content.footerDescription}
            </p>
          </div>

          {/* Localização */}
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[.25em] font-semibold">
              Localização
            </p>
            <a
              href={content.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2.5 text-xs leading-relaxed transition-opacity hover:opacity-100 opacity-90"
              data-testid="link-footer-address"
            >
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <span>{content.address}</span>
            </a>
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[.22em] opacity-75">
                Atendimento
              </p>
              <p className="text-xs">{content.hours}</p>
            </div>
          </div>

          {/* Contato */}
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[.25em] font-semibold">
              Contato & Agendamento
            </p>
            <a
              href={`https://wa.me/${content.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-xs transition-opacity hover:opacity-100 mb-2.5 opacity-90"
              data-testid="link-footer-whatsapp"
            >
              <Phone size={14} />
              <span>Studio: {content.whatsappLabel}</span>
            </a>
            <a
              href={`https://wa.me/${content.coursesWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-xs transition-opacity hover:opacity-100 mb-2.5 opacity-90"
              data-testid="link-footer-courses-whatsapp"
            >
              <GraduationCap size={14} />
              <span>Cursos: {content.coursesWhatsappLabel}</span>
            </a>
          </div>
        </div>

        {/* Rodapé inferior com Acesso Administrativo Discreto */}
        <div className="flex flex-col justify-between items-center gap-4 pt-7 font-mono text-[10px] uppercase tracking-[.14em] md:flex-row opacity-80">
          <span>© {new Date().getFullYear()} Studio Ludmila Ribeiro · Todos os direitos reservados</span>

          <div className="flex items-center gap-4">
            <span>{content.footerCopyrightTagline}</span>
            <span className="opacity-40">|</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity underline underline-offset-4"
              title="Acesso Administrativo do Salão"
            >
              <Lock size={11} /> <span>Acesso Salão</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Home() {
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

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/cursos" component={CursosPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
