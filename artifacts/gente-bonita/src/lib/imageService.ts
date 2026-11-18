import { useState, useEffect } from 'react';

export type SiteImageKey =
  | 'logo_gold'
  | 'logo_white'
  | 'hero_ludmila'
  | 'about_1'
  | 'about_2'
  | 'cursos_hero'
  | 'cursos_mesa'
  | 'cursos_bio';

export type SiteImageMeta = {
  key: SiteImageKey;
  section: string;
  label: string;
  description: string;
  defaultSrc: string;
  recommendedRatio: string;
};

export const SITE_IMAGES_REGISTRY: SiteImageMeta[] = [
  // IDENTIDADE VISUAL
  {
    key: 'logo_gold',
    section: 'Identidade Visual & Cabeçalho',
    label: 'Logo Principal Dourada',
    description: 'Aparece no menu superior fixo de todas as páginas do site (fundo claro).',
    defaultSrc: '/images/logo-gold-cropped.png',
    recommendedRatio: 'Horizontal / Transparente (PNG)',
  },
  {
    key: 'logo_white',
    section: 'Identidade Visual & Cabeçalho',
    label: 'Logo Branca do Rodapé',
    description: 'Aparece no rodapé dourado com fundo escuro de todas as páginas.',
    defaultSrc: '/images/logo-white-cropped.png',
    recommendedRatio: 'Horizontal / Transparente em Branco (PNG)',
  },

  // PÁGINA INICIAL (HOME)
  {
    key: 'hero_ludmila',
    section: 'Página Inicial (Início / Hero)',
    label: 'Foto Principal da Hero (Moldura Arqueada)',
    description: 'A foto principal de Ludmila Ribeiro que fica no arco elegante logo na abertura do site.',
    defaultSrc: '/images/ludmila-hero.jpg',
    recommendedRatio: 'Vertical (Proporção 3:4 recomendada)',
  },
  {
    key: 'about_1',
    section: 'Página Inicial (Seção "O Studio")',
    label: 'Foto de Atendimento na Mesa',
    description: 'Foto do atendimento, cuidado das unhas e esmaltação na seção "O Espaço & Excelência".',
    defaultSrc: '/images/ludmila-esmalte.jpg',
    recommendedRatio: 'Horizontal ou Quadrada (Proporção 4:3)',
  },
  {
    key: 'about_2',
    section: 'Página Inicial (Seção "O Studio")',
    label: 'Foto de Biossegurança e Esterilização',
    description: 'Foto dos materiais cirúrgicos esterilizados e instrumentais de biossegurança.',
    defaultSrc: '/images/biosseguranca.jpg',
    recommendedRatio: 'Horizontal ou Quadrada (Proporção 4:3)',
  },

  // PÁGINA DE CURSOS (/cursos)
  {
    key: 'cursos_hero',
    section: 'Página de Cursos Profissionais (/cursos)',
    label: 'Foto de Destaque da Mentora',
    description: 'Aparece na abertura da página de cursos no arco de apresentação da instrutora.',
    defaultSrc: '/images/ludmila-hero.jpg',
    recommendedRatio: 'Vertical (Proporção 3:4)',
  },
  {
    key: 'cursos_mesa',
    section: 'Página de Cursos Profissionais (/cursos)',
    label: 'Foto da Galeria: Técnica em Mesa',
    description: 'Foto que ilustra a prática dos cursos e postura de mesa na galeria de estrutura.',
    defaultSrc: '/images/ludmila-esmalte.jpg',
    recommendedRatio: 'Retangular (Proporção 4:3 ou 16:9)',
  },
  {
    key: 'cursos_bio',
    section: 'Página de Cursos Profissionais (/cursos)',
    label: 'Foto da Galeria: Biossegurança nos Cursos',
    description: 'Foto demonstrando autoclave, materiais esterilizados e conformidade médica.',
    defaultSrc: '/images/biosseguranca.jpg',
    recommendedRatio: 'Retangular (Proporção 4:3 ou 16:9)',
  },
];

const STORAGE_PREFIX = 'studio_custom_img_';
const GALLERY_STORAGE_KEY = 'studio_about_gallery_v1';
const EVENT_NAME = 'studio-images-changed';
const GALLERY_EVENT_NAME = 'studio-gallery-changed';

