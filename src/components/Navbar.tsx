'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Scale, Calendar, PhoneCall, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useContent } from '@/context/ContentContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { content } = useContent();
  const global = content?.global;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Insight', href: '/insight' },
    { name: 'Kontak', href: '/kontak' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 h-20 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-sm'
            : 'bg-white border-b border-gray-100 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif-title text-2xl font-bold tracking-widest text-slate-900 transition-colors group-hover:text-gold-accent">
              {global?.brandName || 'SELECO'} <span className="text-gold-accent">.</span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.25em] text-gold-accent uppercase -mt-1">
              {global?.brandTagline || 'SEDANA LEGAL CONSULTANT'}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors relative py-1.5 ${
                    isActive
                      ? 'text-gold-accent font-bold'
                      : 'text-slate-700 hover:text-gold-accent'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-accent rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/kontak"
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gold-accent rounded-lg hover:bg-gold-bright transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              Konsultasi
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-800 hover:text-gold-accent focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white border-l border-gray-200 z-50 p-6 flex flex-col justify-between text-slate-800 shadow-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-serif-title text-xl font-bold text-slate-900 tracking-widest">
                      SELECO <span className="text-gold-accent">.</span>
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-gold-accent">
                      SEDANA LEGAL CONSULTANT
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 text-slate-700 hover:text-gold-accent"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="mt-8 flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-slate-700 hover:text-gold-accent flex items-center justify-between py-2.5 border-b border-gray-100"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 text-gold-accent/70" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <Link
                  href="/kontak"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-center text-white bg-gold-accent rounded-lg flex items-center justify-center gap-2 hover:bg-gold-bright shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  Jadwalkan Konsultasi
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
