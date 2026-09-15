'use client';

import React, { useEffect } from 'react';
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

export default function AdminPreviewPage() {
  const { setContent } = useContent();

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

  return (
    <div className="w-full bg-white text-slate-900 overflow-x-hidden">
      {/* Website Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <Hero />
      <TrustStatsBanner />
      <AboutSection showMoreLink={true} />
      <ServicesSection />
      <RetainerSection />
      <TeamSection />
      <InsightsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
