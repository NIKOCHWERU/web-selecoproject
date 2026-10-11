'use client';

import React from 'react';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import { defaultSectionOrder } from '@/data/defaultSiteContent';

import Hero from '@/components/Hero';
import TrustStatsBanner from '@/components/TrustStatsBanner';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import RetainerSection from '@/components/RetainerSection';
import TeamSection from '@/components/TeamSection';
import InsightsSection from '@/components/InsightsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import { Calendar, ArrowRight, MessageCircle } from 'lucide-react';

export default function HomeDynamicSections() {
  const { content } = useContent();

  const order = content?.sectionOrder?.home || defaultSectionOrder.home;
  const customHome = (content?.customSections || []).filter((c: any) => !c.page || c.page === 'home');

  // Combine custom sections into order if not yet listed
  const combinedOrder = [...order];
  customHome.forEach((c: any) => {
    if (!combinedOrder.includes(c.id)) {
      combinedOrder.push(c.id);
    }
  });

  const renderCustom = (custom: any) => {
    if (!custom) return null;

    const containerStyle: React.CSSProperties = {
      backgroundColor: custom.bg || '#ffffff',
      color: custom.textColor || '#0f172a',
      paddingTop: custom.paddingY || undefined,
      paddingBottom: custom.paddingY || undefined,
      paddingLeft: custom.paddingX || undefined,
      paddingRight: custom.paddingX || undefined,
      marginTop: custom.marginY || undefined,
      marginBottom: custom.marginY || undefined,
      textAlign: custom.textAlign || undefined,
      borderRadius: custom.borderRadius || undefined,
      borderWidth: custom.borderWidth ? `${custom.borderWidth}px` : undefined,
      borderColor: custom.borderColor || undefined,
      borderStyle: custom.borderWidth ? 'solid' : undefined,
      boxShadow: custom.boxShadow || undefined,
      backgroundImage: custom.bgImage ? `url(${custom.bgImage})` : undefined,
      backgroundSize: custom.bgImage ? 'cover' : undefined,
      backgroundPosition: custom.bgImage ? 'center' : undefined,
    };

    const titleStyle: React.CSSProperties = {
      fontSize: custom.fontSize || undefined,
      fontWeight: custom.fontWeight || undefined,
      fontFamily: custom.fontFamily === 'serif' ? 'Cinzel, serif' : undefined,
      lineHeight: custom.lineHeight || undefined,
    };

    const maxContainerWidth = custom.maxWidth || '1152px';

    if (custom.type === 'cta') {
      return (
        <section
          key={custom.id}
          id={custom.id}
          className="py-20 px-6 sm:px-12 border-b border-gray-100 relative overflow-hidden transition-all"
          style={containerStyle}
        >
          <div style={{ maxWidth: maxContainerWidth }} className="mx-auto text-center space-y-6 relative z-10">
            {custom.badge && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#dfa82e]/20 text-[#dfa82e] border border-[#dfa82e]/40">
                <MessageCircle className="w-3.5 h-3.5" />
                {custom.badge}
              </span>
            )}
            <h2 style={titleStyle} className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-title leading-tight">
              {custom.title}
            </h2>
            {custom.subtitle && (
              <p className="text-base sm:text-lg opacity-85 max-w-2xl mx-auto leading-relaxed">
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
          key={custom.id}
          id={custom.id}
          className="py-20 px-6 sm:px-12 border-b border-gray-100 transition-all"
          style={containerStyle}
        >
          <div style={{ maxWidth: maxContainerWidth }} className="mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              {custom.badge && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#dfa82e]/15 text-[#b88917] uppercase tracking-wider">
                  {custom.badge}
                </span>
              )}
              <h2 style={titleStyle} className="text-3xl font-bold font-serif-title">{custom.title}</h2>
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
          key={custom.id}
          id={custom.id}
          className="py-16 px-6 sm:px-12 border-b border-gray-100 transition-all"
          style={containerStyle}
        >
          <div style={{ maxWidth: maxContainerWidth }} className="mx-auto space-y-4">
            {custom.badge && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#dfa82e]/15 text-[#b88917] uppercase tracking-wider">
                {custom.badge}
              </span>
            )}
            <h2 style={titleStyle} className="text-3xl font-bold font-serif-title">{custom.title}</h2>
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

    return (
      <section
        key={custom.id}
        id={custom.id}
        className="py-16 px-6 sm:px-12 border-b border-gray-100 relative transition-all"
        style={containerStyle}
      >
        <div style={{ maxWidth: maxContainerWidth }} className="mx-auto text-center space-y-4">
          {custom.badge && (
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-[#b88917]/15 text-[#b88917]">
              {custom.badge}
            </span>
          )}
          <h2 style={titleStyle} className="text-3xl sm:text-4xl font-bold font-serif-title">{custom.title}</h2>
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

  const renderSection = (secId: string) => {
    if (content?.hiddenSections?.includes(secId)) return null;

    if (secId === 'hero') return <Hero key="hero" />;
    if (secId === 'trust-stats') return <TrustStatsBanner key="trust-stats" />;
    if (secId === 'about') return <AboutSection key="about" showMoreLink={true} />;
    if (secId === 'services') return <ServicesSection key="services" />;
    if (secId === 'retainer') return <RetainerSection key="retainer" />;
    if (secId === 'team') return <TeamSection key="team" />;
    if (secId === 'insights') return <InsightsSection key="insights" />;
    if (secId === 'faq') return <FAQSection key="faq" />;
    if (secId === 'contact') return <ContactSection key="contact" />;

    if (secId.startsWith('custom-div-')) {
      const custom = customHome.find((c: any) => c.id === secId);
      return renderCustom(custom);
    }

    return null;
  };

  return (
    <>
      {combinedOrder.map((secId) => renderSection(secId))}
    </>
  );
}
