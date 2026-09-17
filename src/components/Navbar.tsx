'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
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
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
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
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-sm'
            : 'bg-white border-b border-gray-100 shadow-sm'
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
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5 border border-amber-400/30 group-hover:border-amber-400 transition-all shadow-sm">
              <img
                src={global?.logo || '/logo-seleco.png'}
                alt={global?.brandName || 'Seleco'}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-wider text-slate-900 transition-colors group-hover:text-gold-accent leading-tight">
                <EditableText
                  fieldPath="global.brandName"
                  fallback="Seleco"
                  label="Nama Brand"
                />{' '}
                <span className="text-gold-accent">.</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-gold-accent mt-0.5">
                <EditableText
                  fieldPath="global.brandTagline"
                  fallback="Sedana legal consultant"
                  label="Tagline Brand"
                />
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link: any, idx: number) => {
              const linkUrl = link.href || '/';
              const isActive = pathname === linkUrl;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 relative py-1.5"
                >
                  <EditableIcon
                    iconKey={`navbar.links.${idx}.icon`}
                    fallbackIcon={link.icon || 'Compass'}
                    className="w-3.5 h-3.5 text-gold-accent hover:scale-125 transition-transform"
                    label={`Ikon ${link.name}`}
                  />
                  <Link
                    href={linkUrl}
                    onClick={(e) => {
                      if (isEditMode) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className={`text-xs uppercase tracking-wider font-semibold transition-colors relative py-1 ${
                      isActive
                        ? 'text-gold-accent font-bold'
                        : 'text-slate-700 hover:text-gold-accent'
                    }`}
                  >
                    <EditableText
                      fieldPath={`navbar.links.${idx}.name`}
                      fallback={link.name}
                      label={`Nama Navigasi #${idx + 1}`}
                      linkPath={`navbar.links.${idx}.href`}
                      fallbackLink={linkUrl}
                    />
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-accent rounded-full"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href={global?.consultationUrl || '/kontak'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gold-accent rounded-lg hover:bg-gold-bright transition-all shadow-sm hover:shadow-md flex items-center gap-2"
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
            className="lg:hidden p-2 text-slate-800 hover:text-gold-accent focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </EditableSection>

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
                      Seleco <span className="text-gold-accent">.</span>
                    </span>
                    <span className="text-[9px] font-semibold tracking-widest text-gold-accent">
                      Sedana legal consultant
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
                  {navLinks.map((link: any, idx: number) => {
                    const linkUrl = link.href || '/';
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
                        className="text-sm font-medium text-slate-700 hover:text-gold-accent flex items-center justify-between py-2.5 border-b border-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <EditableIcon
                            iconKey={`navbar.links.${idx}.icon`}
                            fallbackIcon={link.icon || 'Compass'}
                            className="w-4 h-4 text-gold-accent"
                            label={`Ikon ${link.name}`}
                          />
                          <EditableText
                            fieldPath={`navbar.links.${idx}.name`}
                            fallback={link.name}
                            label={`Nav #${idx + 1}`}
                            linkPath={`navbar.links.${idx}.href`}
                            fallbackLink={linkUrl}
                          />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gold-accent/70" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
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
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-center text-white bg-gold-accent rounded-lg flex items-center justify-center gap-2 hover:bg-gold-bright shadow-md"
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
