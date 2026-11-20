import { useState, useEffect } from 'react';

export type SiteImageKey =
  | 'logo_gold'
  | 'logo_white'
  | 'hero_ludmila'
  | 'cursos_teaser'
  | 'about_1'
  | 'about_2'
  | 'cursos_hero'
  | 'cursos_mesa'
  | 'cursos_bio'
  | 'service_icon_alongamento'
  | 'service_icon_manutencao'
  | 'service_icon_banho_gel'
  | 'service_icon_manicure_pedicure'
  | 'service_icon_spa_pes'
  | 'service_icon_argiloterapia';

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

  // ÍCONES / FOTOS DOS CARDS DE SERVIÇOS
  {
    key: 'service_icon_alongamento',
    section: 'Cards de Serviços (Fotos / Ícones Redondos)',
    label: 'Card 1: Alongamento em Fibra',
    description: 'Foto ou ícone redondo que aparece no topo do card de Alongamento em Fibra.',
    defaultSrc: '',
    recommendedRatio: 'Foto Quadrada ou Redonda (1:1)',
  },
  {
    key: 'service_icon_manutencao',
    section: 'Cards de Serviços (Fotos / Ícones Redondos)',
    label: 'Card 2: Manutenção de Fibra',
    description: 'Foto ou ícone redondo que aparece no topo do card de Manutenção de Fibra.',
    defaultSrc: '',
    recommendedRatio: 'Foto Quadrada ou Redonda (1:1)',
  },
  {
    key: 'service_icon_banho_gel',
    section: 'Cards de Serviços (Fotos / Ícones Redondos)',
    label: 'Card 3: Banho de Gel',
    description: 'Foto ou ícone redondo que aparece no topo do card de Banho de Gel.',
    defaultSrc: '',
    recommendedRatio: 'Foto Quadrada ou Redonda (1:1)',
  },
  {
    key: 'service_icon_manicure_pedicure',
    section: 'Cards de Serviços (Fotos / Ícones Redondos)',
    label: 'Card 4: Manicure & Pedicure',
    description: 'Foto ou ícone redondo que aparece no topo do card de Manicure & Pedicure.',
    defaultSrc: '',
    recommendedRatio: 'Foto Quadrada ou Redonda (1:1)',
  },
  {
    key: 'service_icon_spa_pes',
    section: 'Cards de Serviços (Fotos / Ícones Redondos)',
    label: 'Card 5: Spa dos Pés',
    description: 'Foto ou ícone redondo que aparece no topo do card de Spa dos Pés.',
    defaultSrc: '',
    recommendedRatio: 'Foto Quadrada ou Redonda (1:1)',
  },
  {
    key: 'service_icon_argiloterapia',
    section: 'Cards de Serviços (Fotos / Ícones Redondos)',
    label: 'Card 6: Argiloterapia & Óleos',
    description: 'Foto ou ícone redondo que aparece no topo do card de Argiloterapia & Óleos.',
    defaultSrc: '',
    recommendedRatio: 'Foto Quadrada ou Redonda (1:1)',
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
    key: 'cursos_teaser',
    section: 'Página Inicial (Seção Cursos / Mentoria)',
    label: 'Foto da Seção de Cursos na Home',
    description: 'Foto que aparece no card da seção "Educação & Mentoria Profissional" na página inicial, ao lado dos cursos em destaque. É independente da foto da Hero.',
    defaultSrc: '/images/ludmila-hero.jpg',
    recommendedRatio: 'Vertical (Proporção 4:5 recomendada)',
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
    idbSet('__gallery_items__', JSON.stringify(items));
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
    } catch (quotaErr) {
      console.warn('Aviso: localStorage sem espaço para galeria, mantido no IndexedDB:', quotaErr);
    }
    window.dispatchEvent(new CustomEvent(GALLERY_EVENT_NAME, { detail: items }));
  } catch (e) {
    console.error('Erro ao salvar galeria:', e);
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

// -------------------------------------------------------------
// ARMAZENAMENTO RESILIENTE (IndexedDB + Memória + LocalStorage)
// Suporta centenas de megabytes sem estourar cota do navegador
// -------------------------------------------------------------
const IDB_NAME = 'StudioLudmilaDB_v2';
const IDB_STORE = 'custom_images';
const IDB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getIDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB indisponível'));
      }
      try {
        const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE);
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }
  return dbPromise;
}

async function idbSet(key: string, val: string): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(val, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Aviso IndexedDB set:', e);
  }
}

async function idbGet(key: string): Promise<string | null> {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function idbDelete(key: string): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}

async function idbGetAll(): Promise<Record<string, string>> {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.openCursor();
      const results: Record<string, string> = {};
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          results[cursor.key as string] = cursor.value;
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

const memoryCache = new Map<string, string>();

// Carrega imediatamente do localStorage de forma síncrona
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) {
        const imageKey = k.slice(STORAGE_PREFIX.length);
        const val = localStorage.getItem(k);
        if (val) {
          memoryCache.set(imageKey, val);
          // Otimiza em background se for item antigo muito pesado (> 300KB)
          if (val.length > 300 * 1024) {
            setTimeout(() => autoCompressStoredImage(imageKey as SiteImageKey, val), 600);
          }
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao ler localStorage inicial:', e);
  }
}

// Sincroniza com o IndexedDB de forma assíncrona
if (typeof window !== 'undefined') {
  idbGetAll().then((items) => {
    let hasChanges = false;
    for (const [key, val] of Object.entries(items)) {
      if (val && !memoryCache.has(key)) {
        memoryCache.set(key, val);
        try {
          localStorage.setItem(STORAGE_PREFIX + key, val);
        } catch {
          // ignore quota
        }
        hasChanges = true;
      }
    }
    // Também garante que tudo do localStorage esteja salvo no IndexedDB
    for (const [key, val] of memoryCache.entries()) {
      if (!items[key]) {
        idbSet(key, val);
      }
    }
    if (hasChanges) {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
    }
  }).catch(() => {});
}

