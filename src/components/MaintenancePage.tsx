'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { SiteContent } from '@/data/defaultSiteContent';

interface MaintenancePageProps {
  content?: SiteContent;
}

export default function MaintenancePage({ content }: MaintenancePageProps) {
  const brandName = content?.global?.brandName || 'Seleco';
  const brandTagline = content?.global?.brandTagline || 'Sedana legal consultant';
  const whatsappNumber = content?.global?.whatsappNumber || '6282211020022';
  const whatsappDisplay = content?.global?.whatsappDisplay || '0822-1102-0022';
  const email = content?.global?.email || 'hello@selecoproject.com';
  const address = content?.global?.address || 'Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340';
  
  const siteMode = content?.siteMode;
  const title = siteMode?.title || 'Website Resmi Seleco Sedang Dalam Pengembangan';
  const subtitle = siteMode?.subtitle || 'Kami sedang mempersiapkan sistem dan direktori layanan konsultan korporasi terbaik untuk Anda. Untuk konsultasi perizinan, imigrasi, pajak, pertanahan, atau SDM, tim konsultan Seleco tetap aktif melayani Anda via WhatsApp dan Email resmi.';
  const badgeText = siteMode?.badgeText || 'Website Dalam Pengembangan';
  const estimatedDate = siteMode?.estimatedDate || 'Segera Hadir (Coming Soon)';

  const waUrl = `https://wa.me/${whatsappNumber}?text=Halo%20Seleco,%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20konsultan%20dan%20perizinan%20usaha.`;

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* Ambient Luxury Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/5 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/10">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-serif-title text-xl font-bold tracking-wider text-white">
              {brandName}
            </div>
            <div className="text-[10px] font-semibold tracking-widest text-amber-400/80">
              {brandTagline}
            </div>
          </div>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center flex-grow">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-inner backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <Sparkles className="w-3.5 h-3.5" />
          <span>{badgeText}</span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-3xl mb-6">
          {title}
        </h1>

        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full mb-6" />

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal mb-10">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/20 hover:scale-[1.02] flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Konsultasi WhatsApp</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="w-full sm:w-auto px-7 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-white font-semibold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2.5"
          >
            <Mail className="w-5 h-5 text-amber-300" />
            <span>Kirim Email Resmi</span>
          </a>
        </div>

        {/* Value Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>34 Legalitas Bisnis</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pendirian PT, PMA, CV, perizinan kontrak korporasi dan ketenagakerjaan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>411+ Izin OSS RBA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sertifikat Standar, NIB, AMDAL, PB UMKU di berbagai sektor KBLI.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
              <Clock className="w-4 h-4" />
              <span>{estimatedDate}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Peluncuran penuh portal digital SELECO sedang dalam tahap finalisasi.
            </p>
          </div>
        </div>

      </main>

      {/* Footer Info */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-slate-950/50 backdrop-blur-md py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{address}</span>
          </div>

          <div className="flex items-center gap-6">
            <a href={`tel:${whatsappNumber}`} className="hover:text-amber-300 transition-colors">
              Tel: {whatsappDisplay}
            </a>
            <span>•</span>
            <a href={`mailto:${email}`} className="hover:text-amber-300 transition-colors">
              {email}
            </a>
          </div>

          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} {brandName}. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>

    </div>
  );
}
