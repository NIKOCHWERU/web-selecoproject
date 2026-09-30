'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection, EditableIcon } from '@/components/EditableElement';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const pathname = usePathname();
  const { content } = useContent();
  const global = content?.global;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const defaultNavLinks = [
    { name: 'Beranda', href: '/', icon: 'Home' },
    { name: 'Tentang Kami', href: '/tentang', icon: 'Building2' },
    { name: 'Layanan', href: '/layanan', icon: 'Briefcase' },
    { name: 'Insight', href: '/insight', icon: 'BookOpen' },
    { name: 'Kontak', href: '/kontak', icon: 'PhoneCall' },
  ];

  const navLinks = content?.navbar?.links || defaultNavLinks;

  return (
    <>
      <EditableSection
        id="navbar"
        name="Navbar Navigasi Section"
        tag="header"
        className={`sticky top-0 left-0 right-0 h-20 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f2034]/98 backdrop-blur-md border-b border-white/10 shadow-lg shadow-[#0f2034]/30'
            : 'bg-[#0f2034] border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo Brand */}
          <Link
            href="/"
            onClick={(e) => {
              if (isEditMode) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5 border border-white/20 group-hover:border-[#b88917]/60 transition-all">
              <img
                src={global?.logo || '/logo-seleco.png'}
                alt={global?.brandName || 'Seleco'}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-lg sm:text-xl font-bold tracking-wider text-white leading-tight group-hover:text-[#b88917] transition-colors">
                <EditableText
                  fieldPath="global.brandName"
                  fallback="Seleco"
                  label="Nama Brand"
                />{' '}
                <span className="text-[#b88917]">.</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.18em] text-white/50 mt-0.5 uppercase">
                <EditableText
                  fieldPath="global.brandTagline"
                  fallback="Sedana Legal Consultant"
                  label="Tagline Brand"
                />
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main navigation">
            {navLinks.map((link: any, idx: number) => {
              const linkUrl = link.href || '/';
              const isActive = pathname === linkUrl;
              return (
                <div key={idx} className="relative">
                  <Link
                    href={linkUrl}
                    onClick={(e) => {
                      if (isEditMode) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className={`text-[11px] uppercase tracking-widest font-semibold transition-colors py-1 ${
                      isActive
                        ? 'text-[#b88917]'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    <EditableText
                      fieldPath={`navbar.links.${idx}.name`}
                      fallback={link.name}
                      label={`Nama Navigasi #${idx + 1}`}
                      linkPath={`navbar.links.${idx}.href`}
                      fallbackLink={linkUrl}
                    />
                  </Link>
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#b88917] rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href={global?.consultationUrl || '/kontak'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0f2034] bg-[#b88917] hover:bg-[#d4a024] rounded transition-all flex items-center gap-2"
            >
              <EditableIcon
                iconKey="navbar.ctaIcon"
                fallbackIcon="Calendar"
                className="w-3.5 h-3.5"
                label="Ikon Tombol Konsultasi"
              />
              <EditableText
                fieldPath="global.consultationText"
                fallback="Konsultasi"
                label="Teks Tombol Konsultasi"
                linkPath="global.consultationUrl"
                fallbackLink="/kontak"
              />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#b88917] focus:ring-offset-2 focus:ring-offset-[#0f2034] rounded"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </EditableSection>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 w-72 max-w-[85vw] h-full bg-[#0f2034] border-l border-white/10 z-50 p-6 flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex flex-col">
                    <span className="font-serif-title text-lg font-bold text-white tracking-widest">
                      Seleco <span className="text-[#b88917]">.</span>
                    </span>
                    <span className="text-[8px] font-semibold tracking-widest text-white/40 uppercase mt-0.5">
                      Sedana Legal Consultant
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 text-white/60 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#b88917] rounded"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-6 flex flex-col space-y-1" aria-label="Mobile navigation">
                  {navLinks.map((link: any, idx: number) => {
                    const linkUrl = link.href || '/';
                    const isActive = pathname === linkUrl;
                    return (
                      <Link
                        key={idx}
                        href={linkUrl}
                        onClick={(e) => {
                          if (isEditMode) {
                            e.preventDefault();
                            e.stopPropagation();
                          } else {
                            setMobileOpen(false);
                          }
                        }}
                        className={`text-sm font-medium flex items-center py-3 border-b border-white/5 transition-colors ${
                          isActive ? 'text-[#b88917]' : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <EditableText
                          fieldPath={`navbar.links.${idx}.name`}
                          fallback={link.name}
                          label={`Nav #${idx + 1}`}
                          linkPath={`navbar.links.${idx}.href`}
                          fallbackLink={linkUrl}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-5 border-t border-white/10">
                <Link
                  href={global?.consultationUrl || '/kontak'}
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    } else {
                      setMobileOpen(false);
                    }
                  }}
                  className="w-full py-3 text-[11px] font-bold uppercase tracking-wider text-center text-[#0f2034] bg-[#b88917] hover:bg-[#d4a024] rounded flex items-center justify-center gap-2 transition-all"
                >
                  <EditableIcon
                    iconKey="navbar.ctaIcon"
                    fallbackIcon="Calendar"
                    className="w-4 h-4"
                    label="Ikon Konsultasi Mobile"
                  />
                  <EditableText
                    fieldPath="global.consultationText"
                    fallback="Jadwalkan Konsultasi"
                    label="Tombol Konsultasi Mobile"
                    linkPath="global.consultationUrl"
                    fallbackLink="/kontak"
                  />
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
