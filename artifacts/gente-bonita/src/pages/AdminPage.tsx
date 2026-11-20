import { useState, useEffect } from 'react';
import {
  ArrowLeft, Check, Clock3, Edit2, LogOut, Phone, Plus, Search,
  Trash2, X, MessageCircle, AlertCircle, Database, Calendar, ShieldCheck,
  CheckCircle2, RefreshCw, Image as ImageIcon, Upload, RotateCcw, Sparkles,
  Palette, Type, Sliders, MapPin, CreditCard, Save
} from 'lucide-react';
import {
  SITE_IMAGES_REGISTRY,
  getCustomImage,
  setCustomImage,
  removeCustomImage,
  processImageFile,
  useAboutGallery,
  addAboutGalleryImage,
  removeAboutGalleryImage,
  resetAboutGallery,
  type SiteImageKey,
  type AboutGalleryItem,
} from '@/lib/imageService';
import {
  getSiteContent,
  saveSiteContent,
  resetSiteContent,
  DEFAULT_SITE_CONTENT,
  type SiteContent,
} from '@/lib/contentService';
import { Link } from 'wouter';
import {
  getBookings,
  saveBooking,
  deleteBooking,
  AVAILABLE_TIME_SLOTS,
  isSlotTaken,
  getSupabaseUrl,
  setSupabaseUrl,
  SUPABASE_KEYS,
  type Booking,
} from '@/lib/bookingService';

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

