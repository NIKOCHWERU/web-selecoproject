'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ArrowUp, MessageCircle, Mail, MapPin, Phone, Shield, FileText, Edit3, Sliders, Sparkles } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection, EditableIcon } from './EditableElement';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { content } = useContent();
  const global = content?.global;
  const footer = content?.footer;

  useEffect(() => {
    const checkMode = () => {
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    };
    checkMode();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(e.data.mode === 'click_to_edit');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <EditableSection id="footer" name="Footer Situs Section" tag="footer" className="bg-navy-dark text-white/70 text-xs border-t border-gold-accent/40 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white p-1 border border-gold-accent/40 shadow-md">
                <img
                  src={global?.logo || '/logo-seleco.png'}
                  alt={global?.brandName || 'Seleco'}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-wider text-white leading-tight">
                  <EditableText
                    fieldPath="global.brandName"
                    fallback="Seleco"
                    label="Nama Brand"
                  /> <span className="text-gold-accent">.</span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.2em] text-gold-accent mt-0.5">
                  <EditableText
                    fieldPath="global.brandTagline"
                    fallback="Sedana legal consultant"
                    label="Tagline Brand"
                  />
                </span>
              </div>
            </Link>
            <p className="text-white/60 leading-relaxed text-xs">
              <EditableText
                fieldPath="footer.description"
                fallback="Seleco (Sedana legal consultant) adalah konsultan terpercaya di Indonesia: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM."
                label="Deskripsi Footer"
                multiline={true}
              />
            </p>
            <div className="pt-2">
              <Link
                href="/layanan"
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-accent/10 border border-gold-accent/30 rounded text-gold-accent text-xs font-semibold hover:bg-gold-accent hover:text-white transition-all"
              >
                <EditableIcon
                  iconKey="footer.dirIcon"
                  fallbackIcon="Building2"
                  className="w-3.5 h-3.5 text-gold-accent"
                  label="Ikon Direktori Footer"
                />
                Direktori Layanan ({global?.totalServices || '445+'})
              </Link>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="font-serif-title text-base font-semibold text-white mb-4 border-b border-gold-accent/30 pb-2 inline-block">
              5 Pilar Konsultan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/layanan?cat=perizinan" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Konsultan Perizinan &amp; OSS
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=imigrasi" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Konsultan Imigrasi (KITAS &amp; TKA)
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=pajak" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Konsultan Pajak &amp; SPT Badan
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=pertanahan" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Konsultan Pertanahan &amp; BPN
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=sdm" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Konsultan SDM &amp; Ketenagakerjaan
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif-title text-base font-semibold text-white mb-4 border-b border-gold-accent/30 pb-2 inline-block">
              Navigasi Firma
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/tentang" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Tentang SELECO
                </Link>
              </li>
              <li>
                <Link 
                  href="/tentang#retainer" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Corporate Legal Retainer
                </Link>
              </li>
              <li>
                <Link 
                  href="/tentang" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Metodologi Kerja
                </Link>
              </li>
              <li>
                <Link 
                  href="/insight" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Legal Insights & Berita
                </Link>
              </li>
              <li>
                <Link 
                  href="/kontak" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  Hubungi Tim Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Office Contact */}
          <div>
            <h4 className="font-serif-title text-base font-semibold text-white mb-4 border-b border-gold-accent/30 pb-2 inline-block">
              Kantor Pusat & Kontak
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <EditableIcon
                  iconKey="footer.addressIcon"
                  fallbackIcon="MapPin"
                  className="w-4 h-4 text-gold-accent shrink-0 mt-0.5"
                  label="Ikon Alamat Footer"
                />
                <span>
                  <EditableText
                    fieldPath="global.address"
                    fallback="Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340"
                    label="Alamat Kantor"
                  />
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <EditableIcon
                  iconKey="footer.emailIcon"
                  fallbackIcon="Mail"
                  className="w-4 h-4 text-gold-accent shrink-0"
                  label="Ikon Email Footer"
                />
                <a 
                  href={`mailto:${global?.email || 'hello@selecoproject.com'}`} 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  <EditableText
                    fieldPath="global.email"
                    fallback="hello@selecoproject.com"
                    label="Email Resmi"
                  />
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <EditableIcon
                  iconKey="footer.phoneIcon"
                  fallbackIcon="Phone"
                  className="w-4 h-4 text-gold-accent shrink-0"
                  label="Ikon Telepon Footer"
                />
                <a 
                  href={`tel:${global?.whatsappNumber || '6282211020022'}`} 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-gold-accent transition-colors"
                >
                  {global?.whatsappDisplay || '+62 822-1102-0022'}
                </a>
              </div>
              <div className="pt-2 text-white/50">
                Jam Kerja: Senin – Jumat | 09:00 – 17:00 WIB
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 border-t border-white/5 mt-4">
          <div>
            <EditableText
              fieldPath="footer.copyright"
              fallback={`© ${new Date().getFullYear()} SELECO (SEDANA LEGAL CONSULTANT). Hak Cipta Dilindungi Undang-Undang.`}
              label="Teks Copyright"
            />
          </div>

          {/* Tombol Akses Edit Isi Web */}
          <div className="flex items-center gap-2">
            <Link
              href="/edit-view"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-accent/15 hover:bg-gold-accent/25 border border-gold-accent/40 text-gold-accent text-xs font-semibold transition-all shadow-sm"
              title="Akses Langsung Editor Visual Live (/edit-view)"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
              <span>Mode Visual (/edit-view)</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-xs font-medium transition-all shadow-sm"
              title="Akses Dashboard Formulir Admin (/admin)"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Mode Formulir (/admin)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 w-10 h-10 rounded-full bg-navy-deep border border-gold-accent/50 text-gold-accent flex items-center justify-center shadow-md hover:bg-gold-accent hover:text-white transition-all z-40"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </EditableSection>
  );
}
