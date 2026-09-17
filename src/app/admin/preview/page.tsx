'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useContent } from '@/context/ContentContext';

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
  Clock
} from 'lucide-react';
import { SERVICE_CATEGORIES, KONSULTAN_SDM_ITEMS, PERIZINAN_LEGALITAS_ITEMS } from '@/data/layananData';

export type PreviewPageId = 'home' | 'about' | 'services' | 'insight' | 'contact';

function PreviewContent() {
  const { content, setContent } = useContent();
  const searchParams = useSearchParams();
  const initialPage = (searchParams.get('page') as PreviewPageId) || 'home';
  const [currentPage, setCurrentPage] = useState<PreviewPageId>(initialPage);

  useEffect(() => {
    const pageParam = searchParams.get('page') as PreviewPageId;
    if (pageParam) {
      setCurrentPage(pageParam);
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

  // Global click & navigation interceptor in capture phase
  // When in visual edit mode ('click_to_edit'), disable all link & button clicks so elements can be edited safely!
  useEffect(() => {
    const handleCaptureClick = (e: MouseEvent) => {
      const isEditMode = sessionStorage.getItem('seleco_editor_mode') === 'click_to_edit';
      if (!isEditMode) return;

      const target = e.target as HTMLElement;

      // Allow clicks on active toolbars, popups, color pickers, inputs, textareas, and select elements
      if (
        target.closest('[data-toolbar]') ||
        target.closest('[data-editable-toolbar]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('button[data-action]') ||
        target.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // If clicked element is or is inside an anchor (<a>) or button (<button>)
      const anchor = target.closest('a');
      const button = target.closest('button');

      if (anchor || button) {
        // PREVENT ALL NAVIGATION, JUMPING, OR SUBMIT ACTIONS
        e.preventDefault();
        e.stopPropagation();

        // If there's an editable text inside, focus it so the user can immediately type!
        const editableText = (anchor || button)?.querySelector('[contenteditable="true"]') as HTMLElement;
        if (editableText) {
          editableText.focus();
        }
      }
    };

    // Use capture phase (third argument = true) to intercept BEFORE any React/Next.js Link or button click handlers!
    window.addEventListener('click', handleCaptureClick, true);

    return () => {
      window.removeEventListener('click', handleCaptureClick, true);
    };
  }, []);

  const totalServices = content?.global?.totalServices || content?.hero?.stat2Number || '445+';

  return (
    <div className="w-full bg-white text-slate-900 overflow-x-hidden min-h-screen flex flex-col justify-between">
      {/* Website Global Navbar */}
      <Navbar />

      {/* PAGE SWITCHER VIEW */}
      <main className="flex-1">
        {/* 1. BERANDA (HOME) */}
        {currentPage === 'home' && (
          <div>
            <Hero />
            <TrustStatsBanner />
            <AboutSection showMoreLink={true} />
            <ServicesSection />
            <RetainerSection />
            <TeamSection />
            <InsightsSection />
            <FAQSection />
            <ContactSection />
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
