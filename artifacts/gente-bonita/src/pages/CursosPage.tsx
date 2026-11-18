import { useState } from 'react';
import {
  ArrowLeft, ArrowUpRight, Check, ChevronDown, ChevronRight, Clock3,
  GraduationCap, Instagram, Shield, Sparkles, Star, Award, Users, BookOpen,
  Gem, Heart, MapPin, Phone, MessageCircle
} from 'lucide-react';
import { Link } from 'wouter';
import { useSiteImage } from '@/lib/imageService';

const C = {
  bg: '#FAF8F5',
  bgAlt: '#F4EFE7',
  card: '#FFFFFF',
  gold: '#ab8445',
  goldLight: '#c59e5f',
  goldSoft: '#EFE6D6',
  text: '#221D19',
  textMuted: '#6E665E',
  textDim: '#9E958A',
  border: '#E8E1D5',
  borderGold: 'rgba(171, 132, 69, 0.32)',
};

const CONTACTS = {
  whatsappNumber: '5566992008906',
  whatsappLabel: '(66) 99200-8906',
  coursesWhatsapp: '5527998661708',
  coursesWhatsappLabel: '(27) 99866-1708',
  address: 'Av. Brasil, nº 484, Bom Jesus, Sorriso - MT (Interfone 01)',
  instagramNails: '@ludmilaribeiro.naildesigner',
  instagramNailsUrl: 'https://instagram.com/ludmilaribeiro.naildesigner',
};

