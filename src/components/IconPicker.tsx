'use client';

import React, { useState, useMemo } from 'react';
import { 
  // Hukum & Legal
  Scale, 
  Building2, 
  Building, 
  Landmark, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  FileText, 
  FileCheck, 
  FilePlus, 
  BookOpen, 
  Scroll, 
  Gavel, 
  Briefcase, 
  FileSpreadsheet,
  // Kontak & Komunikasi
  Phone, 
  PhoneCall, 
  PhoneForwarded, 
  Mail, 
  MessageCircle, 
  MessageSquare, 
  Send, 
  AtSign, 
  Headphones, 
  Bell, 
  Share2, 
  HelpCircle,
  // Bisnis, Pajak & Keuangan
  Receipt, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Coins, 
  Wallet, 
  Target, 
  Calculator, 
  Percent, 
  BadgePercent,
  // SDM & Tim
  Users, 
  User, 
  UserCheck, 
  UserPlus, 
  Heart, 
  Handshake, 
  UserCog, 
  Smile, 
  GraduationCap,
  // Navigasi & Aksi
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Search, 
  Check, 
  CheckCircle2, 
  Plus, 
  Compass, 
  MapPin, 
  Globe, 
  Home, 
  Navigation, 
  Link as LinkIcon,
  // Waktu & Kalender
  Calendar, 
  CalendarCheck, 
  Clock, 
  Hourglass, 
  Timer, 
  History,
  // Simbol, UI & Desain
  Sparkles, 
  Star, 
  Zap, 
  Sun, 
  Moon, 
  Flame, 
  Lock, 
  Unlock, 
  Settings, 
  Sliders, 
  Layout, 
  Layers, 
  Box, 
  CheckSquare, 
  Info, 
  AlertTriangle, 
  CircleDot, 
  CheckCircle, 
  Lightbulb,
  X,
  Palette
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ComponentType<any>> = {
  // Hukum & Legal
  Scale,
  Building2,
  Building,
  Landmark,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Award,
  FileText,
  FileCheck,
  FilePlus,
  BookOpen,
  Scroll,
  Gavel,
  Briefcase,
  FileSpreadsheet,
  // Kontak & Komunikasi
  Phone,
  PhoneCall,
  PhoneForwarded,
  Mail,
  MessageCircle,
  MessageSquare,
  Send,
  AtSign,
  Headphones,
  Bell,
  Share2,
  HelpCircle,
  // Bisnis & Finansial
  Receipt,
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
  PieChart,
  Coins,
  Wallet,
  Target,
  Calculator,
  Percent,
  BadgePercent,
  // SDM & Tim
  Users,
  User,
  UserCheck,
  UserPlus,
  Heart,
  Handshake,
  UserCog,
  Smile,
  GraduationCap,
  // Navigasi & Aksi
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search,
  Check,
  CheckCircle2,
  Plus,
  Compass,
  MapPin,
  Globe,
  Home,
  Navigation,
  Link: LinkIcon,
  // Waktu & Kalender
  Calendar,
  CalendarCheck,
  Clock,
  Hourglass,
  Timer,
  History,
  // Simbol & UI
  Sparkles,
  Star,
  Zap,
  Sun,
  Moon,
  Flame,
  Lock,
  Unlock,
  Settings,
  Sliders,
  Layout,
  Layers,
  Box,
  CheckSquare,
  Info,
  AlertTriangle,
  CircleDot,
  CheckCircle,
  Lightbulb,
};

export interface IconRegistryItem {
  name: string;
  category: 'legal' | 'contact' | 'business' | 'team' | 'navigation' | 'time' | 'symbols';
  label: string;
  tags: string[];
}

export const ICON_REGISTRY: IconRegistryItem[] = [
  // Hukum & Legal
  { name: 'Scale', category: 'legal', label: 'Timbangan Keadilan', tags: ['hukum', 'timbangan', 'keadilan', 'legal', 'law', 'justice', 'peradilan'] },
  { name: 'Building2', category: 'legal', label: 'Gedung Korporasi', tags: ['gedung', 'kantor', 'instansi', 'office', 'corporate', 'perusahaan', 'lembaga'] },
  { name: 'Building', category: 'legal', label: 'Gedung Usaha', tags: ['gedung', 'usaha', 'bangunan', 'properti', 'perusahaan'] },
  { name: 'Landmark', category: 'legal', label: 'Gedung Pengadilan/Bank', tags: ['pemerintah', 'pengadilan', 'instansi', 'kementerian', 'bank'] },
  { name: 'Briefcase', category: 'legal', label: 'Tas Kerja Bisnis', tags: ['bisnis', 'konsultan', 'pekerjaan', 'profesi', 'portfolio', 'briefcase'] },
  { name: 'ShieldCheck', category: 'legal', label: 'Perisai Legalitas', tags: ['perisai', 'keamanan', 'legal', 'resmi', 'sah', 'terverifikasi', 'shield'] },
  { name: 'Shield', category: 'legal', label: 'Perisai Proteksi', tags: ['proteksi', 'keamanan', 'mitigasi', 'perlindungan', 'defense'] },
  { name: 'ShieldAlert', category: 'legal', label: 'Peringatan Hukum', tags: ['peringatan', 'waspada', 'sengketa', 'mitigasi', 'risiko'] },
  { name: 'Award', category: 'legal', label: 'Sertifikat & Penghargaan', tags: ['penghargaan', 'prestasi', 'sertifikat', 'standar', 'iso', 'award'] },
  { name: 'FileCheck', category: 'legal', label: 'Dokumen Sah / Izin', tags: ['izin', 'dokumen', 'oss', 'legalitas', 'persetujuan', 'file', 'verifikasi'] },
  { name: 'FileText', category: 'legal', label: 'Kontrak / Akta', tags: ['kontrak', 'akta', 'surat', 'perjanjian', 'dokumen', 'draft'] },
  { name: 'FilePlus', category: 'legal', label: 'Tambah Dokumen', tags: ['tambah', 'pengajuan', 'berkas', 'dokumen', 'file'] },
  { name: 'FileSpreadsheet', category: 'legal', label: 'Laporan Finansial', tags: ['laporan', 'tabel', 'data', 'rekap', 'excel'] },
  { name: 'BookOpen', category: 'legal', label: 'Buku Undang-Undang', tags: ['regulasi', 'uu', 'aturan', 'buku', 'edukasi', 'wawasan', 'hukum'] },
  { name: 'Scroll', category: 'legal', label: 'Piagam / Sertifikat', tags: ['piagam', 'sertifikat', 'naskah', 'resmi', 'notaris'] },
  { name: 'Gavel', category: 'legal', label: 'Palu Hakim', tags: ['hakim', 'sidang', 'peradilan', 'litigasi', 'hukum', 'putusan'] },

  // Kontak & Komunikasi
  { name: 'Phone', category: 'contact', label: 'Telepon', tags: ['telepon', 'kontak', 'hubungi', 'call', 'phone'] },
  { name: 'PhoneCall', category: 'contact', label: 'Panggilan Masuk', tags: ['panggilan', 'hotline', 'customer service', 'konsultasi', 'call'] },
  { name: 'PhoneForwarded', category: 'contact', label: 'Forward Telepon', tags: ['telepon', 'forward', 'sambungan'] },
  { name: 'MessageCircle', category: 'contact', label: 'Chat / WhatsApp', tags: ['chat', 'whatsapp', 'pesan', 'wa', 'tanya', 'obrolan'] },
  { name: 'MessageSquare', category: 'contact', label: 'Kotak Pesan', tags: ['pesan', 'komentar', 'inquiry', 'konsultasi'] },
  { name: 'Mail', category: 'contact', label: 'Email Surat', tags: ['email', 'surat', 'pesan', 'inbox', 'kontak'] },
  { name: 'Send', category: 'contact', label: 'Kirim Pesan', tags: ['kirim', 'send', 'formulir', 'submit', 'pesan'] },
  { name: 'Headphones', category: 'contact', label: 'Layanan Bantuan', tags: ['cs', 'bantuan', 'support', 'helpdesk', 'operator'] },
  { name: 'Bell', category: 'contact', label: 'Notifikasi', tags: ['lonceng', 'notifikasi', 'pemberitahuan', 'pengingat', 'alert'] },
  { name: 'AtSign', category: 'contact', label: 'Alamat Email (@)', tags: ['email', 'mention', 'kontak'] },
  { name: 'Share2', category: 'contact', label: 'Bagikan', tags: ['share', 'bagikan', 'sosial', 'link'] },
  { name: 'HelpCircle', category: 'contact', label: 'Tanya Bantuan', tags: ['tanya', 'faq', 'bantuan', 'panduan'] },

  // Bisnis & Keuangan
  { name: 'Receipt', category: 'business', label: 'Pajak & Bukti Potong', tags: ['pajak', 'spt', 'faktur', 'struk', 'tagihan', 'keuangan', 'tax'] },
  { name: 'DollarSign', category: 'business', label: 'Keuangan & Investasi', tags: ['uang', 'modal', 'investasi', 'keuangan', 'finansial', 'duit'] },
  { name: 'Coins', category: 'business', label: 'Koin & Biaya', tags: ['biaya', 'ongkos', 'koin', 'tabungan', 'aset'] },
  { name: 'CreditCard', category: 'business', label: 'Pembayaran', tags: ['kartu', 'pembayaran', 'transaksi', 'rekening'] },
  { name: 'TrendingUp', category: 'business', label: 'Pertumbuhan Bisnis', tags: ['pertumbuhan', 'profit', 'grafik', 'naik', 'sukses', 'perkembangan'] },
  { name: 'BarChart3', category: 'business', label: 'Statistik Analisis', tags: ['grafik', 'data', 'analisis', 'statistik', 'laporan'] },
  { name: 'PieChart', category: 'business', label: 'Diagram Distribusi', tags: ['diagram', 'saham', 'dividen', 'kepemilikan', 'distribusi'] },
  { name: 'Wallet', category: 'business', label: 'Dompet & Kas', tags: ['dompet', 'kas', 'anggaran', 'budget'] },
  { name: 'Target', category: 'business', label: 'Target & Sasaran', tags: ['target', 'sasaran', 'tujuan', 'akurat', 'fokus'] },
  { name: 'Calculator', category: 'business', label: 'Kalkulator Pajak', tags: ['hitung', 'kalkulator', 'estimasi', 'pajak'] },
  { name: 'Percent', category: 'business', label: 'Persentase Pajak', tags: ['persen', 'tarif', 'diskon', 'rasio'] },
  { name: 'BadgePercent', category: 'business', label: 'Tarif Spesial / Promo', tags: ['tarif', 'spesial', 'diskon', 'penawaran'] },

  // SDM & Tim
  { name: 'Users', category: 'team', label: 'Tim / Karyawan (SDM)', tags: ['sdm', 'karyawan', 'pekerja', 'tim', 'tenaga kerja', 'users', 'personil'] },
  { name: 'User', category: 'team', label: 'Individu / Klien', tags: ['orang', 'klien', 'profil', 'user', 'anggota'] },
  { name: 'UserCheck', category: 'team', label: 'Perekrutan Sah', tags: ['rekrutmen', 'verifikasi', 'karyawan sah', 'sdm'] },
  { name: 'UserPlus', category: 'team', label: 'Tambah Karyawan', tags: ['tambah', 'rekrut', 'join', 'karyawan baru'] },
  { name: 'Handshake', category: 'team', label: 'Kemitraan & Kesepakatan', tags: ['kerjasama', 'kemitraan', 'mou', 'kontrak', 'partner', 'deal'] },
  { name: 'Heart', category: 'team', label: 'Kepuasan & Loyalitas', tags: ['loyalitas', 'kepuasan', 'peduli', 'relasi'] },
  { name: 'UserCog', category: 'team', label: 'Manajemen SDM', tags: ['manajer', 'hrd', 'pengaturan', 'sdm', 'struktur'] },
  { name: 'GraduationCap', category: 'team', label: 'Pendidikan & Gelar', tags: ['gelar', 'sarjana', 'ahli', 'pendidikan', 'kuliah', 'kompetensi'] },

  // Navigasi & Aksi
  { name: 'ArrowRight', category: 'navigation', label: 'Panah Kanan', tags: ['panah', 'lanjut', 'next', 'kanan', 'forward'] },
  { name: 'ArrowLeft', category: 'navigation', label: 'Panah Kiri', tags: ['kembali', 'back', 'kiri', 'mundur'] },
  { name: 'ArrowUp', category: 'navigation', label: 'Panah Atas', tags: ['atas', 'scroll top', 'kembali ke atas'] },
  { name: 'ArrowDown', category: 'navigation', label: 'Panah Bawah', tags: ['bawah', 'scroll down', 'unduh'] },
  { name: 'ChevronRight', category: 'navigation', label: 'Chevron Kanan', tags: ['chevron', 'panah', 'rincian', 'buka'] },
  { name: 'ChevronDown', category: 'navigation', label: 'Dropdown Panah', tags: ['dropdown', 'menu', 'bawah'] },
  { name: 'ExternalLink', category: 'navigation', label: 'Buka Tautan Eksternal', tags: ['link', 'eksternal', 'buka web', 'tab baru'] },
  { name: 'Search', category: 'navigation', label: 'Pencarian Layanan', tags: ['cari', 'search', 'filter', 'temukan'] },
  { name: 'Check', category: 'navigation', label: 'Centang / Selesai', tags: ['centang', 'sukses', 'selesai', 'ok'] },
  { name: 'CheckCircle2', category: 'navigation', label: 'Centang Lingkaran', tags: ['centang', 'sukses', 'disetujui', 'verifikasi'] },
  { name: 'Globe', category: 'navigation', label: 'Dunia / Imigrasi TKA', tags: ['imigrasi', 'global', 'dunia', 'tka', 'internasional', 'visa', 'kitas'] },
  { name: 'MapPin', category: 'navigation', label: 'Lokasi Kantor', tags: ['lokasi', 'alamat', 'kantor', 'peta', 'cabang'] },
  { name: 'Home', category: 'navigation', label: 'Beranda Utama', tags: ['beranda', 'home', 'rumah', 'awal'] },
  { name: 'Compass', category: 'navigation', label: 'Kompas Arah', tags: ['arah', 'panduan', 'navigasi'] },
  { name: 'Link', category: 'navigation', label: 'Tautan URL', tags: ['link', 'url', 'tautan'] },

  // Waktu & Kalender
  { name: 'Calendar', category: 'time', label: 'Kalender Janji', tags: ['kalender', 'jadwal', 'janji', 'konsultasi', 'agenda'] },
  { name: 'CalendarCheck', category: 'time', label: 'Jadwal Terkonfirmasi', tags: ['jadwal', 'konfirmasi', 'terjadwal', 'tenggat'] },
  { name: 'Clock', category: 'time', label: 'Jam Operasional', tags: ['jam', 'waktu', 'durasi', 'cepat', 'responsif'] },
  { name: 'Hourglass', category: 'time', label: 'Proses Pengerjaan', tags: ['waktu', 'tunggu', 'proses', 'progres'] },
  { name: 'Timer', category: 'time', label: 'Pengatur Waktu', tags: ['efisiensi', 'cepat', 'waktu', 'timer'] },
  { name: 'History', category: 'time', label: 'Riwayat Layanan', tags: ['riwayat', 'arsip', 'historis', 'jejak'] },

  // Simbol & Fitur
  { name: 'Sparkles', category: 'symbols', label: 'Premium & Spesial', tags: ['istimewa', 'bintang', 'baru', 'premium', 'keunggulan'] },
  { name: 'Star', category: 'symbols', label: 'Rating & Reputasi', tags: ['bintang', 'favorit', 'reputasi', 'rating'] },
  { name: 'Zap', category: 'symbols', label: 'Cepat & Instan', tags: ['cepat', 'kilat', 'instan', 'efisien', 'energi'] },
  { name: 'Lock', category: 'symbols', label: 'Kerahasiaan Dokumen', tags: ['rahasia', 'keamanan', 'privasi', 'aman', 'terkunci'] },
  { name: 'Unlock', category: 'symbols', label: 'Akses Terbuka', tags: ['akses', 'terbuka', 'izin'] },
  { name: 'Settings', category: 'symbols', label: 'Pengaturan Operasional', tags: ['setting', 'kelola', 'konfigurasi', 'sistem'] },
  { name: 'Sliders', category: 'symbols', label: 'Kustomisasi', tags: ['atur', 'opsi', 'pilihan', 'fleksibel'] },
  { name: 'Layout', category: 'symbols', label: 'Tata Letak / Struktur', tags: ['tata letak', 'struktur', 'organisasi', 'desain'] },
  { name: 'Lightbulb', category: 'symbols', label: 'Solusi Strategis', tags: ['ide', 'solusi', 'inovasi', 'strategi', 'pencerahan'] },
  { name: 'CheckSquare', category: 'symbols', label: 'Kotak Ceklis Kepatuhan', tags: ['ceklis', 'kepatuhan', 'audit', 'tugas'] },
];

export interface IconPickerProps {
  currentIconName: string;
  onSelectIcon: (iconName: string) => void;
  onClose: () => void;
  customColor?: string;
  onChangeColor?: (color: string) => void;
  customSize?: string;
  onChangeSize?: (size: string) => void;
  title?: string;
}

export function IconPicker({
  currentIconName,
  onSelectIcon,
  onClose,
  customColor,
  onChangeColor,
  customSize,
  onChangeSize,
  title = 'Pilih Ikon Elemen',
}: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua', emoji: '⭐' },
    { id: 'legal', label: 'Hukum & Izin', emoji: '⚖️' },
    { id: 'business', label: 'Bisnis & Pajak', emoji: '💼' },
    { id: 'contact', label: 'Kontak & Chat', emoji: '📞' },
    { id: 'team', label: 'SDM & Tim', emoji: '👥' },
    { id: 'navigation', label: 'Aksi & Panah', emoji: '➡️' },
    { id: 'time', label: 'Waktu & Kalender', emoji: '📅' },
    { id: 'symbols', label: 'Simbol & UI', emoji: '✨' },
  ];

  // Filtered icons
  const filteredIcons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ICON_REGISTRY.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (!q) return true;
      if (item.name.toLowerCase().includes(q)) return true;
      if (item.label.toLowerCase().includes(q)) return true;
      return item.tags.some((t) => t.toLowerCase().includes(q));
    });
  }, [searchQuery, activeCategory]);

  const CurrentIconComp = ICON_MAP[currentIconName] || ICON_MAP['FileCheck'] || Scale;

  return (
    <div 
      data-toolbar="true"
      data-action="true"
      className="w-80 sm:w-96 bg-slate-950 text-white border border-amber-400/80 rounded-2xl shadow-2xl p-3 sm:p-4 select-none animate-in fade-in zoom-in-95 duration-150 z-50 flex flex-col max-h-[520px] font-sans"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <CurrentIconComp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-amber-300 text-xs tracking-wide leading-none">{title}</h4>
            <span className="text-[10px] text-slate-400 leading-none">Saat ini: <strong className="text-white">{currentIconName || 'Default'}</strong></span>
          </div>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Tutup Palet"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Emote Search Bar */}
      <div className="mt-3 relative">
        <Search className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari ikon... (mis: telepon, hukum, uang, dokumen, sdm)"
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
          autoFocus
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Tabs (Emote Style) */}
      <div className="flex items-center gap-1 overflow-x-auto py-2 my-1 custom-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            type="button"
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 shrink-0 transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Emote Icon Grid */}
      <div className="flex-1 overflow-y-auto pr-1 my-1 custom-scrollbar min-h-[190px] max-h-[220px]">
        {filteredIcons.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <Search className="w-6 h-6 mx-auto mb-2 opacity-30 text-amber-300" />
            <p>Tidak ada ikon yang cocok dengan "{searchQuery}"</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-2 text-[10px] text-amber-300 hover:underline"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-1.5 p-1">
            {filteredIcons.map((item) => {
              const Comp = ICON_MAP[item.name];
              if (!Comp) return null;
              const isSelected = currentIconName === item.name;

              return (
                <button
                  key={item.name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectIcon(item.name);
                  }}
                  type="button"
                  title={`${item.label} (${item.name})`}
                  className={`relative p-2 rounded-xl flex flex-col items-center justify-center transition-all group ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-bold shadow-lg scale-105'
                      : 'bg-slate-900/90 text-slate-200 hover:bg-amber-400/20 hover:text-amber-300 border border-slate-800 hover:border-amber-400/60 hover:scale-110'
                  }`}
                >
                  <Comp className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="text-[8px] truncate max-w-full text-center mt-1 opacity-70 group-hover:opacity-100">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Color & Size Toolbar (Optional) */}
      {(onChangeColor || onChangeSize) && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] gap-2 mt-1">
          {onChangeColor && (
            <div className="flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <div className="flex items-center gap-1">
                {['#D4AF37', '#ffffff', '#0f172a', '#2563eb', '#16a34a', '#dc2626'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onChangeColor(c)}
                    style={{ backgroundColor: c }}
                    className="w-3.5 h-3.5 rounded-full border border-slate-700 hover:scale-125 transition-transform"
                    title={`Warna Ikon ${c}`}
                  />
                ))}
                <input
                  type="color"
                  value={customColor || '#D4AF37'}
                  onChange={(e) => onChangeColor(e.target.value)}
                  className="w-4 h-4 rounded cursor-pointer bg-transparent border-0"
                  title="Pilih Warna Ikon Custom"
                />
              </div>
            </div>
          )}

          {onChangeSize && (
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-slate-400">Ukuran:</span>
              <select
                value={customSize || '24px'}
                onChange={(e) => onChangeSize(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none"
              >
                <option value="16px">16px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
                <option value="40px">40px</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Done Button */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between mt-1">
        <span className="text-[10px] text-slate-400">Total: {filteredIcons.length} Ikon</span>
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 rounded-lg text-xs font-bold transition-all shadow"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
