'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, ArrowUp, MessageCircle, Mail, MapPin, Phone, Shield, FileText } from 'lucide-react';

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

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
    <footer className="bg-navy-dark text-white/70 text-xs border-t border-gold-accent/40 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col">
              <span className="font-serif-title text-2xl font-bold tracking-widest text-white">
                SELECO <span className="text-gold-accent">.</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gold-accent uppercase mt-0.5">
                SEDANA LEGAL CONSULTANT
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed text-xs">
              Strategic legal counsel for businesses, organizations, and individuals in Indonesia. Pendampingan 34 Perkara Hukum & 411+ Perizinan Usaha OSS RBA.
            </p>
            <div className="pt-2">
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-accent/10 border border-gold-accent/30 rounded text-gold-accent text-xs font-semibold hover:bg-gold-accent hover:text-white transition-all"
              >
                <Scale className="w-3.5 h-3.5" />
                Direktori Layanan (445+)
              </Link>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="font-serif-title text-base font-semibold text-white mb-4 border-b border-gold-accent/30 pb-2 inline-block">
              Bidang Layanan Utama
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/layanan?cat=hukum" className="hover:text-gold-accent transition-colors">
                  34 Perkara Litigasi & Non-Litigasi
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=pendirian" className="hover:text-gold-accent transition-colors">
                  Pendirian Badan Usaha & OSS
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=perpajakan" className="hover:text-gold-accent transition-colors">
                  Perpajakan (Tax Advisory & SPT)
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=kesehatan" className="hover:text-gold-accent transition-colors">
                  Izin Rumah Sakit, Klinik & Dokter
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=pertanahan" className="hover:text-gold-accent transition-colors">
                  Pertanahan & PBG / IMB
                </Link>
              </li>
              <li>
                <Link href="/layanan?cat=energi" className="hover:text-gold-accent transition-colors">
                  Energi, Migas & Minerba
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
                <Link href="/#about" className="hover:text-gold-accent transition-colors">
                  Tentang SELECO
                </Link>
              </li>
              <li>
                <Link href="/#retainer" className="hover:text-gold-accent transition-colors">
                  Corporate Legal Retainer
                </Link>
              </li>
              <li>
                <Link href="/#approach" className="hover:text-gold-accent transition-colors">
                  Metodologi Kerja
                </Link>
              </li>
              <li>
                <Link href="/#attorneys" className="hover:text-gold-accent transition-colors">
                  Tim Advokat & Konsultan
                </Link>
              </li>
              <li>
                <Link href="/#insights" className="hover:text-gold-accent transition-colors">
                  Legal Insights & Berita
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-gold-accent transition-colors">
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
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-accent shrink-0" />
                <a href="mailto:consult@seleco.id" className="hover:text-gold-accent transition-colors">
                  consult@seleco.id
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-accent shrink-0" />
                <a href="tel:+6281200000000" className="hover:text-gold-accent transition-colors">
                  +62 812-0000-0000
                </a>
              </div>
              <div className="pt-2 text-white/50">
                Jam Kerja: Senin – Jumat | 09:00 – 17:00 WIB
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-white/50">
          <div>
            &copy; {new Date().getFullYear()} <strong>SELECO — Sedana Legal Consultant</strong>. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-gold-accent transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gold-accent transition-colors cursor-pointer">Legal Disclaimer</span>
            <span>•</span>
            <span className="hover:text-gold-accent transition-colors cursor-pointer">Terms of Use</span>
          </div>
        </div>
        <p className="text-center text-[10px] text-white/40 mt-4">
          *Informasi yang dipublikasikan pada situs web ini disediakan untuk tujuan informasi umum dan tidak dimaksudkan sebagai nasihat hukum formal sebelum disepakati perjanjian kerja tertulis.
        </p>
      </div>

      {/* Floating WhatsApp CTA */}
      <a
        href="https://wa.me/6281200000000?text=Halo%20SELECO,%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20hukum."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>

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
    </footer>
  );
}