const ALL_COURSES = [
  {
    id: 'fibra-iniciante',
    badge: 'Mais Procurado · Iniciante',
    title: 'Alongamento de Fibra de Vidro',
    subtitle: 'Formação Inicial do Zero ao Avançado',
    description:
      'Uma formação intensiva e prática, criada para quem deseja ingressar no mercado de nail design com segurança absoluta, técnica refinada e acabamento natural e resistente.',
    investment: 'R$ 1.600,00',
    duration: '10 horas (com 1h de intervalo)',
    payment: 'Pix ou Cartão de Crédito',
    includes: [
      'Certificado Oficial de Formação Profissional',
      'Apostila técnica ilustrada e encadernada',
      'Brinde exclusivo do Studio Ludmila Ribeiro',
      'Materiais inclusos para uso durante toda a aula',
      'Suporte direto pós-curso no WhatsApp',
    ],
    modules: [
      {
        title: 'Módulo 1: Fundamentos & Anatomia da Unha',
        items: [
          'Biossegurança rigorosa e desinfecção de instrumentais',
          'Anatomia, estrutura e fisiologia da lâmina ungueal',
          'Contraindicações, patologias comuns e cuidados essenciais',
          'Química básica dos produtos e compatibilidade',
        ],
      },
      {
        title: 'Módulo 2: Preparação & Aderência',
        items: [
          'Higienização e assepsia profunda',
          'Cutilagem de precisão para alongamento',
          'Abertura de porosidade correta sem danificar a lâmina',
          'Aplicação e dosagem precisa de primers e desidratadores',
        ],
      },
      {
        title: 'Módulo 3: Aplicação da Fibra & Estrutura',
        items: [
          'Abertura uniforme da fibra de vidro',
          'Camuflagem perfeita da fibra na lâmina natural',
          'Curvatura C simétrica e elegante com pinça e presilhas',
          'Ponto de tensão arquitetado para máxima resistência sem excessos',
        ],
      },
      {
        title: 'Módulo 4: Lixamento Técnico & Finalização',
        items: [
          'Lixamento mecânico e manual de alta precisão',
          'Curvatura simétrica e espessura slim (efeito unhas naturais)',
          'Selagem de alto brilho e polimento sem descolamento',
          'Manutenção periódica e técnica de remoção segura',
        ],
      },
      {
        title: 'Módulo 5: Negócio & Atendimento',
        items: [
          'Precificação estratégica para lucro real',
          'Fotografia das unhas e iluminação para o Instagram',
          'Como atrair e fidelizar clientes de alto padrão',
        ],
      },
    ],
  },
  {
    id: 'fibra-avancado',
    badge: 'Aperfeiçoamento Profissional',
    title: 'Alongamento de Fibra de Vidro · Avançado',
    subtitle: 'Acabamento Slim, Formatos Europeus & Decorações',
    description:
      'Destinado a nail designers que já atuam e desejam diminuir o tempo em mesa, alcançar curvaturas perfeitas, dominar formatos modernos e decorações nobres que valorizam o ticket.',
    investment: 'R$ 1.800,00',
    duration: '10 horas (com 1h de intervalo)',
    payment: 'Pix ou Cartão de Crédito',
    includes: [
      'Certificado de Especialização Avançada',
      'Apostila técnica avançada',
      'Brinde premium do Studio',
      'Suporte vitalício pós-curso com a instrutora',
      'Gabarito de medidas e alinhamento',
    ],
    modules: [
      {
        title: 'Módulo 1: Otimização de Tempo & Mesa',
        items: [
          'Diagnóstico de vícios de atendimento e postura',
          'Redução drástica do tempo de lixamento com controle de produto',
          'Uso inteligente de brocas diamantadas e de tungstênio',
        ],
      },
      {
        title: 'Módulo 2: Curvatura C & Estrutura Slim',
        items: [
          'Estrutura ultra slim com espessura de cartão de visita',
          'Alinhamento perfeito de bordas laterais e ponto zero',
          'Correção de leitos difíceis, unhas roídas e bico de papagaio',
        ],
      },
      {
        title: 'Módulo 3: Formatos Modernos & Europeus',
        items: [
          'Quadrada perfeita (Square) com cantos alinhados',
          'Almond clássica e russa',
          'Bailarina e Stiletto com ponto de tensão ajustado',
        ],
      },
      {
        title: 'Módulo 4: Decorações Sofisticadas em Gel',
        items: [
          'Francesa reversa impecável com leito esculpido',
          'Babyboomer e Babycolor translúcidas',
          'Encapsuladas de luxo com glitter fino e madrepérola',
        ],
      },
    ],
  },
  {
    id: 'banho-esmaltacao',
    badge: 'Alta Demanda no Salão',
    title: 'Banho de Gel & Esmaltação em Gel',
    subtitle: 'Durabilidade, Brilho Extremo & Saúde Natural',
    description:
      'O serviço mais procurado por clientes que buscam unhas naturais fortes e esmalte que dura semanas sem descascar. O curso ideal para rápida rentabilidade e alta frequência.',
    investment: 'R$ 900,00',
    duration: '8 horas (com 1h de almoço)',
    payment: 'Pix ou Cartão de Crédito',
    includes: [
      'Certificado Oficial de Especialista em Gel',
      'Apostila de procedimentos passo a passo',
      'Brinde especial de finalização',
      'Materiais para prática em aula',
    ],
    modules: [
      {
        title: 'Módulo 1: Preparação & Saúde da Unha',
        items: [
          'Nivelamento biológico da placa ungueal',
          'Controle de oleosidade e prevenção de infiltrações',
          'Aplicação da base estruturada com gel autonivelante',
        ],
      },
      {
        title: 'Módulo 2: Esmaltação em Gel de Precisão',
        items: [
          'Técnica de aproximação máxima da cutícula sem escorrer',
          'Uniformização de camadas sem manchar',
          'Cat eye, efeitos magnéticos e brilhos finos',
          'Top coat de selagem com brilho espelhado por até 30 dias',
        ],
      },
      {
        title: 'Módulo 3: Manutenção & Remoção Segura',
        items: [
          'Retirada sem danificar ou desgastar a queratina natural',
          'Protocolo de reposição periódica a cada 20 dias',
        ],
      },
    ],
  },
  {
    id: 'aquarelart',
    badge: 'Arte Exclusiva',
    title: 'Aquarelart · Nail Art Delicada',
    subtitle: 'Pintura Artística Botânica & Traços Finos',
    description:
      'Aprenda a criar desenhos manuais delicados, folhas, flores fluidas e detalhes que encantam clientes exigentes. Destaque-se da concorrência oferecendo arte exclusiva.',
    investment: 'R$ 600,00',
    duration: '8 horas (com 1h de almoço)',
    payment: 'Pix ou Cartão de Crédito',
    includes: [
      'Certificado Oficial Aquarelart',
      'Guia de traços e diluição de pigmentos',
      'Brinde exclusivo para treino artístico',
      'Modelos de composições elegantes',
    ],
    modules: [
      {
        title: 'Módulo 1: Teoria das Cores & Materiais',
        items: [
          'Pincéis de cerdas naturais e formato ideal para traços finos',
          'Controle da densidade da água e intensidade de pigmento',
          'Fundo ideal e preparação do leito para a tinta artística',
        ],
      },
      {
        title: 'Módulo 2: Técnicas Botânicas & Florais',
        items: [
          'Pétalas fluidas com transparência suave',
          'Folhagens com efeito sombreado e transição de tons',
          'Botões, ramos finos e mini arabescos contemporâneos',
        ],
      },
      {
        title: 'Módulo 3: Selagem & Durabilidade',
        items: [
          'Secagem e fixação correta do pigmento aquarelado',
          'Top coat finalizador sem craquelar ou borrar o desenho',
        ],
      },
    ],
  },
];