// Auto-compressor inteligente para recuperar espaço caso existam fotos gigantes gravadas anteriormente
function autoCompressStoredImage(key: SiteImageKey, largeDataUrl: string) {
  if (typeof window === 'undefined' || !largeDataUrl.startsWith('data:image')) return;
  const img = new Image();
  img.onload = () => {
    try {
      const isIcon = key.startsWith('service_icon_');
      const maxDim = isIcon ? 512 : 1200;
      let width = img.width;
      let height = img.height;
      if (width <= maxDim && height <= maxDim && largeDataUrl.length < 200 * 1024) return;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);

      const isPng = largeDataUrl.startsWith('data:image/png');
      let compressed = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.85);
      if (compressed.length > 300 * 1024) {
        try {
          const webp = canvas.toDataURL('image/webp', 0.88);
          if (webp && webp.startsWith('data:image/webp')) compressed = webp;
        } catch {}
      }

      if (compressed.length < largeDataUrl.length) {
        memoryCache.set(key, compressed);
        idbSet(key, compressed);
        try {
          localStorage.setItem(STORAGE_PREFIX + key, compressed);
        } catch {}
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key, dataUrl: compressed } }));
      }
    } catch {}
  };
  img.src = largeDataUrl;
}

export function getCustomImage(key: SiteImageKey, defaultSrc: string): string {
  try {
    const cached = memoryCache.get(key);
    if (cached) return cached;
    if (typeof localStorage !== 'undefined') {
      const custom = localStorage.getItem(STORAGE_PREFIX + key);
      if (custom) {
        memoryCache.set(key, custom);
        return custom;
      }
    }
    return defaultSrc;
  } catch {
    return defaultSrc;
  }
}

export function setCustomImage(key: SiteImageKey, dataUrl: string): void {
  try {
    // 1. Atualiza memória imediatamente (ultra-rápido)
    memoryCache.set(key, dataUrl);

    // 2. Salva no IndexedDB (alta capacidade, suporta centenas de MB)
    idbSet(key, dataUrl);

    // 3. Tenta salvar no localStorage de forma segura
    try {
      localStorage.setItem(STORAGE_PREFIX + key, dataUrl);
    } catch (quotaErr) {
      console.warn('LocalStorage cheio; imagem mantida em IndexedDB e memória sem perda:', quotaErr);
    }

    // 4. Notifica todos os componentes na hora
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key, dataUrl } }));
  } catch (e) {
    console.error('Erro ao definir imagem customizada:', e);
  }
}

export function removeCustomImage(key: SiteImageKey): void {
  try {
    memoryCache.delete(key);
    idbDelete(key);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_PREFIX + key);
    }
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

export interface ProcessImageOptions {
  isIcon?: boolean;
  maxDimension?: number;
}

// Otimizador universal de imagens para suportar upload de QUALQUER formato
// (PNG, JPG, JPEG, WEBP, SVG, GIF, AVIF, ICO, BMP, etc.)
export function processImageFile(file: File, options?: ProcessImageOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('Nenhum arquivo recebido.'));
    }

    const fileName = file.name ? file.name.toLowerCase() : '';
    const fileType = file.type ? file.type.toLowerCase() : '';

    // 1. Arquivos SVG: lê como DataURL vetorial preservando nitidez infinita
    if (fileType === 'image/svg+xml' || fileName.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Erro ao ler arquivo SVG.'));
      reader.readAsDataURL(file);
      return;
    }

    // 2. Arquivos de imagem leves (ex: ícones ou gifs < 80KB)
    if (file.size < 80 * 1024 && (fileType.includes('gif') || fileType.includes('ico') || fileName.endsWith('.ico'))) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Erro ao ler arquivo leve.'));
      reader.readAsDataURL(file);
      return;
    }

    // 3. Processamento universal via Canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error('Falha ao processar arquivo.'));
      }

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = options?.maxDimension || (options?.isIcon ? 512 : 1200);
          let width = img.width || maxDim;
          let height = img.height || maxDim;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const hasTransparency =
            fileType === 'image/png' ||
            fileType === 'image/webp' ||
            fileType === 'image/gif' ||
            fileName.endsWith('.png') ||
            fileName.endsWith('.webp');

          let resultDataUrl = '';
          if (hasTransparency) {
            resultDataUrl = canvas.toDataURL('image/png');
            // Se o PNG ficou pesado (> 350KB), converte para WEBP mantendo transparência e reduzindo ~80% do peso
            if (resultDataUrl.length > 350 * 1024) {
              try {
                const webpUrl = canvas.toDataURL('image/webp', 0.90);
                if (webpUrl && webpUrl.startsWith('data:image/webp')) {
                  resultDataUrl = webpUrl;
                }
              } catch {
                // mantém png
              }
            }
          } else {
            resultDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          }

          resolve(resultDataUrl || rawDataUrl);
        } catch (canvasErr) {
          console.warn('Canvas fallback para rawDataUrl:', canvasErr);
          resolve(rawDataUrl);
        }
      };

      // Se o formato não puder ser renderizado no canvas 2D diretamente,
      // faz fallback direto para o DataURL original!
      // Isso garante que QUALQUER formato de imagem seja aceito sem dar erro!
      img.onerror = () => {
        console.warn('Image decode fallback para rawDataUrl do arquivo:', fileName);
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo. Verifique se o arquivo está acessível.'));
    reader.readAsDataURL(file);
  });
}