export type AboutGalleryItem = {
  id: string;
  url: string;
  caption: string;
};

export const DEFAULT_ABOUT_GALLERY: AboutGalleryItem[] = [
  {
    id: 'about-default-1',
    url: '/images/ludmila-esmalte.jpg',
    caption: 'Atendimento exclusivo e esmaltação em gel de alta precisão',
  },
  {
    id: 'about-default-2',
    url: '/images/biosseguranca.jpg',
    caption: 'Biossegurança rigorosa com materiais esterilizados em autoclave',
  },
  {
    id: 'about-default-3',
    url: '/images/ludmila-hero.jpg',
    caption: 'Ambiente acolhedor e atendimento humanizado',
  },
];

export function getAboutGallery(): AboutGalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return DEFAULT_ABOUT_GALLERY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ABOUT_GALLERY;
  } catch {
    return DEFAULT_ABOUT_GALLERY;
  }
}

export function saveAboutGallery(items: AboutGalleryItem[]): void {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(GALLERY_EVENT_NAME, { detail: items }));
  } catch (e) {
    console.error('Erro ao salvar galeria:', e);
    throw e;
  }
}

export function addAboutGalleryImage(url: string, caption = ''): AboutGalleryItem[] {
  const current = getAboutGallery();
  const newItem: AboutGalleryItem = {
    id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    url,
    caption: caption || 'Foto do Studio Ludmila Ribeiro',
  };
  const updated = [...current, newItem];
  saveAboutGallery(updated);
  return updated;
}

export function removeAboutGalleryImage(id: string): AboutGalleryItem[] {
  const current = getAboutGallery();
  const updated = current.filter((item) => item.id !== id);
  const final = updated.length > 0 ? updated : DEFAULT_ABOUT_GALLERY;
  saveAboutGallery(final);
  return final;
}

export function resetAboutGallery(): AboutGalleryItem[] {
  try {
    localStorage.removeItem(GALLERY_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(GALLERY_EVENT_NAME, { detail: DEFAULT_ABOUT_GALLERY }));
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_ABOUT_GALLERY;
}

export function useAboutGallery(): AboutGalleryItem[] {
  const [gallery, setGallery] = useState<AboutGalleryItem[]>(getAboutGallery);

  useEffect(() => {
    function handleUpdate(e: any) {
      if (e.detail) {
        setGallery(e.detail);
      } else {
        setGallery(getAboutGallery());
      }
    }
    window.addEventListener(GALLERY_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(GALLERY_EVENT_NAME, handleUpdate);
  }, []);

  return gallery;
}

export function getCustomImage(key: SiteImageKey, defaultSrc: string): string {
  try {
    const custom = localStorage.getItem(STORAGE_PREFIX + key);
    return custom || defaultSrc;
  } catch {
    return defaultSrc;
  }
}

export function setCustomImage(key: SiteImageKey, dataUrl: string): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, dataUrl);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key, dataUrl } }));
  } catch (e) {
    console.error('Erro ao salvar imagem customizada:', e);
    throw e;
  }
}

export function removeCustomImage(key: SiteImageKey): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key, dataUrl: null } }));
  } catch (e) {
    console.error('Erro ao resetar imagem:', e);
  }
}

// Hook reativo para utilizar imagens no React
export function useSiteImage(key: SiteImageKey, defaultSrc: string): string {
  const [src, setSrc] = useState<string>(() => getCustomImage(key, defaultSrc));

  useEffect(() => {
    function handleUpdate(e: any) {
      if (e.detail?.key === key || !e.detail?.key) {
        setSrc(getCustomImage(key, defaultSrc));
      }
    }
    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(EVENT_NAME, handleUpdate);
  }, [key, defaultSrc]);

  return src;
}

// Otimizador de imagem via Canvas para suportar upload de celulares e computadores com alta velocidade
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Se for PNG pequeno, preserva transparência sem compressão
    if (file.type === 'image/png' && file.size < 600 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1600;
        const maxHeight = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Se for PNG preserva transparência
        const isPng = file.type === 'image/png';
        ctx.drawImage(img, 0, 0, width, height);

        const mime = isPng ? 'image/png' : 'image/jpeg';
        const quality = isPng ? undefined : 0.88;
        const resultDataUrl = canvas.toDataURL(mime, quality);
        resolve(resultDataUrl);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