const FAQS = [
  {
    q: 'Preciso ter experiência prévia para fazer o curso de Fibra de Vidro?',
    a: 'Para o curso de Fibra de Vidro Iniciante, não é necessário ter nenhuma experiência! Ensinamos absolutamente tudo do zero, desde a postura e biossegurança até a finalização impecável.',
  },
  {
    q: 'Os materiais estão inclusos durante a aula?',
    a: 'Sim! Todos os materiais profissionais, cabines, motores, lixas, preparadores e géis são disponibilizados pelo Studio durante as aulas práticas.',
  },
  {
    q: 'Como funcionam as turmas?',
    a: 'Trabalhamos com turmas ultra reduzidas ou individuais para garantir que a mentora Ludmila Ribeiro acompanhe de perto cada movimento da sua mão, corrigindo detalhes em tempo real.',
  },
  {
    q: 'Quais são as formas de pagamento disponíveis para os cursos?',
    a: 'Aceitamos Pix (com confirmação imediata de vaga) e Cartão de Crédito em até 12x. Para reservar sua data, solicitamos um sinal de garantia de vaga.',
  },
  {
    q: 'O certificado é emitido na conclusão do curso?',
    a: 'Sim! Ao concluir todas as horas práticas e teóricas, você recebe seu Certificado Oficial chancelado por Ludmila Ribeiro, pronto para expor em seu espaço.',
  },
  {
    q: 'Terei suporte após o término do curso?',
    a: 'Com certeza! Você terá canal direto no WhatsApp com Ludmila Ribeiro para tirar dúvidas de atendimentos, enviar fotos de procedimentos e receber orientações técnicas contínuas.',
  },
];

