'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ArrowUp, MessageCircle, Mail, MapPin, Phone, Shield, FileText } from 'lucide-react';
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
    <EditableSection id="footer" name="Footer Situs Section" tag="footer" className="bg-navy-dark text-white/70 text-xs border-t border-gold-accent/40 pt-12 pb-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-white p-0.5 border border-gold-accent/40 shadow-sm">
                <img
                  src={global?.logo || '/logo-seleco.png'}
                  alt={global?.brandName || 'Seleco'}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider font-serif text-[#dfa82e]">
                  <EditableText
                    fieldPath="global.brandName"
                    fallback="SELECO"
                    label="Nama Brand"
                  />
                </span>
                <span className="text-[9px] text-white tracking-[0.2em] uppercase mt-0.5">
                  <EditableText
                    fieldPath="global.brandTagline"
                    fallback="Sedana legal consultant"
                    label="Tagline Brand"
                  />
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm font-normal">
              <EditableText
                fieldPath="footer.description"
                fallback="Seleco (Sedana legal consultant) adalah konsultan terpercaya di Indonesia: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM."
                label="Deskripsi Footer"
                multiline={true}
              />
            </p>
            <div className="pt-1">
              <Link
                href="/layanan"
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#dfa82e]/10 border border-[#dfa82e]/30 rounded-lg text-[#dfa82e] text-[11px] font-bold uppercase tracking-wider hover:bg-[#dfa82e] hover:text-[#0a1420] transition-colors shadow-sm"
              >
                <EditableIcon
                  iconKey="footer.dirIcon"
                  fallbackIcon="Building2"
                  className="w-3.5 h-3.5 text-[#dfa82e]"
                  label="Ikon Direktori Footer"
                />
                Direktori Layanan ({global?.totalServices || '445+'})
              </Link>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-[#dfa82e] font-sans border-b border-[#dfa82e]/30 pb-1.5 inline-block">
              5 Pilar Konsultan
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link 
                  href="/layanan?cat=perizinan" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Perizinan &amp; OSS
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=imigrasi" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Imigrasi (KITAS &amp; TKA)
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=pajak" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Pajak &amp; SPT Badan
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=pertanahan" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Pertanahan &amp; BPN
                </Link>
              </li>
              <li>
                <Link 
                  href="/layanan?cat=sdm" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan SDM &amp; Ketenagakerjaan
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-[#dfa82e] font-sans border-b border-[#dfa82e]/30 pb-1.5 inline-block">
              Navigasi Firma
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link 
                  href="/tentang" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Tentang SELECO
                </Link>
              </li>
              <li>
                <Link 
                  href="/tentang#retainer" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Corporate Legal Retainer
                </Link>
              </li>
              <li>
                <Link 
                  href="/tentang" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Metodologi Kerja
                </Link>
              </li>
              <li>
                <Link 
                  href="/insight" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Legal Insights &amp; Berita
                </Link>
              </li>
              <li>
                <Link 
                  href="/kontak" 
                  onClick={(e) => { if (isEditMode) { e.preventDefault(); e.stopPropagation(); } }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Hubungi Tim Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Office Contact */}
          <div>
            <h4 className="text-base font-bold mb-4 text-[#dfa82e] font-sans border-b border-[#dfa82e]/30 pb-2 inline-block">
              Kantor Pusat &amp; Kontak
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
        </div>
      </div>

      {/* Back to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 w-9 h-9 rounded-lg bg-[#0f2034] border border-[#dfa82e]/50 text-[#dfa82e] flex items-center justify-center shadow-md hover:bg-[#dfa82e] hover:text-[#0a1420] transition-colors z-40 cursor-pointer"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </EditableSection>
  );
}