const ADMIN_PASSWORD = 'SparibeiroOn2026';
const AUTH_KEY = 'ludmila_admin_auth_v1';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'confirmado' | 'cancelado'>('todos');
  const [dateFilter, setDateFilter] = useState('');

  // Aba ativa: 'agenda' | 'fotos' | 'personalizacao'
  const [activeTab, setActiveTab] = useState<'agenda' | 'fotos' | 'personalizacao'>('agenda');

  // Estado da Galeria de Fotos
  const [photoSectionFilter, setPhotoSectionFilter] = useState<string>('todas');
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [photoRefresh, setPhotoRefresh] = useState(0);

  // Estado do Carrossel Dinâmico da Seção "Sobre" (fotos ilimitadas)
  const aboutGallery = useAboutGallery();
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [uploadingCarousel, setUploadingCarousel] = useState(false);

  // Estado da Personalização do Site (Textos, Cores & Horários)
  const [siteForm, setSiteForm] = useState<SiteContent>(getSiteContent);
  const [contentSaveSuccess, setContentSaveSuccess] = useState(false);
  const [newSlotInput, setNewSlotInput] = useState('');

  function handleSaveSiteContent(e: React.FormEvent) {
    e.preventDefault();
    saveSiteContent(siteForm);
    setContentSaveSuccess(true);
    setTimeout(() => setContentSaveSuccess(false), 3500);
  }

  function handleResetSiteContent() {
    if (window.confirm('Deseja restaurar todos os textos, cores e horários para o padrão original do salão?')) {
      const def = resetSiteContent();
      setSiteForm(def);
      setContentSaveSuccess(true);
      setTimeout(() => setContentSaveSuccess(false), 3500);
    }
  }

  function handleAddSlot() {
    const val = newSlotInput.trim();
    if (!val) return;
    if (siteForm.bookingTimeSlots.includes(val)) {
      alert('Este horário já está na lista.');
      return;
    }
    const updated = [...siteForm.bookingTimeSlots, val].sort();
    setSiteForm({ ...siteForm, bookingTimeSlots: updated });
    setNewSlotInput('');
  }

  function handleRemoveSlot(slot: string) {
    const updated = siteForm.bookingTimeSlots.filter((s) => s !== slot);
    setSiteForm({ ...siteForm, bookingTimeSlots: updated });
  }

  async function handleFileUpload(key: SiteImageKey, file: File) {
    try {
      setUploadingKey(key);
      const isIcon = key.startsWith('service_icon_');
      const dataUrl = await processImageFile(file, { isIcon });
      setCustomImage(key, dataUrl);
      setPhotoRefresh((c) => c + 1);
      setPhotoMessage('Foto ou ícone atualizado com sucesso! A alteração já está visível no site.');
      setTimeout(() => setPhotoMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      alert('Não foi possível enviar a imagem: ' + (err?.message || 'Arquivo ilegível. Tente novamente.'));
    } finally {
      setUploadingKey(null);
    }
  }

  function handleResetImage(key: SiteImageKey) {
    if (window.confirm('Deseja restaurar a foto padrão original deste local?')) {
      removeCustomImage(key);
      setPhotoRefresh((c) => c + 1);
      setPhotoMessage('Foto restaurada para o padrão do salão.');
      setTimeout(() => setPhotoMessage(null), 3000);
    }
  }

  async function handleAddGalleryImage(file: File) {
    try {
      setUploadingCarousel(true);
      const dataUrl = await processImageFile(file, { maxDimension: 1400 });
      addAboutGalleryImage(dataUrl, newGalleryCaption || 'Foto do Studio Ludmila Ribeiro');
      setNewGalleryCaption('');
      setPhotoMessage('Nova foto adicionada ao carrossel com sucesso! O carrossel já está atualizado no site.');
      setTimeout(() => setPhotoMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Erro ao processar imagem para o carrossel. Tente outro arquivo.');
    } finally {
      setUploadingCarousel(false);
    }
  }

  function handleRemoveGalleryImage(id: string) {
    if (window.confirm('Tem certeza que deseja remover esta foto do carrossel?')) {
      removeAboutGalleryImage(id);
      setPhotoMessage('Foto removida do carrossel.');
      setTimeout(() => setPhotoMessage(null), 3000);
    }
  }

  function handleResetGallery() {
    if (window.confirm('Deseja restaurar as fotos padrão originais do carrossel?')) {
      resetAboutGallery();
      setPhotoMessage('Carrossel restaurado para as fotos originais.');
      setTimeout(() => setPhotoMessage(null), 3000);
    }
  }

  // Modal de edição / novo agendamento
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Configurações Supabase
  const [showConfig, setShowConfig] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(getSupabaseUrl());
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  async function loadData() {
    setLoading(true);
    const data = await getBookings();
    setBookings(data);
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  }

  async function updateStatus(booking: Booking, newStatus: 'pendente' | 'confirmado' | 'cancelado') {
    const updated = { ...booking, status: newStatus };
    await saveBooking(updated);
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
  }

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este agendamento?')) {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  }

  async function handleSaveModal(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBooking) return;

    // Verificar se horário já está ocupado
    const conflict = isSlotTaken(bookings, editingBooking.date, editingBooking.time, editingBooking.id);
    if (conflict && editingBooking.status !== 'cancelado') {
      const confirmConflict = window.confirm(
        `Atenção: Já existe outro agendamento no dia ${editingBooking.date} às ${editingBooking.time}. Deseja manter mesmo com sobreposição de horário?`
      );
      if (!confirmConflict) return;
    }

    await saveBooking(editingBooking);
    await loadData();
    setModalOpen(false);
    setEditingBooking(null);
  }

  function openNewModal() {
    setEditingBooking({
      id: 'adm-' + Date.now().toString(),
      name: '',
      whatsapp: '',
      services: ['Alongamento em Fibra'],
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      observations: '',
      paymentMethod: 'presencial',
      paymentStatus: 'no_local',
      status: 'confirmado',
      estimatedTotal: 200,
      createdAt: new Date().toISOString(),
    });
    setModalOpen(true);
  }

  function openEditModal(booking: Booking) {
    setEditingBooking({ ...booking });
    setModalOpen(true);
  }

  function handleSaveSupabaseConfig(e: React.FormEvent) {
    e.preventDefault();
    setSupabaseUrl(supabaseUrlInput);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
    loadData();
  }

  // Filtragem dos agendamentos
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.whatsapp.includes(search) ||
      b.services.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'todos' || b.status === statusFilter;
    const matchDate = !dateFilter || b.date === dateFilter;

    return matchSearch && matchStatus && matchDate;
  });

  // Métricas
  const total = bookings.length;
  const pendentes = bookings.filter((b) => b.status === 'pendente').length;
  const confirmados = bookings.filter((b) => b.status === 'confirmado').length;
  const hoje = new Date().toISOString().split('T')[0];
  const hojeCount = bookings.filter((b) => b.date === hoje && b.status !== 'cancelado').length;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" style={{ background: C.bg }}>
        <div
          className="w-full max-w-md rounded-3xl p-8 md:p-10 shadow-lg text-center"
          style={{ background: C.card, border: `1px solid ${C.borderGold}` }}
        >
          <img
            src="/images/logo-gold-cropped.png"
            alt="Studio Ludmila Ribeiro"
            className="mx-auto h-12 w-auto object-contain mb-6"
          />

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-3" style={{ background: 'rgba(171, 132, 69, 0.1)', color: C.gold }}>
            <ShieldCheck size={24} />
          </div>

          <h1 className="gb-display text-2xl font-medium" style={{ color: C.text }}>
            Área Administrativa
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: C.textDim }}>
            Acesso Restrito ao Salão
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha de acesso"
                className="gb-field text-center tracking-widest font-mono text-sm"
                autoFocus
              />
              {passwordError && (
                <p className="mt-2 text-xs" style={{ color: '#D9534F' }}>
                  Senha incorreta. Verifique e tente novamente.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-full py-3.5 font-mono text-[10px] uppercase tracking-[.16em] font-medium shadow-sm transition-all"
              style={{ background: C.gold, color: '#FFFFFF' }}
            >
              Acessar Painel
            </button>
          </form>

          <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <Link href="/" className="text-xs font-mono uppercase tracking-wider text-[#6E665E] hover:text-[#ab8445]">
              ← Voltar ao Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Topo do Painel */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md transition-all shadow-sm"
        style={{ background: 'rgba(250, 248, 245, 0.96)', borderBottom: `1px solid ${C.border}` }}
      >
        <div className="gb-shell flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img
                src="/images/logo-gold-cropped.png"
                alt="Studio Ludmila Ribeiro"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </Link>
            <span className="hidden sm:inline-block w-px h-6" style={{ background: C.border }} />
            <div className="hidden sm:block">
              <p className="font-serif text-sm font-semibold" style={{ color: C.text }}>
                Agenda & Controle de Clientes
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: C.gold }}>
                Painel Administrativo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">


            <button
              type="button"
              onClick={openNewModal}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider font-semibold shadow-sm transition-all"
              style={{ background: C.gold, color: '#FFFFFF' }}
            >
              <Plus size={14} /> <span>Novo Horário</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-full p-2 text-xs transition-colors hover:text-red-600"
              style={{ color: C.textDim }}
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="gb-shell py-8 md:py-12">
        {/* Seletor de Abas: Agenda vs Gerenciador de Fotos */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('agenda')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'agenda'
                  ? 'shadow-md text-white'
                  : 'text-gray-600 hover:text-black bg-white border border-gray-200'
              }`}
              style={{ background: activeTab === 'agenda' ? C.gold : undefined }}
            >
              <Calendar size={14} /> Agenda & Clientes ({total})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fotos')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'fotos'
                  ? 'shadow-md text-white'
                  : 'text-gray-600 hover:text-black bg-white border border-gray-200'
              }`}
              style={{ background: activeTab === 'fotos' ? C.gold : undefined }}
            >
              <ImageIcon size={14} /> Trocar Fotos do Site
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('personalizacao')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'personalizacao'
                  ? 'shadow-md text-white'
                  : 'text-gray-600 hover:text-black bg-white border border-gray-200'
              }`}
              style={{ background: activeTab === 'personalizacao' ? C.gold : undefined }}
            >
              <Palette size={14} /> Textos, Cores &amp; Horários
            </button>
          </div>

          {activeTab === 'agenda' && (
            <button
              type="button"
              onClick={openNewModal}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold shadow-sm transition-all text-white"
              style={{ background: C.gold }}
            >
              <Plus size={14} /> Cadastrar Agendamento Manual
            </button>
          )}
        </div>

        {/* Feedback de sucesso ao trocar fotos */}
        {photoMessage && (
          <div className="mb-6 flex items-center justify-between rounded-2xl p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{photoMessage}</span>
            </div>
            <button type="button" onClick={() => setPhotoMessage(null)} className="text-emerald-600 hover:text-emerald-900">
              <X size={15} />
            </button>
          </div>
        )}

        {/* ABA 1: AGENDA & CONTROLE DE CLIENTES */}
        {activeTab === 'agenda' && (
          <div>
            {/* Painel Colapsável de Configuração Supabase */}
            {showConfig && (
              <div className="mb-8 rounded-2xl p-6 shadow-sm" style={{ background: C.card, border: `1px solid ${C.borderGold}` }}>
                <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div className="flex items-center gap-2">
                    <Database size={16} style={{ color: C.gold }} />
                    <h3 className="font-serif text-base font-semibold" style={{ color: C.text }}>
                      Configuração de Banco de Dados (Supabase)
                    </h3>
                  </div>
                  <button type="button" onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>

                <p className="mt-3 text-xs leading-relaxed" style={{ color: C.textMuted }}>
                  As reservas já são salvas e sincronizadas instantaneamente no navegador para não haver conflito de horários.
                  Para sincronizar com sua nuvem Supabase, insira abaixo o <strong>Project URL</strong> fornecido no seu painel Supabase (ex: <code className="text-[#ab8445]">https://exemplo.supabase.co</code>).
                </p>

                <form onSubmit={handleSaveSupabaseConfig} className="mt-4 flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://seu-projeto.supabase.co"
                    className="gb-field flex-1 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-full px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold"
                    style={{ background: C.gold, color: '#FFFFFF' }}
                  >
                    Salvar URL
                  </button>
                </form>

                <div className="mt-4 pt-3 flex flex-wrap gap-4 text-[11px] font-mono" style={{ color: C.textDim }}>
                  <span>Publishable Key: <strong className="text-gray-700">{SUPABASE_KEYS.publishable.slice(0, 18)}...</strong> (Configurada)</span>
                  <span>Secret Key: <strong className="text-gray-700">{SUPABASE_KEYS.secret.slice(0, 14)}...</strong> (Configurada)</span>
                  {configSaved && <span className="text-green-600 font-semibold">✓ Configurações salvas!</span>}
                </div>
              </div>
            )}

            {/* Cards de Métricas */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
              <div className="rounded-2xl p-5 shadow-sm" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: C.textDim }}>Total do Site</p>
                <p className="font-serif text-3xl font-bold mt-1" style={{ color: C.text }}>{total}</p>
                <p className="text-[10px] text-[#6E665E] mt-0.5">Reservas registradas</p>
              </div>

              <div className="rounded-2xl p-5 shadow-sm" style={{ background: C.card, border: `1px solid ${C.borderGold}` }}>
                <p className="font-mono text-[9px] uppercase tracking-widest font-semibold" style={{ color: C.gold }}>
                  Pendentes de Confirmação
                </p>
                <p className="font-serif text-3xl font-bold mt-1" style={{ color: C.gold }}>{pendentes}</p>
                <p className="text-[10px] text-[#6E665E] mt-0.5">Aguardando salão confirmar</p>
              </div>

              <div className="rounded-2xl p-5 shadow-sm" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <p className="font-mono text-[9px] uppercase tracking-widest text-green-700">Confirmados</p>
                <p className="font-serif text-3xl font-bold mt-1 text-green-800">{confirmados}</p>
                <p className="text-[10px] text-[#6E665E] mt-0.5">Horários garantidos</p>
              </div>

              <div className="rounded-2xl p-5 shadow-sm" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: C.textDim }}>Agendamentos Hoje</p>
                <p className="font-serif text-3xl font-bold mt-1" style={{ color: C.text }}>{hojeCount}</p>
                <p className="text-[10px] text-[#6E665E] mt-0.5">Para a data de hoje</p>
              </div>
            </div>

            {/* Barra de Filtros & Busca */}
            <div className="rounded-2xl p-4 md:p-6 mb-8 shadow-sm" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_auto]">
                {/* Campo de Busca */}
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3.5" style={{ color: C.textDim }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por cliente, WhatsApp ou serviço..."
                    className="gb-field pl-10 text-xs"
                  />
                </div>

                {/* Filtro de Status */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="gb-field text-xs"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="pendente">Apenas Pendentes ({pendentes})</option>
                    <option value="confirmado">Apenas Confirmados ({confirmados})</option>
                    <option value="cancelado">Cancelados</option>
                  </select>
                </div>

                {/* Filtro por Data */}
                <div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="gb-field text-xs"
                  />
                </div>

                {/* Limpar Filtros */}
                {(search || statusFilter !== 'todos' || dateFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('todos');
                      setDateFilter('');
                    }}
                    className="rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-gray-500 hover:text-black border border-gray-200"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Agendamentos */}
            {loading ? (
              <div className="py-20 text-center font-mono text-xs" style={{ color: C.textDim }}>
                <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-[#ab8445]" />
                Carregando agenda...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="rounded-3xl p-12 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <Calendar size={36} className="mx-auto mb-3" style={{ color: C.gold }} />
                <h3 className="font-serif text-xl font-medium" style={{ color: C.text }}>
                  Nenhum agendamento encontrado
                </h3>
                <p className="mt-1 text-xs" style={{ color: C.textMuted }}>
                  Quando as clientes realizarem reservas pelo site, elas aparecerão listadas aqui para confirmação.
                </p>
                <button
                  type="button"
                  onClick={openNewModal}
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold shadow-sm"
                  style={{ background: C.gold, color: '#FFFFFF' }}
                >
                  <Plus size={14} /> Cadastrar Agendamento Manual
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => {
                  const isPendente = b.status === 'pendente';
                  const isConfirmado = b.status === 'confirmado';

                  const cleanWhatsapp = b.whatsapp.replace(/\D/g, '');
                  const waLink = `https://wa.me/55${cleanWhatsapp}?text=${encodeURIComponent(
                    `Olá ${b.name}! Aqui é do Studio Ludmila Ribeiro. ` +
                    `Recebemos seu agendamento no site para ${b.date.split('-').reverse().join('/')} às ${b.time}. ` +
                    `Procedimentos: ${b.services.join(', ')}. ` +
                    `Seu horário está confirmado! Te esperamos com todo o carinho.`
                  )}`;

                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl p-5 md:p-6 transition-all shadow-sm"
                      style={{
                        background: C.card,
                        border: isPendente
                          ? `1.5px solid ${C.gold}`
                          : isConfirmado
                          ? '1px solid #C8E6C9'
                          : `1px solid ${C.border}`,
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Informações da Cliente & Horário */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${
                                isPendente
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : isConfirmado
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {b.status}
                            </span>

                            <span className="flex items-center gap-1 font-mono text-xs font-semibold" style={{ color: C.gold }}>
                              <Clock3 size={13} /> {b.date.split('-').reverse().join('/')} às {b.time}
                            </span>

                            <span className="font-mono text-[10px] text-gray-400">
                              · Pagamento: <strong>{b.paymentMethod.toUpperCase()}</strong>
                            </span>
                          </div>

                          <h4 className="font-serif text-lg font-medium" style={{ color: C.text }}>
                            {b.name}
                          </h4>

                          <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: C.textMuted }}>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                            >
                              <Phone size={13} /> {b.whatsapp}
                            </a>

                            <span>· Serviços: <strong>{b.services.join(', ')}</strong></span>

                            {b.estimatedTotal && (
                              <span className="font-semibold" style={{ color: C.gold }}>
                                · Est.: R$ {b.estimatedTotal},00
                              </span>
                            )}
                          </div>

                          {b.observations && (
                            <p className="mt-1 text-xs italic text-gray-500">
                              Obs: "{b.observations}"
                            </p>
                          )}
                        </div>

                        {/* Ações Rápidas do Salão */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                          {isPendente && (
                            <button
                              type="button"
                              onClick={() => updateStatus(b, 'confirmado')}
                              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-wider font-semibold shadow-sm transition-all text-white"
                              style={{ background: '#2E7D32' }}
                              title="Confirmar Agendamento"
                            >
                              <Check size={13} /> Confirmar
                            </button>
                          )}

                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-[9px] uppercase tracking-wider font-semibold transition-all"
                            style={{ border: '1px solid #25D366', color: '#1B8B44', background: '#F0FDF4' }}
                            title="Enviar WhatsApp de Confirmação"
                          >
                            <MessageCircle size={13} /> WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={() => openEditModal(b)}
                            className="rounded-full p-2 text-gray-500 hover:text-black border border-gray-200"
                            title="Editar Agendamento"
                          >
                            <Edit2 size={13} />
                          </button>

                          {b.status !== 'cancelado' && (
                            <button
                              type="button"
                              onClick={() => updateStatus(b, 'cancelado')}
                              className="rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-amber-700 hover:bg-amber-50 border border-amber-200"
                              title="Marcar como Cancelado"
                            >
                              Cancelar
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(b.id)}
                            className="rounded-full p-2 text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50"
                            title="Excluir"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ABA 2: GERENCIADOR DE FOTOS & GALERIA DO SITE */}
        {activeTab === 'fotos' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Box Explicativo com Orientações */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm" style={{ background: C.card, border: `1px solid ${C.borderGold}` }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} style={{ color: C.gold }} />
                    <h2 className="font-serif text-xl md:text-2xl font-semibold" style={{ color: C.text }}>
                      Gerenciador de Fotos do Site
                    </h2>
                  </div>
                  <p className="mt-2 text-xs md:text-sm leading-relaxed max-w-2xl" style={{ color: C.textMuted }}>
                    Altere as fotos do site de forma simples e independente. Você pode enviar fotos diretamente de <strong>qualquer celular (galeria ou câmera)</strong> ou do seu computador. Formatos aceitos: <strong>qualquer formato de imagem ou foto (PNG, JPG, JPEG, WEBP, SVG, GIF, etc.)</strong>. As alterações são aplicadas instantaneamente em todo o site.
                  </p>
                </div>

                <div className="rounded-2xl p-4 text-xs font-mono" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <p className="font-semibold" style={{ color: C.gold }}>✦ Suporte a Qualquer Dispositivo</p>
                  <p className="text-[11px] text-gray-500 mt-1">Fotos pesadas são otimizadas automaticamente com máxima nitidez.</p>
                </div>
              </div>

              {/* Filtro de Seções */}
              <div className="mt-6 pt-5 flex flex-wrap gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
                {[
                  { id: 'todas', label: 'Todas as Fotos' },
                  { id: 'Identidade Visual & Cabeçalho', label: 'Logos & Marca' },
                  { id: 'Página Inicial (Início / Hero)', label: 'Hero (Abertura)' },
                  { id: 'Página Inicial (Seção "O Studio")', label: 'Seção O Studio' },
                  { id: 'Página de Cursos Profissionais (/cursos)', label: 'Página de Cursos' },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setPhotoSectionFilter(sec.id)}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
                      photoSectionFilter === sec.id
                        ? 'shadow-sm text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ background: photoSectionFilter === sec.id ? C.gold : undefined }}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SEÇÃO ESPECIAL: CARROSSEL DINÂMICO DA SEÇÃO "O STUDIO" (SEM LIMITE DE FOTOS) */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm space-y-6" style={{ background: C.card, border: `1.5px solid ${C.borderGold}` }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: C.border }}>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} style={{ color: C.gold }} />
                    <h3 className="font-serif text-lg md:text-xl font-semibold" style={{ color: C.text }}>
                      Carrossel da Seção "O Studio" ({aboutGallery.length} fotos ativas)
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-[#6E665E] leading-relaxed max-w-2xl">
                    Adicione fotos <strong>sem limite de quantidade</strong> diretamente do seu celular ou PC. Na página inicial, o carrossel avança suavemente para o lado a <strong>cada 3 segundos em looping infinito</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetGallery}
                  className="rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-100 transition-all shrink-0 self-start md:self-auto"
                >
                  <RotateCcw size={13} className="inline mr-1" /> Restaurar Padrão
                </button>
              </div>

              {/* Box para Adicionar Nova Foto */}
              <div className="rounded-2xl p-5 border flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: C.bg, borderColor: C.borderGold }}>
                <div className="w-full md:w-auto flex-1">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Legenda da Foto (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newGalleryCaption}
                    onChange={(e) => setNewGalleryCaption(e.target.value)}
                    placeholder="Ex: Atendimento de unhas em gel, biossegurança..."
                    className="gb-field text-xs bg-white"
                  />
                </div>

                <div className="w-full md:w-auto shrink-0 pt-2 md:pt-4">
                  <input
                    id="upload-carousel-file"
                    type="file"
                    accept="image/*, .png, .jpg, .jpeg, .webp, .svg, .gif, .avif, .ico, .bmp, .heic, .heif"
                    className="sr-only"
                    disabled={uploadingCarousel}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddGalleryImage(file);
                      e.target.value = '';
                    }}
                  />
                  <label
                    htmlFor="upload-carousel-file"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-wider font-semibold cursor-pointer text-white shadow-md transition-all hover:scale-[1.02] w-full md:w-auto text-center"
                    style={{ background: C.gold }}
                  >
                    {uploadingCarousel ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Processando Foto...
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> + Adicionar Nova Foto ao Carrossel
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Grid das Fotos Atuais do Carrossel */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                  Fotos Atualmente no Carrossel (Passam a cada 3s):
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {aboutGallery.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group relative rounded-2xl overflow-hidden border shadow-sm bg-white flex flex-col justify-between"
                      style={{ borderColor: C.border }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={item.url}
                          alt={item.caption}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/70 text-white backdrop-blur-xs">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="p-2.5 flex items-center justify-between gap-1.5 border-t" style={{ borderColor: C.border }}>
                        <p className="text-[10px] text-gray-600 truncate flex-1 font-sans" title={item.caption}>
                          {item.caption || `Foto #${idx + 1}`}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(item.id)}
                          className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors shrink-0"
                          title="Excluir foto do carrossel"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid de Fotos por Seção */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SITE_IMAGES_REGISTRY.filter(
                (item) => photoSectionFilter === 'todas' || item.section === photoSectionFilter
              ).map((item) => {
                const currentSrc = getCustomImage(item.key, item.defaultSrc);
                const isCustom = currentSrc !== item.defaultSrc;
                const isUploading = uploadingKey === item.key;
                const inputId = `file-upload-${item.key}`;

                return (
                  <div
                    key={item.key}
                    className="flex flex-col justify-between rounded-3xl p-6 shadow-sm transition-all hover:shadow-md"
                    style={{ background: C.card, border: `1px solid ${isCustom ? C.gold : C.border}` }}
                  >
                    <div>
                      {/* Cabeçalho do Card */}
                      <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b" style={{ borderColor: C.border }}>
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider font-semibold" style={{ color: C.gold }}>
                            {item.section}
                          </span>
                          <h3 className="font-serif text-base font-semibold mt-0.5" style={{ color: C.text }}>
                            {item.label}
                          </h3>
                        </div>

                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider font-semibold shrink-0 ${
                            isCustom
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {isCustom ? 'Personalizada' : 'Padrão'}
                        </span>
                      </div>

                      {/* Onde aparece no site */}
                      <p className="text-xs leading-relaxed text-[#6E665E] mb-4">
                        <strong className="text-gray-900">Onde aparece:</strong> {item.description}
                      </p>

                      {/* Preview da Imagem */}
                      <div
                        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 flex items-center justify-center shadow-inner"
                        style={{
                          background: item.key.includes('white') ? '#ab8445' : '#F5EFE6',
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {currentSrc ? (
                          <img
                            src={currentSrc}
                            alt={item.label}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center shadow-inner"
                              style={{ background: '#FAF8F5', border: '2px dashed #ab8445' }}
                            >
                              <ImageIcon size={24} style={{ color: '#ab8445' }} />
                            </div>
                            <span className="text-[11px] font-sans font-medium text-gray-500">
                              Ícone padrão do site ativo
                            </span>
                            <span className="text-[9px] font-mono text-gray-400">
                              (Clique abaixo para subir qualquer foto ou ícone)
                            </span>
                          </div>
                        )}

                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-mono gap-2">
                            <RefreshCw size={24} className="animate-spin text-[#ab8445]" />
                            <span>Processando foto...</span>
                          </div>
                        )}
                      </div>

                      {/* Orientação técnica de proporção */}
                      <p className="font-mono text-[9px] text-[#9E958A] mb-4">
                        📐 {item.recommendedRatio}
                      </p>
                    </div>

                    {/* Botões de Ação */}
                    <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2" style={{ borderColor: C.border }}>
                      {/* Input file invisível */}
                      <input
                        id={inputId}
                        type="file"
                        accept="image/*, .png, .jpg, .jpeg, .webp, .svg, .gif, .avif, .ico, .bmp, .heic, .heif"
                        className="sr-only"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(item.key, file);
                          }
                          e.target.value = '';
                        }}
                      />

                      <label
                        htmlFor={inputId}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 px-4 font-mono text-[10px] uppercase tracking-wider font-semibold cursor-pointer shadow-sm transition-all text-white text-center"
                        style={{ background: C.gold }}
                      >
                        <Upload size={13} /> Subir Nova Foto
                      </label>

                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleResetImage(item.key)}
                          className="rounded-full p-2.5 text-gray-500 hover:text-black hover:bg-gray-100 border border-gray-200 transition-colors"
                          title="Restaurar foto padrão original"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ABA 3: TEXTOS, CORES DO RODAPÉ, HORÁRIOS & PERSONALIZAÇÃO COMPLETA */}
        {activeTab === 'personalizacao' && (
          <form onSubmit={handleSaveSiteContent} className="space-y-8 animate-in fade-in duration-200">
            {/* Box Explicativo com Botões Principais de Salvar */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm" style={{ background: C.card, border: `1px solid ${C.borderGold}` }}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sliders size={20} style={{ color: C.gold }} />
                    <h2 className="font-serif text-xl md:text-2xl font-semibold" style={{ color: C.text }}>
                      Personalização de Textos, Cores &amp; Horários
                    </h2>
                  </div>
                  <p className="mt-2 text-xs md:text-sm leading-relaxed max-w-2xl" style={{ color: C.textMuted }}>
                    Edite livremente as cores do rodapé, os horários e vagas de atendimento, os textos de abertura (hero), frases sobre o salão, dados de contato e chave Pix. Todas as alterações são salvas e refletidas instantaneamente no site.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetSiteContent}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
                  >
                    <RotateCcw size={13} /> Restaurar Padrão
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-mono text-[11px] uppercase tracking-[.14em] font-semibold text-white shadow-md transition-all hover:scale-[1.02]"
                    style={{ background: C.gold }}
                  >
                    <Save size={14} /> Salvar Alterações
                  </button>
                </div>
              </div>

              {contentSaveSuccess && (
                <div className="mt-5 flex items-center justify-between rounded-2xl p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>✦ Todas as alterações foram salvas com sucesso e já estão ativas no site!</span>
                  </div>
                  <button type="button" onClick={() => setContentSaveSuccess(false)} className="text-emerald-600 hover:text-emerald-900">
                    <X size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* SEÇÃO ESPECIAL: DIVISÃO CURVADA DOURADA DO TOPO (HERO) */}
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
                    {siteForm.heroShapeEnabled ? '✦ Fundo Curvado Ativo' : '○ Removido (Todo Branco)'}
                  </span>
                  <input
                    type="checkbox"
                    checked={siteForm.heroShapeEnabled !== false && siteForm.heroShapeType !== 'nenhum'}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setSiteForm((prev) => ({
                        ...prev,
                        heroShapeEnabled: enabled,
                        heroShapeType: enabled ? (prev.heroShapeType === 'nenhum' ? 'curva-organica' : prev.heroShapeType) : 'nenhum',
                      }));
                    }}
                    className="h-4 w-4 rounded accent-[#ab8445] cursor-pointer"
                  />
                </label>
              </div>

              {siteForm.heroShapeEnabled !== false && siteForm.heroShapeType !== 'nenhum' && (
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
                          onClick={() => setSiteForm((prev) => ({ ...prev, heroShapeType: shape.id as any }))}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            siteForm.heroShapeType === shape.id
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
                          value={siteForm.heroShapeColor1 || '#d4b27c'}
                          onChange={(e) => setSiteForm((prev) => ({ ...prev, heroShapeColor1: e.target.value }))}
                          className="h-10 w-12 rounded-xl cursor-pointer border border-gray-200 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={siteForm.heroShapeColor1 || '#d4b27c'}
                          onChange={(e) => setSiteForm((prev) => ({ ...prev, heroShapeColor1: e.target.value }))}
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
                          value={siteForm.heroShapeColor2 || '#ab8445'}
                          onChange={(e) => setSiteForm((prev) => ({ ...prev, heroShapeColor2: e.target.value }))}
                          className="h-10 w-12 rounded-xl cursor-pointer border border-gray-200 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={siteForm.heroShapeColor2 || '#ab8445'}
                          onChange={(e) => setSiteForm((prev) => ({ ...prev, heroShapeColor2: e.target.value }))}
                          className="gb-field font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                        Intensidade / Opacidade ({siteForm.heroShapeOpacity ?? 95}%)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={siteForm.heroShapeOpacity ?? 95}
                        onChange={(e) => setSiteForm((prev) => ({ ...prev, heroShapeOpacity: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ab8445] mt-3"
                      />
                    </div>
                  </div>

                  {/* Prévia do Degradê */}
                  <div
                    className="h-12 w-full rounded-2xl flex items-center justify-between px-4 text-xs font-mono font-bold text-white shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, ${siteForm.heroShapeColor1 || '#d4b27c'} 0%, ${siteForm.heroShapeColor2 || '#ab8445'} 100%)`,
                      opacity: (siteForm.heroShapeOpacity ?? 95) / 100,
                    }}
                  >
                    <span>✦ Prévia da Cor da Divisão Curvada</span>
                    <span>{siteForm.heroShapeColor1 || '#d4b27c'} → {siteForm.heroShapeColor2 || '#ab8445'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* SEÇÃO 1: CORES DO RODAPÉ (FOOTER) */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm space-y-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2.5">
                  <Palette size={18} style={{ color: C.gold }} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold" style={{ color: C.text }}>
                      Cores do Rodapé (Footer)
                    </h3>
                    <p className="text-xs text-[#6E665E]">
                      Escolha a cor de fundo e a cor do texto para o rodapé do salão.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controles de Cor */}
                <div className="space-y-5">
                  {/* Cor de Fundo */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">
                      Cor de Fundo do Rodapé
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={siteForm.footerBg}
                        onChange={(e) => setSiteForm({ ...siteForm, footerBg: e.target.value })}
                        className="h-10 w-14 rounded-xl border border-gray-300 cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={siteForm.footerBg}
                        onChange={(e) => setSiteForm({ ...siteForm, footerBg: e.target.value })}
                        className="gb-field text-xs font-mono max-w-[140px]"
                        placeholder="#ab8445"
                      />
                    </div>
                    {/* Paleta Rápida */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Sugestões:</span>
                      {[
                        { label: 'Ouro Studio', hex: '#ab8445' },
                        { label: 'Dourado Suave', hex: '#c59e5f' },
                        { label: 'Café Nobre', hex: '#26201b' },
                        { label: 'Noite Escura', hex: '#181513' },
                        { label: 'Chocolate', hex: '#3c2b20' },
                        { label: 'Off-White', hex: '#faf8f5' },
                      ].map((p) => (
                        <button
                          key={p.hex}
                          type="button"
                          onClick={() => setSiteForm({ ...siteForm, footerBg: p.hex })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-sans hover:shadow-xs transition-all"
                          style={{
                            borderColor: siteForm.footerBg === p.hex ? C.gold : C.border,
                            background: siteForm.footerBg === p.hex ? '#FDFBF7' : '#FFFFFF',
                          }}
                        >
                          <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ background: p.hex }} />
                          <span style={{ color: C.text }}>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cor do Texto & Ícones */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">
                      Cor do Texto &amp; Ícones do Rodapé
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={siteForm.footerTextColor}
                        onChange={(e) => setSiteForm({ ...siteForm, footerTextColor: e.target.value })}
                        className="h-10 w-14 rounded-xl border border-gray-300 cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={siteForm.footerTextColor}
                        onChange={(e) => setSiteForm({ ...siteForm, footerTextColor: e.target.value })}
                        className="gb-field text-xs font-mono max-w-[140px]"
                        placeholder="#FFFFFF"
                      />
                    </div>
                    {/* Paleta Rápida de Texto */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Sugestões:</span>
                      {[
                        { label: 'Branco Puro', hex: '#FFFFFF' },
                        { label: 'Off-White Nobre', hex: '#FAF8F5' },
                        { label: 'Dourado Suave', hex: '#EFE6D6' },
                        { label: 'Preto / Escuro', hex: '#221D19' },
                      ].map((p) => (
                        <button
                          key={p.hex}
                          type="button"
                          onClick={() => setSiteForm({ ...siteForm, footerTextColor: p.hex })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-sans hover:shadow-xs transition-all"
                          style={{
                            borderColor: siteForm.footerTextColor === p.hex ? C.gold : C.border,
                            background: siteForm.footerTextColor === p.hex ? '#FDFBF7' : '#FFFFFF',
                          }}
                        >
                          <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ background: p.hex }} />
                          <span style={{ color: C.text }}>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview do Rodapé */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">
                    Pré-visualização em Tempo Real do Rodapé
                  </label>
                  <div
                    className="rounded-2xl p-6 shadow-md transition-colors duration-300 flex flex-col justify-between min-h-[190px]"
                    style={{
                      background: siteForm.footerBg,
                      color: siteForm.footerTextColor,
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <img
                          src={getCustomImage('logo_white', '/images/logo-white-cropped.png')}
                          alt="Logo Preview"
                          className="h-10 w-auto object-contain filter drop-shadow-xs"
                        />
                        <span className="font-mono text-[9px] uppercase tracking-widest opacity-80 border border-current/30 px-2.5 py-0.5 rounded-full">
                          Preview Rodapé
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed opacity-90 max-w-sm">
                        {siteForm.footerDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-current/20 flex flex-wrap items-center justify-between gap-2 text-[11px] opacity-90">
                      <span>✦ {siteForm.hours}</span>
                      <span>✦ {siteForm.whatsappLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: HORÁRIOS DO SALÃO & VAGAS DE AGENDAMENTO */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm space-y-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2.5">
                  <Clock3 size={18} style={{ color: C.gold }} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold" style={{ color: C.text }}>
                      Horários de Atendimento &amp; Slots para Agendamento
                    </h3>
                    <p className="text-xs text-[#6E665E]">
                      Configure os horários exibidos no site e os slots livres para as clientes escolherem.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Texto Geral de Horários */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Texto de Horário de Atendimento (Exibido no Cabeçalho, Sobre e Rodapé)
                  </label>
                  <input
                    type="text"
                    value={siteForm.hours}
                    onChange={(e) => setSiteForm({ ...siteForm, hours: e.target.value })}
                    className="gb-field text-xs"
                    placeholder="Seg–Sex: 08h–17h · Sábado: 08h–15h"
                  />
                  <p className="mt-1 text-[11px] text-gray-400 font-sans">
                    Exemplo: <span className="text-gray-600 font-mono">Seg–Sex: 08h–17h · Sábado: 08h–15h</span>
                  </p>
                </div>

                {/* Slots Disponíveis */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                    Horários Disponíveis no Formulário de Agendamento ({siteForm.bookingTimeSlots.length} horários ativos)
                  </label>

                  <div className="flex flex-wrap gap-2 p-4 rounded-2xl border" style={{ borderColor: C.border, background: C.bg }}>
                    {siteForm.bookingTimeSlots.map((slot) => (
                      <span
                        key={slot}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-semibold shadow-xs transition-all"
                        style={{ background: '#FFFFFF', border: `1px solid ${C.borderGold}`, color: C.text }}
                      >
                        <Clock3 size={11} style={{ color: C.gold }} />
                        {slot}
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot)}
                          className="rounded-full p-0.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-0.5"
                          title={`Remover horário ${slot}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Adicionar Horário */}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={newSlotInput}
                      onChange={(e) => setNewSlotInput(e.target.value)}
                      placeholder="Ex: 14:00 ou 18:30"
                      className="gb-field text-xs font-mono max-w-[180px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSlot();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider font-semibold shadow-sm transition-all text-white"
                      style={{ background: C.gold }}
                    >
                      <Plus size={13} /> Adicionar Horário
                    </button>
                    <span className="text-[11px] text-gray-400">
                      Pressione Enter ou clique em Adicionar para incluir na lista.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: LOGOS DA HERO E DO RODAPÉ */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm space-y-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2.5">
                  <Sparkles size={18} style={{ color: C.gold }} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold" style={{ color: C.text }}>
                      Logotipos Oficiais (Hero &amp; Rodapé)
                    </h3>
                    <p className="text-xs text-[#6E665E]">
                      Suba seus arquivos de logotipo em alta resolução para atualização imediata.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Dourada (Hero e Header) */}
                <div className="rounded-2xl p-5 border flex flex-col justify-between" style={{ borderColor: C.border, background: C.bg }}>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider font-semibold" style={{ color: C.gold }}>
                      Identidade Visual Clara
                    </span>
                    <h4 className="font-serif text-base font-semibold mt-0.5" style={{ color: C.text }}>
                      Logotipo Dourado (Header &amp; Hero)
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                      Utilizada sobre os fundos claros do site (cabeçalho, início e páginas). Formato ideal: PNG transparente.
                    </p>

                    <div className="w-full h-24 rounded-xl flex items-center justify-center p-3 mb-4 border bg-white" style={{ borderColor: C.border }}>
                      <img
                        src={getCustomImage('logo_gold', '/images/logo-gold-cropped.png')}
                        alt="Logo Dourada"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: C.border }}>
                    <input
                      id="upload-logo-gold-tab3"
                      type="file"
                      accept="image/*, .png, .jpg, .jpeg, .webp, .svg, .gif, .avif, .ico, .bmp, .heic, .heif"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('logo_gold', file);
                        e.target.value = '';
                      }}
                    />
                    <label
                      htmlFor="upload-logo-gold-tab3"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full py-2 px-3 font-mono text-[10px] uppercase tracking-wider font-semibold cursor-pointer text-white shadow-xs text-center"
                      style={{ background: C.gold }}
                    >
                      <Upload size={12} /> Trocar Logo Dourada
                    </label>
                    {getCustomImage('logo_gold', '/images/logo-gold-cropped.png') !== '/images/logo-gold-cropped.png' && (
                      <button
                        type="button"
                        onClick={() => handleResetImage('logo_gold')}
                        className="rounded-full p-2 text-gray-500 hover:text-black border border-gray-200"
                        title="Restaurar logo padrão"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Logo Branca (Rodapé) */}
                <div className="rounded-2xl p-5 border flex flex-col justify-between" style={{ borderColor: C.border, background: C.bg }}>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider font-semibold" style={{ color: C.gold }}>
                      Identidade Visual Escura
                    </span>
                    <h4 className="font-serif text-base font-semibold mt-0.5" style={{ color: C.text }}>
                      Logotipo Branco (Rodapé / Footer)
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                      Utilizada sobre o fundo do rodapé. Formato ideal: PNG transparente com letras claras.
                    </p>

                    <div
                      className="w-full h-24 rounded-xl flex items-center justify-center p-3 mb-4 shadow-inner"
                      style={{ background: siteForm.footerBg }}
                    >
                      <img
                        src={getCustomImage('logo_white', '/images/logo-white-cropped.png')}
                        alt="Logo Branca"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: C.border }}>
                    <input
                      id="upload-logo-white-tab3"
                      type="file"
                      accept="image/*, .png, .jpg, .jpeg, .webp, .svg, .gif, .avif, .ico, .bmp, .heic, .heif"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload('logo_white', file);
                        e.target.value = '';
                      }}
                    />
                    <label
                      htmlFor="upload-logo-white-tab3"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full py-2 px-3 font-mono text-[10px] uppercase tracking-wider font-semibold cursor-pointer text-white shadow-xs text-center"
                      style={{ background: C.gold }}
                    >
                      <Upload size={12} /> Trocar Logo Branca
                    </label>
                    {getCustomImage('logo_white', '/images/logo-white-cropped.png') !== '/images/logo-white-cropped.png' && (
                      <button
                        type="button"
                        onClick={() => handleResetImage('logo_white')}
                        className="rounded-full p-2 text-gray-500 hover:text-black border border-gray-200"
                        title="Restaurar logo padrão"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: TEXTOS DA HERO & SOBRE O STUDIO */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm space-y-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2.5">
                  <Type size={18} style={{ color: C.gold }} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold" style={{ color: C.text }}>
                      Textos Principais (Hero &amp; Sobre o Studio)
                    </h3>
                    <p className="text-xs text-[#6E665E]">
                      Edite as manchetes, destaques e parágrafos institucionais do site.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Textos da Hero */}
                <div className="space-y-4 p-5 rounded-2xl border" style={{ borderColor: C.border, background: C.bg }}>
                  <h4 className="font-serif text-base font-semibold" style={{ color: C.gold }}>
                    ✦ Abertura da Página (Hero)
                  </h4>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Frase Principal (Parte 1)
                    </label>
                    <input
                      type="text"
                      value={siteForm.heroTitleLead}
                      onChange={(e) => setSiteForm({ ...siteForm, heroTitleLead: e.target.value })}
                      className="gb-field text-xs"
                      placeholder="A arte de realçar sua beleza com"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Frase em Destaque Dourado (Parte 2)
                    </label>
                    <input
                      type="text"
                      value={siteForm.heroTitleHighlight}
                      onChange={(e) => setSiteForm({ ...siteForm, heroTitleHighlight: e.target.value })}
                      className="gb-field text-xs font-serif"
                      placeholder="precisão & sofisticação."
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Subtítulo / Tagline da Hero
                    </label>
                    <textarea
                      value={siteForm.heroTagline}
                      onChange={(e) => setSiteForm({ ...siteForm, heroTagline: e.target.value })}
                      className="gb-field text-xs min-h-[70px] resize-y"
                      placeholder="Atendimento humanizado, técnicas modernas e um ambiente acolhedor..."
                    />
                  </div>
                </div>

                {/* Textos da Seção Sobre */}
                <div className="space-y-4 p-5 rounded-2xl border" style={{ borderColor: C.border, background: C.bg }}>
                  <h4 className="font-serif text-base font-semibold" style={{ color: C.gold }}>
                    ✦ Seção "O Espaço &amp; Excelência"
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={siteForm.aboutTitle}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutTitle: e.target.value })}
                        className="gb-field text-xs"
                        placeholder="Um espaço criado para o seu"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                        Destaque em Itálico
                      </label>
                      <input
                        type="text"
                        value={siteForm.aboutTitleHighlight}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutTitleHighlight: e.target.value })}
                        className="gb-field text-xs font-serif italic"
                        placeholder="momento de cuidado."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Primeiro Parágrafo Institucional
                    </label>
                    <textarea
                      value={siteForm.aboutParagraph1}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutParagraph1: e.target.value })}
                      className="gb-field text-xs min-h-[65px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Segundo Parágrafo Institucional
                    </label>
                    <textarea
                      value={siteForm.aboutParagraph2}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutParagraph2: e.target.value })}
                      className="gb-field text-xs min-h-[65px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                      Frase de Rodapé do Sobre
                    </label>
                    <input
                      type="text"
                      value={siteForm.aboutFooterNote}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutFooterNote: e.target.value })}
                      className="gb-field text-xs"
                      placeholder="Tudo pensado nos mínimos detalhes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 5: CONTATOS, ENDEREÇO, REDES & CHAVE PIX */}
            <div className="rounded-3xl p-6 md:p-8 shadow-sm space-y-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2.5">
                  <CreditCard size={18} style={{ color: C.gold }} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold" style={{ color: C.text }}>
                      Contatos, Endereço, Redes Sociais &amp; Chave Pix
                    </h3>
                    <p className="text-xs text-[#6E665E]">
                      Dados oficiais utilizados para comunicação, rotas e pagamentos das clientes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    WhatsApp do Salão (Exibição)
                  </label>
                  <input
                    type="text"
                    value={siteForm.whatsappLabel}
                    onChange={(e) => setSiteForm({ ...siteForm, whatsappLabel: e.target.value })}
                    className="gb-field text-xs"
                    placeholder="(66) 99200-8906"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    WhatsApp do Salão (Link wa.me - apenas dígitos)
                  </label>
                  <input
                    type="text"
                    value={siteForm.whatsappNumber}
                    onChange={(e) => setSiteForm({ ...siteForm, whatsappNumber: e.target.value })}
                    className="gb-field text-xs font-mono"
                    placeholder="5566992008906"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Chave PIX Oficial (CNPJ / Telefone / E-mail)
                  </label>
                  <input
                    type="text"
                    value={siteForm.pixKey}
                    onChange={(e) => setSiteForm({ ...siteForm, pixKey: e.target.value })}
                    className="gb-field text-xs font-mono font-semibold"
                    style={{ color: C.gold }}
                    placeholder="51660723000158"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    WhatsApp dos Cursos (Exibição)
                  </label>
                  <input
                    type="text"
                    value={siteForm.coursesWhatsappLabel}
                    onChange={(e) => setSiteForm({ ...siteForm, coursesWhatsappLabel: e.target.value })}
                    className="gb-field text-xs"
                    placeholder="(27) 99866-1708"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    WhatsApp dos Cursos (Link wa.me)
                  </label>
                  <input
                    type="text"
                    value={siteForm.coursesWhatsapp}
                    onChange={(e) => setSiteForm({ ...siteForm, coursesWhatsapp: e.target.value })}
                    className="gb-field text-xs font-mono"
                    placeholder="5527998661708"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Instagram do Salão
                  </label>
                  <input
                    type="text"
                    value={siteForm.instagramHandle}
                    onChange={(e) => setSiteForm({ ...siteForm, instagramHandle: e.target.value })}
                    className="gb-field text-xs"
                    placeholder="@studio.ludmilaribeiro"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Endereço Completo do Studio
                  </label>
                  <input
                    type="text"
                    value={siteForm.address}
                    onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                    className="gb-field text-xs"
                    placeholder="Av. Brasil, nº 484, Bom Jesus, Sorriso - MT (Interfone 01 · acima da Brasil Dourado)"
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Link do Google Maps
                  </label>
                  <input
                    type="url"
                    value={siteForm.mapsUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, mapsUrl: e.target.value })}
                    className="gb-field text-xs font-mono"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
              </div>
            </div>

            {/* Barra Inferior com Botão de Salvar em Destaque */}
            <div className="sticky bottom-6 z-30 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 border" style={{ background: C.card, borderColor: C.borderGold }}>
              <div className="flex items-center gap-2 text-xs font-medium" style={{ color: C.text }}>
                <CheckCircle2 size={16} style={{ color: C.gold }} />
                <span>Edições prontas para publicação imediata</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetSiteContent}
                  className="rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-wider border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
                >
                  Restaurar Padrão
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-2.5 font-mono text-[10px] uppercase tracking-[.14em] font-semibold text-white shadow-md transition-all hover:scale-[1.02]"
                  style={{ background: C.gold }}
                >
                  <Save size={14} /> Salvar Todas as Alterações
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
      {/* Modal de Criação / Edição */}
      {modalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl" style={{ background: C.card }}>
            <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
              <h3 className="font-serif text-lg font-semibold" style={{ color: C.text }}>
                {editingBooking.id.startsWith('adm-') ? 'Novo Agendamento Manual' : 'Editar Agendamento'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  Nome da Cliente
                </label>
                <input
                  required
                  type="text"
                  value={editingBooking.name}
                  onChange={(e) => setEditingBooking({ ...editingBooking, name: e.target.value })}
                  className="gb-field text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  WhatsApp
                </label>
                <input
                  required
                  type="text"
                  value={editingBooking.whatsapp}
                  onChange={(e) => setEditingBooking({ ...editingBooking, whatsapp: e.target.value })}
                  className="gb-field text-xs"
                  placeholder="(66) 99999-9999"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Data
                  </label>
                  <input
                    required
                    type="date"
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                    className="gb-field text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Horário
                  </label>
                  <select
                    value={editingBooking.time}
                    onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })}
                    className="gb-field text-xs"
                  >
                    {AVAILABLE_TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  Serviços (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={editingBooking.services.join(', ')}
                  onChange={(e) =>
                    setEditingBooking({
                      ...editingBooking,
                      services: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="gb-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={editingBooking.status}
                    onChange={(e: any) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                    className="gb-field text-xs"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={editingBooking.paymentMethod}
                    onChange={(e: any) => setEditingBooking({ ...editingBooking, paymentMethod: e.target.value })}
                    className="gb-field text-xs"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão</option>
                    <option value="presencial">No Salão</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  Observações
                </label>
                <textarea
                  value={editingBooking.observations || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, observations: e.target.value })}
                  className="gb-field text-xs min-h-[60px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-5 py-2 font-mono text-[10px] uppercase tracking-wider border border-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full px-6 py-2 font-mono text-[10px] uppercase tracking-wider font-semibold shadow-sm"
                  style={{ background: C.gold, color: '#FFFFFF' }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
