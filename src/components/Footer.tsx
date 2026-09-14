'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, ArrowUp, MessageCircle, Mail, MapPin, Phone, Shield, FileText } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { content } = useContent();
  const global = content?.global;
  const footer = content?.footer;

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
            <Link href="/" className="flex flex-col">
              <span className="font-serif-title text-2xl font-bold tracking-widest text-white">
                <EditableText
                  fieldPath="global.brandName"
                  fallback="SELECO"
                  label="Nama Brand"
                /> <span className="text-gold-accent">.</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gold-accent uppercase mt-0.5">
                <EditableText
                  fieldPath="global.brandTagline"
                  fallback="SEDANA CORPORATE CONSULTANT"
                  label="Tagline Brand"
                />
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed text-xs">
              <EditableText
                fieldPath="footer.description"
                fallback="Konsultan korporasi terpercaya di Indonesia: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM."
                label="Deskripsi Footer"
                multiline={true}
              />
            </p>
            <div className="pt-2">
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-accent/10 border border-gold-accent/30 rounded text-gold-accent text-xs font-semibold hover:bg-gold-accent hover:text-white transition-all"
              >
                <Building2 className="w-3.5 h-3.5" />
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
                <Link href="/layanan?cat=perizinan" className="hover:text-gold-accent transition-colors">
                  Konsultan Perizinan &amp; OSS
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=imigrasi" className="hover:text-gold-accent transition-colors">
                  Konsultan Imigrasi (KITAS &amp; TKA)
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=pajak" className="hover:text-gold-accent transition-colors">
                  Konsultan Pajak &amp; SPT Badan
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=pertanahan" className="hover:text-gold-accent transition-colors">
                  Konsultan Pertanahan &amp; BPN
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=sdm" className="hover:text-gold-accent transition-colors">
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
                <Link href="/tentang" className="hover:text-gold-accent transition-colors">
                  Tentang SELECO
                </Link>
              </li>
              <li>
                <Link href="/tentang#retainer" className="hover:text-gold-accent transition-colors">
                  Corporate Legal Retainer
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-gold-accent transition-colors">
                  Metodologi Kerja
                </Link>
              </li>
              <li>
                <Link href="/insight" className="hover:text-gold-accent transition-colors">
                  Legal Insights & Berita
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-gold-accent transition-colors">
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
                <MapPin className="w-4 h-4 text-gold-accent shrink-0 mt-0.5" />
                <span>
                  <EditableText
                    fieldPath="global.address"
                    fallback="Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340"
                    label="Alamat Kantor"
                  />
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-accent shrink-0" />
                <a href={`mailto:${global?.email || 'hello@selecoproject.com'}`} className="hover:text-gold-accent transition-colors">
                  <EditableText
                    fieldPath="global.email"
                    fallback="hello@selecoproject.com"
                    label="Email Resmi"
                  />
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-accent shrink-0" />
                <a href={`tel:${global?.whatsappNumber || '6282211020022'}`} className="hover:text-gold-accent transition-colors">
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
        <div className="pt-8 text-center text-white/50">
          <div>
            <EditableText
              fieldPath="footer.copyright"
              fallback={`© ${new Date().getFullYear()} SELECO (Sedana Corporate Consultant). Hak Cipta Dilindungi Undang-Undang.`}
              label="Teks Copyright"
            />
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
