'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, Phone, Shield } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { content } = useContent();
  const global = content?.global;

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
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const waNum = global?.whatsappNumber || '6282211020022';

  return (
    <EditableSection
      id="footer"
      name="Footer Situs Section"
      tag="footer"
      className="bg-[#0a1420] text-white pt-16 border-t border-white/10 relative"
    >
      {/* Exact Web NH Footer Grid */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img
                src={global?.logo || '/logo-seleco.png'}
                alt={global?.brandName || 'SELECO'}
                className="h-11 w-auto max-w-[210px] object-contain"
              />
            </Link>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed max-w-sm">
              {isEditMode ? (
                <EditableText
                  fieldPath="footer.description"
                  fallback="SELECO (Sedana Legal Consultant) dikelola oleh PT SELECO SWAKARYA NUSANTARA, konsultan hukum korporasi di Jakarta Pusat yang menyatukan perizinan usaha, keimigrasian, perpajakan, pertanahan, dan ketenagakerjaan dalam satu layanan terintegrasi untuk klien di seluruh Indonesia. #YouBetterWithUs"
                  label="Deskripsi Footer"
                  multiline={true}
                />
              ) : (
                (
                  content?.footer?.description ||
                  'SELECO (Sedana Legal Consultant) dikelola oleh PT SELECO SWAKARYA NUSANTARA, konsultan hukum korporasi di Jakarta Pusat yang menyatukan perizinan usaha, keimigrasian, perpajakan, pertanahan, dan ketenagakerjaan dalam satu layanan terintegrasi untuk klien di seluruh Indonesia. #YouBetterWithUs'
                )
                  .split(/(#YouBetterWithUs)/g)
                  .map((part: string, i: number) =>
                    part === '#YouBetterWithUs' ? (
                      <span key={i} className="text-[#dfa82e] font-bold">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
              )}
            </p>
          </div>

          {/* 5 Pillars */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#dfa82e]">Layanan Kami</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link
                  href="/layanan?cat=perizinan"
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Perizinan (242)
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan?cat=imigrasi"
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Imigrasi (36)
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan?cat=pajak"
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Pajak (86)
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan?cat=pertanahan"
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan Pertanahan (45)
                </Link>
              </li>
              <li>
                <Link
                  href="/layanan?cat=sdm"
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="hover:text-[#dfa82e] transition-colors block leading-relaxed"
                >
                  Konsultan SDM (36)
                </Link>
              </li>
            </ul>
          </div>

          {/* Office */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#dfa82e]">Kantor Pusat</h4>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-bold text-white mb-1">PT SELECO SWAKARYA NUSANTARA</p>
                <p className="leading-relaxed">
                  <EditableText
                    fieldPath="global.address"
                    fallback="Jl. M.H. Thamrin No. 9 Lt 12, Kebon Sirih, Menteng, DKI Jakarta 10340"
                    label="Alamat Kantor"
                  />
                </p>
              </div>
              <div className="pt-2">
                <p className="text-xs text-slate-400 italic">Senin – Jumat | 09:00 – 17:00 WIB</p>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-[#dfa82e]">Kontak</h4>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-bold text-white mb-1">Telepon / WhatsApp</p>
                <a
                  href={`https://wa.me/${waNum}?text=${encodeURIComponent('Halo SELECO, saya ingin berkonsultasi mengenai layanan Anda.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="flex items-center gap-2 hover:text-[#dfa82e] transition"
                >
                  <Phone size={16} /> {global?.phone || '+62 822-1102-0022'}
                </a>
              </div>
              <div>
                <p className="font-bold text-white mb-1">Email Resmi</p>
                <a
                  href={`mailto:${global?.email || 'hello@selecoproject.com'}`}
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="flex items-center gap-2 hover:text-[#dfa82e] transition"
                >
                  <Mail size={16} />
                  <EditableText
                    fieldPath="global.email"
                    fallback="hello@selecoproject.com"
                    label="Email Resmi"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching Web NH */}
        <div className="border-t border-white/10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 tracking-wide">
            <EditableText
              fieldPath="footer.copyright"
              fallback="© 2026 PT SELECO SWAKARYA NUSANTARA. Seluruh hak dilindungi undang-undang."
              label="Teks Copyright"
            />
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#dfa82e] uppercase tracking-widest transition-colors"
          >
            <Shield size={13} />
            Portal Admin
          </Link>
        </div>
      </div>

      {/* Back to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-11 h-11 rounded-lg bg-[#0f2034] border border-[#dfa82e]/50 text-[#dfa82e] flex items-center justify-center hover:bg-[#dfa82e] hover:text-[#0a1420] transition-colors z-40 cursor-pointer"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </EditableSection>
  );
}
