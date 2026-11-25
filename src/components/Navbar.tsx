'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from '@/components/EditableElement';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const pathname = usePathname();
  const { content } = useContent();
  const global = content?.global;
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

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
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Insight', href: '/insight' },
    { name: 'Kontak', href: '/kontak' },
  ];

  const navLinks = content?.navbar?.links || defaultNavLinks;

  return (
    <EditableSection
      id="navbar"
      name="Navbar Navigasi Section"
      tag="header"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? 'bg-[#0a1420] shadow-2xl py-3 border-b border-white/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo matching Web NH proportions */}
        <Link
          href="/"
          onClick={(e) => {
            if (isEditMode) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 lg:gap-4 group"
        >
          <div className="relative h-9 md:h-11 lg:h-12 flex items-center">
            <img
              src={global?.logo || '/logo-seleco.png'}
              alt={global?.brandName || 'SELECO'}
              className="h-full w-auto max-w-[180px] sm:max-w-[210px] md:max-w-[240px] object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Desktop Menu matching Web NH */}
        <div className="hidden md:flex md:space-x-6 lg:space-x-8 items-center text-xs lg:text-sm font-medium uppercase tracking-wide">
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
                  }
                }}
                className={`transition duration-300 hover:text-[#dfa82e] ${
                  isActive ? 'text-[#dfa82e]' : 'text-white'
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
            );
          })}

          <Link
            href={global?.consultationUrl || '/kontak'}
            onClick={(e) => {
              if (isEditMode) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="bg-[#dfa82e] text-[#0a1420] px-4 lg:px-5 py-2.5 rounded font-bold hover:bg-white transition duration-300 uppercase text-[10px] lg:text-xs tracking-widest cursor-pointer"
          >
            <EditableText
              fieldPath="global.consultationText"
              fallback="Konsultasi Gratis"
              label="Teks Tombol Konsultasi"
              linkPath="global.consultationUrl"
              fallbackLink="/kontak"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[#dfa82e] p-2 rounded"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown matching Web NH */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a1420] border-t border-white/10">
          <div className="flex flex-col p-4 space-y-3 text-sm font-medium uppercase text-center text-white">
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
                  className={`block hover:text-[#dfa82e] transition py-2 ${
                    isActive ? 'text-[#dfa82e]' : ''
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
              className="block bg-[#dfa82e] text-[#0a1420] px-5 py-3 rounded font-bold hover:bg-white transition uppercase mt-1 tracking-widest text-xs"
            >
              <EditableText
                fieldPath="global.consultationText"
                fallback="Konsultasi Gratis"
                label="Tombol Konsultasi Mobile"
                linkPath="global.consultationUrl"
                fallbackLink="/kontak"
              />
            </Link>
          </div>
        </div>
      )}
    </EditableSection>
  );
}