export default function CursosPage() {
  const [openCourse, setOpenCourse] = useState<string | null>('fibra-iniciante');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const logoGold = useSiteImage('logo_gold', '/images/logo-gold-cropped.png');
  const logoWhite = useSiteImage('logo_white', '/images/logo-white-cropped.png');
  const cursosHero = useSiteImage('cursos_hero', '/images/ludmila-hero.jpg');
  const cursosMesa = useSiteImage('cursos_mesa', '/images/ludmila-esmalte.jpg');
  const cursosBio = useSiteImage('cursos_bio', '/images/biosseguranca.jpg');

  return (
    <div className="min-h-screen text-[#221D19]" style={{ background: C.bg }}>
      {/* Barra de Navegação Superior */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md transition-all shadow-sm"
        style={{ background: 'rgba(250, 248, 245, 0.96)', borderBottom: `1px solid ${C.border}` }}
      >
        <div className="gb-shell flex h-20 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[.18em] transition-colors hover:opacity-80"
            style={{ color: C.text }}
          >
            <ArrowLeft size={16} style={{ color: C.gold }} />
            <span>Voltar ao Início</span>
          </Link>

          <Link href="/" className="inline-block">
            <img
              src={logoGold}
              alt="Studio Ludmila Ribeiro"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <a
            href={`https://wa.me/${CONTACTS.coursesWhatsapp}?text=${encodeURIComponent(
              'Olá Ludmila! Acessei a página de cursos e gostaria de tirar dúvidas e consultar as próximas datas.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-[.15em] transition-all shadow-sm"
            style={{ background: C.gold, color: '#FFFFFF' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = C.goldLight;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = C.gold;
            }}
          >
            <MessageCircle size={14} /> Falar no WhatsApp
          </a>
        </div>
      </header>

      {/* Hero dos Cursos */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: C.bg }}>
        {/* Luz ambiente delicada dourada */}
        <div
          className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(171, 132, 69, 0.18), transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-20 h-[500px] w-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(171, 132, 69, 0.12), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="gb-shell relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Texto de Apresentação */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[.25em] font-semibold" style={{ color: C.gold }}>
                  Educação & Mentoria Profissional
                </span>
              </div>

              <h1 className="gb-display text-4xl leading-[1.1] md:text-6xl font-normal" style={{ color: C.text }}>
                Construa uma carreira de{' '}
                <em className="not-italic" style={{ color: C.gold }}>
                  destaque & autoridade
                </em>{' '}
                em Nail Design.
              </h1>

              <p className="mt-6 text-base leading-relaxed md:text-lg" style={{ color: C.textMuted }}>
                Aprenda diretamente com quem vive a prática do salão há 8 anos. Nossos cursos foram desenvolvidos para ensinar técnicas modernas de alta precisão, postura profissional, redução de tempo em mesa e posicionamento para atrair clientes que valorizam o seu trabalho.
              </p>

              {/* Destaques rápidos */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <Award size={22} style={{ color: C.gold }} />
                  <p className="mt-2 text-sm font-semibold" style={{ color: C.text }}>Certificado Oficial</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: C.textDim }}>Reconhecimento</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <Users size={22} style={{ color: C.gold }} />
                  <p className="mt-2 text-sm font-semibold" style={{ color: C.text }}>Turmas VIP</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: C.textDim }}>Atenção Individual</p>
                </div>
                <div className="rounded-xl p-4 col-span-2 sm:col-span-1" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <Shield size={22} style={{ color: C.gold }} />
                  <p className="mt-2 text-sm font-semibold" style={{ color: C.text }}>Suporte Pós-Curso</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: C.textDim }}>Acompanhamento</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#cursos-disponiveis"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-mono text-[10px] uppercase tracking-[.16em] font-medium shadow-md transition-all"
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
                  Ver Cursos Disponíveis <ChevronRight size={14} />
                </a>
                <a
                  href={`https://wa.me/${CONTACTS.coursesWhatsapp}?text=${encodeURIComponent(
                    'Olá! Gostaria de consultar o calendário e valores de cursos no Studio Ludmila Ribeiro.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-[10px] uppercase tracking-[.16em] font-medium transition-all"
                  style={{ border: `1px solid ${C.borderGold}`, background: C.card, color: C.text }}
                >
                  Consultar Calendário <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Ilustração e Foto de Ludmila */}
            <div className="relative flex justify-center">
              <div
                className="pointer-events-none absolute -inset-4 rounded-t-[220px] rounded-b-3xl opacity-40 blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(171, 132, 69, 0.35), transparent 70%)' }}
              />
              <div
                className="relative w-full max-w-[390px] aspect-[3/4] overflow-hidden rounded-t-[200px] rounded-b-2xl shadow-2xl"
                style={{
                  border: `1px solid ${C.borderGold}`,
                  background: C.card,
                }}
              >
                <img
                  src={cursosHero}
                  alt="Ludmila Ribeiro - Instrutora e Mentora"
                  className="h-full w-full object-cover object-top"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(34, 29, 25, 0.85) 0%, rgba(34, 29, 25, 0) 45%)',
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-serif text-lg font-medium">Ludmila Ribeiro</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#EFE6D6] mt-0.5">
                    Educadora · 8 Anos de Trajetória
                  </p>
                  <p className="mt-2 text-xs text-white/80 leading-relaxed">
                    "Ensinar é passar adiante os segredos que transformaram a minha vida e a de centenas de alunas."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Cursos Completos */}
      <section id="cursos-disponiveis" className="scroll-mt-12 py-20" style={{ background: C.bgAlt }}>
        <div className="gb-shell">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] font-semibold" style={{ color: C.gold }}>
              Formações Disponíveis
            </p>
            <h2 className="gb-display text-3xl md:text-5xl font-normal mt-2" style={{ color: C.text }}>
              Escolha a sua especialização.
            </h2>
            <p className="mt-3 text-sm" style={{ color: C.textMuted }}>
              Cursos individuais ou em grupos reduzidos com foco em prática intensiva e domínio técnico.
            </p>
          </div>

          <div className="space-y-8">
            {ALL_COURSES.map((course) => {
              const isOpen = openCourse === course.id;
              return (
                <div
                  key={course.id}
                  className="rounded-3xl p-7 md:p-10 transition-all duration-300 shadow-sm"
                  style={{
                    background: C.card,
                    border: isOpen ? `1.5px solid ${C.gold}` : `1px solid ${C.border}`,
                    boxShadow: isOpen ? '0 16px 40px rgba(171, 132, 69, 0.12)' : 'none',
                  }}
                >
                  <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
                    {/* Conteúdo Principal */}
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className="rounded-full px-3.5 py-1 font-mono text-[9px] uppercase tracking-[.18em] font-semibold"
                          style={{
                            background: 'rgba(171, 132, 69, 0.12)',
                            color: C.gold,
                            border: '1px solid rgba(171, 132, 69, 0.25)',
                          }}
                        >
                          {course.badge}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px]" style={{ color: C.textDim }}>
                          <Clock3 size={13} style={{ color: C.gold }} /> {course.duration}
                        </span>
                      </div>

                      <h3 className="gb-display text-2xl md:text-3xl font-medium mt-4" style={{ color: C.text }}>
                        {course.title}
                      </h3>
                      <p className="font-mono text-[11px] uppercase tracking-widest mt-1" style={{ color: C.gold }}>
                        {course.subtitle}
                      </p>

                      <p className="mt-4 text-sm leading-relaxed" style={{ color: C.textMuted }}>
                        {course.description}
                      </p>

                      {/* O que está incluso */}
                      <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
                        <p className="font-mono text-[9px] uppercase tracking-widest font-semibold mb-3" style={{ color: C.text }}>
                          O que você recebe:
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {course.includes.map((inc, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: C.textMuted }}>
                              <Check size={14} className="mt-0.5 shrink-0" style={{ color: C.gold }} />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botão de Expandir Ementa Completa */}
                      <button
                        type="button"
                        onClick={() => setOpenCourse(isOpen ? null : course.id)}
                        className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] font-semibold transition-colors"
                        style={{ color: C.gold }}
                      >
                        {isOpen ? 'Recolher Grade Curricular' : 'Ver Grade Curricular Completa & Módulos'}
                        <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="mt-6 space-y-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                          {course.modules.map((mod, mi) => (
                            <div key={mi} className="rounded-xl p-4" style={{ background: C.bg }}>
                              <p className="font-serif text-sm font-semibold" style={{ color: C.text }}>
                                {mod.title}
                              </p>
                              <ul className="mt-2.5 space-y-1.5">
                                {mod.items.map((item, ii) => (
                                  <li key={ii} className="flex items-start gap-2 text-xs" style={{ color: C.textMuted }}>
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: C.gold }} />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card de Investimento & Ação */}
                    <div className="flex flex-col justify-between rounded-2xl p-6 md:p-8" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-[9px] uppercase tracking-widest font-semibold" style={{ color: C.textDim }}>
                            Investimento do Curso
                          </p>
                          <GraduationCap size={20} style={{ color: C.gold }} />
                        </div>
                        <p className="font-serif text-3xl font-bold mt-2" style={{ color: C.gold }}>
                          {course.investment}
                        </p>
                        <p className="font-mono text-[10px] mt-1" style={{ color: C.textMuted }}>
                          {course.payment} · Parcelamento disponível
                        </p>

                        <div className="mt-6 space-y-3 text-xs" style={{ color: C.textMuted }}>
                          <div className="flex items-center gap-2">
                            <Check size={14} style={{ color: C.gold }} />
                            <span>Vagas limitadas por data</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check size={14} style={{ color: C.gold }} />
                            <span>Mentoria prática com modelos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check size={14} style={{ color: C.gold }} />
                            <span>Material de apoio incluso</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
                        <a
                          href={`https://wa.me/${CONTACTS.coursesWhatsapp}?text=${encodeURIComponent(
                            `Olá Ludmila! Quero garantir minha vaga no curso "${course.title} (${course.subtitle})". Pode me informar as próximas datas disponíveis?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-mono text-[10px] uppercase tracking-[.16em] font-medium transition-all shadow-sm"
                          style={{ background: C.gold, color: '#FFFFFF' }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = C.goldLight;
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(171, 132, 69, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = C.gold;
                            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                          }}
                        >
                          Garantir Minha Vaga <ArrowUpRight size={14} />
                        </a>
                        <p className="mt-2.5 text-center font-mono text-[8.5px] uppercase tracking-wider" style={{ color: C.textDim }}>
                          Atendimento direto com a equipe de cursos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Galeria de Fotos Ilustrativas & Estrutura */}
      <section className="py-20" style={{ background: C.card }}>
        <div className="gb-shell">
          <div className="mb-12 text-center max-w-xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] font-semibold" style={{ color: C.gold }}>
              Estrutura & Metodologia
            </p>
            <h2 className="gb-display text-3xl md:text-4xl font-normal mt-2" style={{ color: C.text }}>
              Ambiente preparado para o seu aprendizado.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="group overflow-hidden rounded-2xl shadow-sm" style={{ border: `1px solid ${C.borderGold}` }}>
              <img
                src={cursosMesa}
                alt="Aulas práticas de precisão"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-5" style={{ background: C.bg }}>
                <p className="font-serif text-sm font-semibold" style={{ color: C.text }}>Técnica em Mesa</p>
                <p className="text-xs text-[#6E665E] mt-1">Correção minuciosa de empunhadura e lixamento.</p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl shadow-sm" style={{ border: `1px solid ${C.borderGold}` }}>
              <img
                src={cursosBio}
                alt="Biossegurança e esterilização de materiais"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-5" style={{ background: C.bg }}>
                <p className="font-serif text-sm font-semibold" style={{ color: C.text }}>Biossegurança Rígida</p>
                <p className="text-xs text-[#6E665E] mt-1">Aprenda a trabalhar com conformidade médica e autoclave.</p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl shadow-sm" style={{ border: `1px solid ${C.borderGold}` }}>
              <img
                src={cursosHero}
                alt="Mentoria de carreira com Ludmila Ribeiro"
                className="h-64 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-5" style={{ background: C.bg }}>
                <p className="font-serif text-sm font-semibold" style={{ color: C.text }}>Visão de Negócio</p>
                <p className="text-xs text-[#6E665E] mt-1">Como construir uma clientela fiel e valorizar sua hora.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dúvidas Frequentes */}
      <section className="py-20" style={{ background: C.bgAlt }}>
        <div className="gb-shell max-w-3xl">
          <div className="mb-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] font-semibold" style={{ color: C.gold }}>
              FAQ
            </p>
            <h2 className="gb-display text-3xl md:text-4xl font-normal mt-2" style={{ color: C.text }}>
              Dúvidas Frequentes sobre os Cursos
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 transition-all"
                  style={{ background: C.card, border: `1px solid ${C.border}` }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between text-left font-serif text-base font-semibold"
                    style={{ color: C.text }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: C.gold }} />
                  </button>
                  {isOpen && (
                    <p className="mt-3.5 text-sm leading-relaxed" style={{ color: C.textMuted }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Final */}
          <div className="mt-14 text-center rounded-3xl p-8 md:p-12" style={{ background: C.card, border: `1px solid ${C.borderGold}` }}>
            <p className="font-mono text-[10px] uppercase tracking-[.25em] font-semibold" style={{ color: C.gold }}>
              Ainda tem dúvidas?
            </p>
            <h3 className="gb-display text-2xl md:text-3xl font-medium mt-2" style={{ color: C.text }}>
              Fale agora com a nossa equipe de cursos.
            </h3>
            <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: C.textMuted }}>
              Tiramos todas as suas dúvidas sobre datas, formas de parcelamento e conteúdo pedagógico.
            </p>
            <a
              href={`https://wa.me/${CONTACTS.coursesWhatsapp}?text=${encodeURIComponent(
                'Olá Ludmila! Gostaria de mais informações sobre os cursos disponíveis no Studio.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-mono text-[10px] uppercase tracking-[.16em] font-medium shadow-md transition-all"
              style={{ background: C.gold, color: '#FFFFFF' }}
            >
              Falar no WhatsApp: {CONTACTS.coursesWhatsappLabel} <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Rodapé Oficial em Dourado */}
      <footer
        className="pb-12 pt-16 text-white"
        style={{
          background: C.gold,
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        }}
      >
        <div className="gb-shell">
          <div className="flex flex-col items-center justify-between gap-6 pb-10 text-center md:flex-row md:text-left" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Link href="/">
              <img
                src={logoWhite}
                alt="Studio Ludmila Ribeiro"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/80">Instagram Educacional</p>
              <a
                href={CONTACTS.instagramNailsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold underline underline-offset-4 mt-1 inline-block"
              >
                {CONTACTS.instagramNails}
              </a>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/80">WhatsApp Cursos</p>
              <a
                href={`https://wa.me/${CONTACTS.coursesWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold underline underline-offset-4 mt-1 inline-block"
              >
                {CONTACTS.coursesWhatsappLabel}
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center gap-4 pt-6 font-mono text-[10px] uppercase tracking-[.14em] md:flex-row text-white/75">
            <span>© {new Date().getFullYear()} Studio Ludmila Ribeiro · Formação Profissional</span>
            <Link href="/" className="hover:text-white underline underline-offset-4">
              Voltar à Página Principal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
