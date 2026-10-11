'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useContent } from '@/context/ContentContext';
import { defaultSectionOrder } from '@/data/defaultSiteContent';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStatsBanner from '@/components/TrustStatsBanner';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import RetainerSection from '@/components/RetainerSection';
import TeamSection from '@/components/TeamSection';
import InsightsSection from '@/components/InsightsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { EditableText, EditableSection } from '@/components/EditableElement';
import { 
  Building2, 
  PhoneCall, 
  BookOpen, 
  Briefcase, 
  ChevronRight, 
  ArrowRight,
  Filter,
  Grid,
  List,
  Search,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Sparkles,
  Copy,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { SERVICE_CATEGORIES, KONSULTAN_SDM_ITEMS, PERIZINAN_LEGALITAS_ITEMS } from '@/data/layananData';

export type PreviewPageId = 'home' | 'about' | 'services' | 'insight' | 'contact';

const SECTION_METADATA: Record<string, { name: string; icon: string }> = {
  hero: { name: 'Hero Banner Utama', icon: '🚀' },
  'trust-stats': { name: 'Statistik Kepercayaan & Legalitas', icon: '📊' },
  about: { name: 'Tentang SELECO', icon: '🏢' },
  services: { name: '5 Pilar Layanan Konsultan', icon: '💼' },
  retainer: { name: 'Program Retainer Korporasi', icon: '🛡️' },
  team: { name: 'Tim Konsultan & Spesialis', icon: '👥' },
  insights: { name: 'Legal Insights & Publikasi', icon: '📰' },
  faq: { name: 'Tanya Jawab (FAQ)', icon: '❓' },
  contact: { name: 'Kontak & Alamat Kantor', icon: '📞' },
};

function PreviewContent() {
  const { content, setContent } = useContent();
  const searchParams = useSearchParams();
  const initialPage = (searchParams.get('page') as PreviewPageId) || 'home';
  const [currentPage, setCurrentPage] = useState<PreviewPageId>(initialPage);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    const pageParam = searchParams.get('page') as PreviewPageId;
    if (pageParam) {
      setCurrentPage(pageParam);
    }
    const modeParam = searchParams.get('mode');
    if (modeParam === 'click_to_edit') {
      sessionStorage.setItem('seleco_editor_mode', 'click_to_edit');
      setIsEditMode(true);
    }
  }, [searchParams]);

  const currentPageRef = useRef<PreviewPageId>(initialPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    // 1. Initial check from sessionStorage
    try {
      const cached = sessionStorage.getItem('seleco_live_preview_content');
      if (cached) {
        const parsed = JSON.parse(cached);
        setContent(parsed);
      }
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    } catch (e) {
      console.error('Failed to read cached content:', e);
    }

    // 2. Listen to real-time sync messages from /admin parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_SITE_CONTENT' && event.data.content) {
        setContent(event.data.content);
      }
      if (event.data?.type === 'SET_PREVIEW_PAGE' && event.data.page) {
        if (event.data.page !== currentPageRef.current) {
          currentPageRef.current = event.data.page as PreviewPageId;
          setCurrentPage(event.data.page as PreviewPageId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      if (event.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(event.data.mode === 'click_to_edit');
      }
      if (event.data?.type === 'SCROLL_TO_SECTION' && event.data.sectionId) {
        const sec = document.getElementById(event.data.sectionId);
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          sec.classList.add('ring-4', 'ring-amber-400', 'ring-offset-4', 'transition-all', 'duration-500');
          setTimeout(() => {
            sec.classList.remove('ring-4', 'ring-amber-400', 'ring-offset-4');
          }, 2500);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // 3. Notify parent that iframe is ready to receive content
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_IFRAME_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setContent]);

  // Global click & navigation interceptor in edit mode
  useEffect(() => {
    const handleCaptureClick = (e: MouseEvent) => {
      const isEdit = (typeof window !== 'undefined') && (
        sessionStorage.getItem('seleco_editor_mode') === 'click_to_edit' ||
        new URLSearchParams(window.location.search).get('mode') === 'click_to_edit'
      );
      if (!isEdit) return;

      const target = e.target as HTMLElement;

      // Allow clicks on active toolbars, inputs, textareas, selects, and action buttons
      if (
        target.closest('[data-toolbar]') ||
        target.closest('[data-editable-toolbar]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[data-action]') ||
        target.closest('[data-canva-bar]') ||
        target.closest('.group\\/editable-icon') ||
        target.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // If clicked element is or is inside an anchor (<a>) or Next.js Link
      const anchor = target.closest('a');
      if (anchor) {
        e.preventDefault();
        const editableChild = target.closest('.group\\/editable') || target.closest('.group\\/editable-icon');
        if (!editableChild) {
          e.stopPropagation();
        }
        return;
      }

      // If clicked element is a button (not inside toolbar or canva bar)
      const button = target.closest('button');
      if (button && !button.closest('[data-toolbar]') && !button.closest('[data-canva-bar]')) {
        const editableChild = target.closest('.group\\/editable') || target.closest('.group\\/editable-icon');
        if (!editableChild) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('click', handleCaptureClick, true);
    return () => window.removeEventListener('click', handleCaptureClick, true);
  }, []);

  const totalServices = content?.global?.totalServices || content?.hero?.stat2Number || '445+';

  // Get active sections for current page in order
  const getPageSectionOrder = () => {
    if (currentPage === 'home') {
      const order = content?.sectionOrder?.home || defaultSectionOrder.home;
      // Also ensure any custom sections for home are included
      const customHomeIds = (content?.customSections || [])
        .filter((c: any) => !c.page || c.page === 'home')
        .map((c: any) => c.id);
      
      const combined = [...order];
      customHomeIds.forEach((id: string) => {
        if (!combined.includes(id)) {
          combined.push(id);
        }
      });
      return combined;
    }
    return defaultSectionOrder[currentPage] || [];
  };

  const sectionsToRender = getPageSectionOrder();

  // Helper to render custom section
  const renderCustomSection = (custom: any) => {
    if (!custom) return null;

    if (custom.type === 'cta') {
      return (
        <section
          id={custom.id}
          className="py-20 px-6 sm:px-12 border-b border-gray-100 relative overflow-hidden"
          style={{ backgroundColor: custom.bg || '#0a1420', color: custom.textColor || '#ffffff' }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            {custom.badge && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#dfa82e]/20 text-[#dfa82e] border border-[#dfa82e]/40">
                <MessageCircle className="w-3.5 h-3.5" />
                {custom.badge}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-title leading-tight">
              {custom.title}
            </h2>
            {custom.subtitle && (
              <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
                {custom.subtitle}
              </p>
            )}
            {custom.buttonText && (
              <div className="pt-4">
                <a
                  href={custom.buttonUrl || '#'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#dfa82e] to-[#b88917] text-[#0a1420] rounded-full font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{custom.buttonText}</span>
                </a>
              </div>
            )}
          </div>
        </section>
      );
    }

    if (custom.type === 'columns') {
      return (
        <section
          id={custom.id}
          className="py-20 px-6 sm:px-12 border-b border-gray-100"
          style={{ backgroundColor: custom.bg || '#f8fafc', color: custom.textColor || '#0f172a' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              {custom.badge && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#dfa82e]/15 text-[#b88917] uppercase tracking-wider">
                  {custom.badge}
                </span>
              )}
              <h2 className="text-3xl font-bold font-serif-title">{custom.title}</h2>
              {custom.subtitle && (
                <p className="text-base text-slate-600">{custom.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Konsultasi Terpadu', desc: 'Satu pintu untuk 5 pilar layanan konsultan spesialis bisnis Anda.' },
                { title: 'Kepastian Regulasi', desc: 'Mitigasi risiko hukum dan kepatuhan perizinan secara menyeluruh.' },
                { title: 'Pendampingan Berkelanjutan', desc: 'Dukungan tim profesional harian untuk kelancaran korporasi.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-[#dfa82e]/10 text-[#dfa82e] flex items-center justify-center font-bold mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (custom.type === 'text') {
      return (
        <section
          id={custom.id}
          className="py-16 px-6 sm:px-12 border-b border-gray-100"
          style={{ backgroundColor: custom.bg || '#ffffff', color: custom.textColor || '#0f172a' }}
        >
          <div className="max-w-4xl mx-auto space-y-4">
            {custom.badge && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#dfa82e]/15 text-[#b88917] uppercase tracking-wider">
                {custom.badge}
              </span>
            )}
            <h2 className="text-3xl font-bold font-serif-title">{custom.title}</h2>
            {custom.subtitle && (
              <p className="text-lg text-slate-600 font-medium">{custom.subtitle}</p>
            )}
            {custom.content && (
              <div className="text-base text-slate-700 leading-relaxed pt-2">
                {custom.content}
              </div>
            )}
          </div>
        </section>
      );
    }

    // Default / Banner component
    return (
      <section
        id={custom.id}
        className="py-16 px-6 sm:px-12 border-b border-gray-100 relative"
        style={{ backgroundColor: custom.bg || '#ffffff', color: custom.textColor || '#0f172a' }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-4">
          {custom.badge && (
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#b88917]/15 text-[#b88917]">
              {custom.badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-title">{custom.title}</h2>
          {custom.subtitle && (
            <p className="text-base text-slate-600 max-w-2xl mx-auto">{custom.subtitle}</p>
          )}
          {custom.content && (
            <div className="text-sm text-slate-700 max-w-3xl mx-auto leading-relaxed">{custom.content}</div>
          )}
          {custom.image && (
            <div className="max-w-3xl mx-auto mt-6 rounded-xl overflow-hidden shadow-lg">
              <img src={custom.image} alt={custom.title} className="w-full h-auto object-cover" />
            </div>
          )}
          {custom.buttonText && (
            <div className="pt-4">
              <a
                href={custom.buttonUrl || '#'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#b88917] text-[#0a1420] rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110"
              >
                <span>{custom.buttonText}</span>
              </a>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Helper to render section component by ID
  const renderSectionById = (secId: string) => {
    if (secId === 'hero') return <Hero />;
    if (secId === 'trust-stats') return <TrustStatsBanner />;
    if (secId === 'about') return <AboutSection showMoreLink={true} />;
    if (secId === 'services') return <ServicesSection />;
    if (secId === 'retainer') return <RetainerSection />;
    if (secId === 'team') return <TeamSection />;
    if (secId === 'insights') return <InsightsSection />;
    if (secId === 'faq') return <FAQSection />;
    if (secId === 'contact') return <ContactSection />;

    // Custom section
    if (secId.startsWith('custom-div-')) {
      const custom = (content?.customSections || []).find((c: any) => c.id === secId);
      return renderCustomSection(custom);
    }

    return null;
  };

  const getSectionTitle = (secId: string) => {
    if (SECTION_METADATA[secId]) {
      return SECTION_METADATA[secId].name;
    }
    const custom = (content?.customSections || []).find((c: any) => c.id === secId);
    return custom?.title || 'Komponen Kustom';
  };

  const getSectionIcon = (secId: string) => {
    if (SECTION_METADATA[secId]) {
      return SECTION_METADATA[secId].icon;
    }
    return '🧩';
  };

  return (
    <div className="w-full bg-white text-slate-900 overflow-x-hidden min-h-screen flex flex-col justify-between">
      {/* Website Global Navbar */}
      <Navbar />

      {/* PAGE SWITCHER VIEW */}
      <main className="flex-1">
        {/* 1. BERANDA (HOME) */}
        {currentPage === 'home' && (
          <div className="flex flex-col">
            {sectionsToRender.map((secId: string, idx: number) => {
              const isHidden = content?.hiddenSections?.includes(secId);
              if (isHidden && !isEditMode) return null;

              const secName = getSectionTitle(secId);
              const secIcon = getSectionIcon(secId);

              return (
                <div key={secId} id={`canva-wrapper-${secId}`} className="relative group/canvasection">
                  {/* CANVA DROPZONE & HEADER (Hanya Tampil Saat Mode Editor Canva) */}
                  {isEditMode && (
                    <div 
                      data-canva-bar="true"
                      className="bg-[#111624] border-y border-[#3b4461] select-none py-1.5 px-4 flex flex-col gap-1.5 transition-all z-20"
                    >
                      {/* Canva Interactive Dropzone (Sebelum Halaman Ini) */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('bg-purple-600/30', 'border-purple-400', 'scale-[1.01]');
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('bg-purple-600/30', 'border-purple-400', 'scale-[1.01]');
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('bg-purple-600/30', 'border-purple-400', 'scale-[1.01]');
                          let compType = '';
                          try {
                            const raw = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
                            if (raw) {
                              const data = JSON.parse(raw);
                              compType = data.componentType;
                            }
                          } catch (_) {}
                          if (!compType && (window as any).parent?.__draggedComponentType) {
                            compType = (window as any).parent.__draggedComponentType;
                          }
                          window.parent.postMessage({
                            type: 'INSERT_COMPONENT_BEFORE',
                            targetSectionId: secId,
                            componentType: compType || 'banner',
                          }, '*');
                        }}
                        onClick={() => {
                          window.parent.postMessage({
                            type: 'OPEN_INSERT_MODAL_BEFORE',
                            targetSectionId: secId,
                          }, '*');
                        }}
                        className="border-2 border-dashed border-purple-500/40 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-900/30 rounded-lg py-1.5 px-3 text-center transition-all cursor-pointer flex items-center justify-center gap-2 group"
                        title="Tarik komponen ke sini atau klik untuk menyisipkan div"
                      >
                        <Plus className="w-3.5 h-3.5 text-purple-400 group-hover:scale-125 transition-transform" />
                        <span className="text-purple-300 group-hover:text-purple-200 text-xs font-semibold">
                          Tarik Komponen ke Sini atau Klik untuk Sisipkan Sebelum: <strong className="text-white">{secName}</strong>
                        </span>
                      </div>

                      {/* Canva Page Header Bar */}
                      <div className="flex items-center justify-between text-xs text-slate-200 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                            Halaman {idx + 1}
                          </span>
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <span>{secIcon}</span>
                            <span>{secName}</span>
                          </span>
                          {isHidden && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                              Tersembunyi
                            </span>
                          )}
                        </div>

                        {/* Canva Quick Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => window.parent.postMessage({ type: 'MOVE_SECTION_UP', sectionId: secId }, '*')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 transition-colors"
                            title="Geser Halaman ke Atas"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => window.parent.postMessage({ type: 'MOVE_SECTION_DOWN', sectionId: secId }, '*')}
                            disabled={idx === sectionsToRender.length - 1}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 transition-colors"
                            title="Geser Halaman ke Bawah"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => window.parent.postMessage({ type: 'OPEN_INSERT_MODAL_BEFORE', targetSectionId: secId }, '*')}
                            className="px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[11px] font-bold flex items-center gap-1 border border-purple-500/30 transition-colors"
                            title="Sisipkan Komponen Sebelum Ini"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Sisipkan Sebelum</span>
                          </button>
                          <button
                            onClick={() => window.parent.postMessage({ type: 'DELETE_SECTION', sectionId: secId }, '*')}
                            className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors"
                            title="Hapus / Sembunyikan Halaman Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Konten Komponen / Seksi Asli */}
                  {!isHidden && renderSectionById(secId)}
                </div>
              );
            })}

            {/* Dropzone Paling Bawah Halaman */}
            {isEditMode && (
              <div 
                data-canva-bar="true"
                className="p-6 bg-slate-900/50"
              >
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-purple-600/30', 'border-purple-400');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-purple-600/30', 'border-purple-400');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-purple-600/30', 'border-purple-400');
                    let compType = '';
                    try {
                      const raw = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
                      if (raw) {
                        const data = JSON.parse(raw);
                        compType = data.componentType;
                      }
                    } catch (_) {}
                    if (!compType && (window as any).parent?.__draggedComponentType) {
                      compType = (window as any).parent.__draggedComponentType;
                    }
                    window.parent.postMessage({
                      type: 'INSERT_COMPONENT_BEFORE',
                      targetSectionId: '__end__',
                      componentType: compType || 'banner',
                    }, '*');
                  }}
                  onClick={() => {
                    window.parent.postMessage({
                      type: 'OPEN_INSERT_MODAL_BEFORE',
                      targetSectionId: '__end__',
                    }, '*');
                  }}
                  className="border-2 border-dashed border-purple-500/40 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-900/30 rounded-xl py-4 px-4 text-center transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-4 h-4 text-purple-400 group-hover:scale-125 transition-transform" />
                  <span className="text-purple-300 font-bold text-xs uppercase tracking-wider">
                    + Letakkan Komponen di Sini (Paling Bawah Halaman)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. TENTANG KAMI */}
        {currentPage === 'about' && (
          <div className="min-h-screen bg-white">
            <div className="bg-slate-50 border-b border-gray-200/80 py-16 lg:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gold-accent font-semibold">Tentang Kami</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    <EditableText
                      fieldPath="about.badge"
                      fallback="PROFIL KONSULTAN SELECO"
                      label="Badge Tentang Kami"
                    />
                  </div>
                  <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    <EditableText
                      fieldPath="about.title"
                      fallback="Dedikasi pada Integritas & Keunggulan Strategis"
                      label="Judul Header Tentang Kami"
                    />
                  </h1>
                  <div className="w-16 h-[3px] bg-gold-accent mt-3 mb-4 rounded-full" />
                  <p className="text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
                    <EditableText
                      fieldPath="about.paragraph1"
                      fallback="Mengenal lebih dekat visi, standar profesional, dan tim konsultan di balik SELECO (SEDANA LEGAL CONSULTANT) yang siap mendampingi pertumbuhan bisnis Anda di Indonesia melalui 5 pilar layanan konsultan terpadu."
                      label="Deskripsi Header Tentang Kami"
                      multiline={true}
                    />
                  </p>
                </div>
              </div>
            </div>

            <AboutSection />
            <RetainerSection />

            {/* Custom components on about page */}
            {content?.customSections?.filter((c: any) => c.page === 'about').map((custom: any) => renderCustomSection(custom))}

            {/* CTA Footer Banner */}
            <div className="py-20 bg-slate-50 border-t border-gray-200/80 text-center">
              <div className="max-w-3xl mx-auto px-4">
                <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                  Siap Berdiskusi Mengenai Kebutuhan Bisnis &amp; Korporasi Anda?
                </h2>
                <p className="text-base text-slate-600 mb-8 font-normal">
                  Jadwalkan konsultasi awal dengan tim konsultan kami secara tatap muka ataupun virtual.
                </p>
                <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md cursor-pointer">
                  <span>Hubungi Tim Kami Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. LAYANAN */}
        {currentPage === 'services' && (
          <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-gray-200/80 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gold-accent font-semibold">Direktori Layanan</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-3">
                      <Building2 className="w-3.5 h-3.5" />
                      <EditableText
                        fieldPath="services.badge"
                        fallback="5 PILAR LAYANAN KONSULTAN TERPADU"
                        label="Badge Layanan"
                      />
                    </div>
                    <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                      <EditableText
                        fieldPath="services.title"
                        fallback="Konsultan Perizinan, Imigrasi, Pajak, Pertanahan & SDM"
                        label="Judul Halaman Layanan"
                      />
                    </h1>
                    <div className="w-16 h-[3px] bg-gold-accent mt-3 mb-4 rounded-full" />
                    <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                      <EditableText
                        fieldPath="services.subtitle"
                        fallback={`Direktori komprehensif mencakup ${totalServices} Layanan Konsultan Spesialis: Perizinan Usaha OSS RBA, Keimigrasian & TKA, Perpajakan Korporasi, Pertanahan BPN, serta Manajemen & Ketenagakerjaan SDM.`}
                        label="Subjudul Halaman Layanan"
                        multiline={true}
                      />
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-center shrink-0">
                    <div className="bg-slate-50 border border-gray-200 rounded-2xl px-8 py-4 shadow-sm">
                      <p className="font-serif-title text-4xl font-bold text-gold-accent">
                        <EditableText
                          fieldPath="global.totalServices"
                          fallback={totalServices}
                          label="Jumlah Total Layanan"
                        />
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Total Layanan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Grid Section */}
            <ServicesSection />
            <RetainerSection />

            {/* Custom components on services page */}
            {content?.customSections?.filter((c: any) => c.page === 'services').map((custom: any) => renderCustomSection(custom))}
          </div>
        )}

        {/* 4. INSIGHT */}
        {currentPage === 'insight' && (
          <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-gray-200/80 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gold-accent font-semibold">Insight</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-3">
                    <BookOpen className="w-3.5 h-3.5" />
                    <EditableText
                      fieldPath="insights.badge"
                      fallback="PUBLIKASI EDITORIAL & REGULASI"
                      label="Badge Insight"
                    />
                  </div>
                  <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    <EditableText
                      fieldPath="insights.title"
                      fallback="Insight & Analisis Regulasi Bisnis"
                      label="Judul Halaman Insight"
                    />
                  </h1>
                  <div className="w-16 h-[3px] bg-gold-accent mt-3 mb-4 rounded-full" />
                  <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                    <EditableText
                      fieldPath="insights.subtitle"
                      fallback="Perspektif strategis dan regulasi dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur dan aman dari risiko operasional."
                      label="Subjudul Halaman Insight"
                      multiline={true}
                    />
                  </p>
                </div>
              </div>
            </div>

            <InsightsSection />

            {/* Custom components on insight page */}
            {content?.customSections?.filter((c: any) => c.page === 'insight').map((custom: any) => renderCustomSection(custom))}
          </div>
        )}

        {/* 5. KONTAK */}
        {currentPage === 'contact' && (
          <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-gray-200/80 py-16 lg:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gold-accent font-semibold">Kontak</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-3">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <EditableText
                      fieldPath="contact.badge"
                      fallback="PUSAT KOMUNIKASI & KONSULTASI"
                      label="Badge Kontak"
                    />
                  </div>
                  <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    <EditableText
                      fieldPath="contact.title"
                      fallback="Konsultasi Perizinan & Layanan Korporasi"
                      label="Judul Halaman Kontak"
                    />
                  </h1>
                  <div className="w-16 h-[3px] bg-gold-accent mt-3 mb-4 rounded-full" />
                  <p className="text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
                    <EditableText
                      fieldPath="contact.subtitle"
                      fallback="Diskusikan perizinan usaha, keimigrasian, perpajakan, pertanahan, atau manajemen SDM perusahaan Anda bersama konsultan profesional Seleco."
                      label="Subjudul Halaman Kontak"
                      multiline={true}
                    />
                  </p>
                </div>
              </div>
            </div>

            <ContactSection />
            <FAQSection />

            {/* Custom components on contact page */}
            {content?.customSections?.filter((c: any) => c.page === 'contact').map((custom: any) => renderCustomSection(custom))}
          </div>
        )}
      </main>

      {/* Website Global Footer */}
      <Footer />
    </div>
  );
}

export default function AdminPreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat tampilan halaman...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
