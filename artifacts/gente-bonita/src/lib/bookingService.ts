import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSiteContent } from './contentService';

export type Booking = {
  id: string;
  name: string;
  whatsapp: string;
  services: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  observations?: string;
  paymentMethod: 'pix' | 'cartao' | 'presencial';
  paymentStatus: 'pendente' | 'pago' | 'no_local';
  status: 'pendente' | 'confirmado' | 'cancelado';
  estimatedTotal?: number;
  createdAt: string;
};

export const SUPABASE_KEYS = {
  publishable: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  secret: '',
};

const STORAGE_KEY = 'ludmila_studio_bookings_v1';
const SUPABASE_URL_STORAGE_KEY = 'ludmila_supabase_url';

// Instância opcional do Supabase caso a URL esteja configurada
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseUrl(): string {
  return localStorage.getItem(SUPABASE_URL_STORAGE_KEY) || import.meta.env.VITE_SUPABASE_URL || '';
}

export function setSupabaseUrl(url: string) {
  localStorage.setItem(SUPABASE_URL_STORAGE_KEY, url.trim());
  supabaseInstance = null; // reset to reinitialize
}

export function getSupabaseClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  if (!url) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, SUPABASE_KEYS.publishable);
    } catch (e) {
      console.warn('Erro ao inicializar Supabase:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Obter agendamentos salvos (LocalStorage + Supabase sincronizados)
export async function getBookings(): Promise<Booking[]> {
  let localBookings: Booking[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      localBookings = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Erro ao ler bookings locais:', e);
  }

  // Tenta sincronizar com Supabase se disponível
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('bookings')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (!error && data && Array.isArray(data)) {
        // Mescla garantindo que itens mais recentes prevaleçam
        const map = new Map<string, Booking>();
        localBookings.forEach((b) => map.set(b.id, b));
        data.forEach((b: any) => map.set(b.id, b));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('Supabase offline ou tabela inexistente, usando dados locais:', err);
    }
  }

  return localBookings;
}

// Salvar ou atualizar um agendamento
export async function saveBooking(booking: Booking): Promise<Booking> {
  // Salva localmente primeiro para resposta imediata
  const current = await getBookings();
  const index = current.findIndex((b) => b.id === booking.id);
  let updated: Booking[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = booking;
  } else {
    updated = [booking, ...current];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Envia ao Supabase em background
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('bookings').upsert([booking]);
    } catch (err) {
      console.warn('Falha ao sincronizar com Supabase:', err);
    }
  }

  return booking;
}

// Excluir agendamento
export async function deleteBooking(id: string): Promise<void> {
  const current = await getBookings();
  const updated = current.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('bookings').delete().eq('id', id);
    } catch (err) {
      console.warn('Falha ao excluir no Supabase:', err);
    }
  }
}

// Verificar se um determinado horário está ocupado em uma data
export function isSlotTaken(bookings: Booking[], date: string, time: string, excludeId?: string): boolean {
  return bookings.some(
    (b) =>
      b.date === date &&
      b.time === time &&
      b.id !== excludeId &&
      b.status !== 'cancelado'
  );
}

// Horários de atendimento disponíveis no Studio
export const AVAILABLE_TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];
