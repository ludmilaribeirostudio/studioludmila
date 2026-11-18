import { useState, useEffect } from 'react';

export type HeroShapeType = 'curva-organica' | 'onda-suave' | 'diagonal-moderna' | 'nenhum';

export type SiteContent = {
  // Cores do Rodapé
  footerBg: string;
  footerTextColor: string;

  // Informações de Contato
  whatsappNumber: string;
  whatsappLabel: string;
  coursesWhatsapp: string;
  coursesWhatsappLabel: string;
  address: string;
  mapsUrl: string;
  hours: string;
  pixKey: string;
  instagramHandle: string;
  instagramUrl: string;
  instagramNails: string;
  instagramNailsUrl: string;

  // Horários de Agendamento do Salão
  bookingTimeSlots: string[];

  // Configuração da Divisão Curvada da Hero
  heroShapeEnabled: boolean;
  heroShapeType: HeroShapeType;
  heroShapeColor1: string;
  heroShapeColor2: string;
  heroShapeOpacity: number;

  // Textos da Hero (Abertura)
  heroTitleLead: string;
  heroTitleHighlight: string;
  heroBadgeName: string;
  heroBadgeSubtitle: string;
  heroTagline: string;

  // Textos da Seção "O Studio"
  aboutTitle: string;
  aboutTitleHighlight: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutFooterNote: string;

  // Textos do Rodapé
  footerDescription: string;
  footerCopyrightTagline: string;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  footerBg: '#ab8445',
  footerTextColor: '#FFFFFF',

  whatsappNumber: '5566992008906',
  whatsappLabel: '(66) 99200-8906',
  coursesWhatsapp: '5527998661708',
  coursesWhatsappLabel: '(27) 99866-1708',
  address: 'Av. Brasil, nº 484, Bom Jesus, Sorriso - MT (Interfone 01 · acima da Brasil Dourado)',
  mapsUrl: 'https://maps.google.com/?q=Av.+Brasil,+484,+Bom+Jesus,+Sorriso+MT',
  hours: 'Seg–Sex: 08h–17h · Sábado: 08h–15h',
  pixKey: '51660723000158',
  instagramHandle: '@studio.ludmilaribeiro',
  instagramUrl: 'https://instagram.com/studio.ludmilaribeiro',
  instagramNails: '@ludmilaribeiro.naildesigner',
  instagramNailsUrl: 'https://instagram.com/ludmilaribeiro.naildesigner',

  bookingTimeSlots: [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ],

  // Padrão da Divisão Curvada Dourada
  heroShapeEnabled: true,
  heroShapeType: 'curva-organica',
  heroShapeColor1: '#d4b27c',
  heroShapeColor2: '#ab8445',
  heroShapeOpacity: 95,

  heroTitleLead: 'Aqui cada detalhe é pensado para realçar o que você tem de mais bonito:',
  heroTitleHighlight: 'A SUA ESSÊNCIA',
  heroBadgeName: 'Ludmila Ribeiro',
  heroBadgeSubtitle: 'Nail Designer · 8 anos de excelência',
  heroTagline: 'A elegância começa nos detalhes, e os dedos são o primeiro passo!',

  aboutTitle: 'Aqui, o cuidado não é uma etapa.',
  aboutTitleHighlight: 'É a experiência inteira.',
  aboutParagraph1:
    'O Studio Ludmila Ribeiro nasceu para ser um lugar de pausa e acolhimento. Um refúgio aconchegante onde cada detalhe — do primeiro café ao toque final — existe para realçar o que você tem de mais belo.',
  aboutParagraph2:
    'Equipamentos de alta tecnologia, café especial e atendimento humanizado. Aqui, você não faz apenas as unhas — você vive um momento de tranquilidade, autoestima e autocuidado.',
  aboutFooterNote: 'Higiene e biossegurança rigorosa com materiais esterilizados em autoclave e descartáveis.',

  footerDescription:
    'Um espaço de acolhimento e excelência em Sorriso - MT. Técnicas modernas de alongamento, saúde das unhas e momentos exclusivos para o seu bem-estar.',
  footerCopyrightTagline: 'A elegância começa nos detalhes.',
};

const STORAGE_KEY = 'studio_site_content_v2';
const EVENT_NAME = 'studio-content-changed';

export function getSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SITE_CONTENT, ...parsed };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Erro ao salvar conteúdo do site:', err);
  }
}

export function resetSiteContent(): SiteContent {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Erro ao resetar conteúdo do site:', err);
  }
  return DEFAULT_SITE_CONTENT;
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(getSiteContent);

  useEffect(() => {
    function handleUpdate() {
      setContent(getSiteContent());
    }

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return content;
}
