'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  EyeOff, 
  Layers, 
  Briefcase, 
  FileText, 
  Globe, 
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export default function DevPortalPage() {
  const router = useRouter();
  const { content } = useContent();
  const [isDevActive, setIsDevActive] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Automatically enable dev mode when visiting /dev
    localStorage.setItem('seleco_dev_mode', 'true');
    setIsDevActive(true);
  }, []);

  const handleDisableDevMode = () => {
    localStorage.removeItem('seleco_dev_mode');
    setIsDevActive(false);
  };

  const handleEnableDevMode = () => {
    localStorage.setItem('seleco_dev_mode', 'true');
    setIsDevActive(true);
  };

  const siteStatus = content?.siteMode?.status || 'maintenance';

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans p-6 sm:p-10">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl w-full mx-auto relative z-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <img
                src="/logo-seleco.png"
                alt="Seleco"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif-title text-xl sm:text-2xl font-bold text-white tracking-wide">
                Seleco Developer Portal
              </h1>
              <p className="text-xs text-amber-400/90 font-medium">
                Akses Internal &amp; Bypass Mode Pengembangan
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-400/20"
          >
            <Sliders className="w-4 h-4 text-slate-950" />
            <span>Edit Isi Web</span>
          </Link>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-8 shadow-2xl backdrop-blur-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                Status Pengunjung Publik
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${siteStatus === 'maintenance' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="text-sm font-bold text-white">
                  {siteStatus === 'maintenance' 
                    ? '🟡 Mode Pengembangan (Publik hanya melihat Maintenance)' 
                    : '🟢 Mode Tayang (Website Live untuk Umum)'}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                Akses Browser Anda
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Developer Mode: {isDevActive ? 'AKTIF (Bypass On)' : 'NONAKTIF'}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed">
            <p>
              💡 <strong>Developer Mode otomatis aktif</strong> untuk browser Anda saat membuka halaman ini (<code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">/dev</code>). 
              Anda kini dapat membuka seluruh halaman web secara normal tanpa terhalang landing page pengembangan.
            </p>
          </div>

          {/* Main Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              className="w-full sm:flex-1 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
            >
              <span>Buka Website Penuh (Home)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isDevActive ? (
              <button
                onClick={handleDisableDevMode}
                className="w-full sm:w-auto px-5 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                title="Hapus akses dev untuk melihat tampilan pengunjung publik"
              >
                <EyeOff className="w-4 h-4 text-slate-400" />
                <span>Kunci / Tes Tampilan Publik</span>
              </button>
            ) : (
              <button
                onClick={handleEnableDevMode}
                className="w-full sm:w-auto px-5 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Aktifkan Kembali Dev Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* Editor Shortcuts */}
        <div className="space-y-3 mb-8">
          <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Akses Editor Web SELECO</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/edit-view"
              className="p-4 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-400/40 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">
                    Mode Visual (/edit-view)
                  </span>
                  <span className="text-[10px] text-slate-400">Klik langsung teks, link & tombol untuk edit ala Elementor</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin"
              className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform">
                  <Sliders className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                    Mode Formulir (/admin)
                  </span>
                  <span className="text-[10px] text-slate-400">Dashboard isi web lengkap, artikel, & manajemen pengguna</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-3 mb-10">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Pintasan Langsung Halaman Web
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/layanan"
              className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                    Direktori Layanan
                  </span>
                  <span className="text-[10px] text-slate-400">445+ Layanan &amp; 5 Pilar Konsultan</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/tentang"
              className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                    Tentang Kami
                  </span>
                  <span className="text-[10px] text-slate-400">Profil, Nilai &amp; Tim Konsultan</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/insight"
              className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                    Artikel &amp; Insight
                  </span>
                  <span className="text-[10px] text-slate-400">Publikasi Editorial &amp; Regulasi</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/kontak"
              className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                    Halaman Kontak
                  </span>
                  <span className="text-[10px] text-slate-400">Formulir, WhatsApp &amp; Alamat</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800/80">
          <p>© {new Date().getFullYear()} Seleco (Sedana legal consultant) — Internal Developer Mode</p>
        </div>

      </div>
    </div>
  );
}
