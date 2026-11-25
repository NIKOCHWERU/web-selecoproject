'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search, Phone } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection, EditableIcon } from './EditableElement';

export default function ServicesSection() {
  const { content } = useContent();
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const services = content?.services;
  const global = content?.global;
  const totalServices = global?.totalServices || '445+';
  const waNum = global?.whatsappNumber || '6282211020022';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/layanan?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/layanan');
    }
  };

  const defaultPillars = [
    {
      id: 'perizinan',
      name: 'Konsultan Perizinan',
      count: '242 Layanan',
      description: 'Pendirian PT, CV, dan PMA; NIB dan Sertifikat Standar OSS RBA; PB UMKU; izin sektoral, BPOM, Halal, dan SNI.',
      linkText: 'Lihat 242 Layanan Perizinan',
      linkUrl: '/layanan?cat=perizinan',
      iconName: 'FileCheck',
    },
    {
      id: 'imigrasi',
      name: 'Konsultan Imigrasi',
      count: '36 Layanan',
      description: 'Visa bisnis dan investor, KITAS/ITAS kerja, ITAP, RPTKA, paspor, dan dokumen keimigrasian WNA.',
      linkText: 'Lihat 36 Layanan Imigrasi',
      linkUrl: '/layanan?cat=imigrasi',
      iconName: 'Globe',
    },
    {
      id: 'pajak',
      name: 'Konsultan Pajak',
      count: '86 Layanan',
      description: 'Perencanaan pajak badan, SPT Masa dan Tahunan, restitusi, serta pendampingan pemeriksaan pajak.',
      linkText: 'Lihat 86 Layanan Pajak',
      linkUrl: '/layanan?cat=pajak',
      iconName: 'Receipt',
    },
    {
      id: 'pertanahan',
      name: 'Konsultan Pertanahan',
      count: '45 Layanan',
      description: 'Sertifikat SHM, HGB, HGU; pengecekan keabsahan; balik nama; roya hak tanggungan; KKPR; PBG dan SLF.',
      linkText: 'Lihat 45 Layanan Pertanahan',
      linkUrl: '/layanan?cat=pertanahan',
      iconName: 'Landmark',
    },
    {
      id: 'sdm',
      name: 'Konsultan SDM',
      count: '36 Layanan',
      description: 'Peraturan Perusahaan, PKB, struktur dan skala upah, kontrak PKWT/PKWTT, kepatuhan BPJS, dan audit ketenagakerjaan.',
      linkText: 'Lihat 36 Layanan SDM',
      linkUrl: '/layanan?cat=sdm',
      iconName: 'Users',
    },
  ];

  const pillars: any[] =
    services?.pillars && services.pillars.length > 0 ? services.pillars : defaultPillars;

  const defaultPillarImages = [
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <EditableSection id="services" name="Layanan & Spesialisasi Section" className="bg-white text-[#0a1420]">
      {/* Web NH Features Grid */}
      <div className="py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#b88917] text-xs font-bold uppercase tracking-widest mb-3">
              <EditableText
                fieldPath="services.badge"
                fallback="Bidang Praktik"
                label="Badge Layanan"
              />
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-3 uppercase tracking-wide text-[#0a1420]">
              <EditableText
                fieldPath="services.title"
                fallback="Lima Bidang, Satu Solusi Terintegrasi"
                label="Judul Layanan"
              />
            </h2>
            <div className="w-16 h-1 bg-[#dfa82e] mx-auto mb-4" />
            <p className="text-sm md:text-base max-w-2xl mx-auto text-gray-600 mb-6">
              <EditableText
                fieldPath="services.subtitle"
                fallback="Kebutuhan legal perusahaan saling terkait. Karena itu kami menanganinya bersama, bukan terpisah-pisah."
                label="Subjudul Layanan"
                multiline={true}
              />
            </p>
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 bg-[#0a1420] text-white hover:bg-[#dfa82e] hover:text-[#0a1420] px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
            >
              <span>Lihat Semua Layanan</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((cat, idx) => {
              const fallbackLink = cat.linkUrl || `/layanan?cat=${cat.id}`;
              const currentLink = services?.pillars?.[idx]?.linkUrl || fallbackLink;
              const cardImg = cat.image || defaultPillarImages[idx % defaultPillarImages.length];

              return (
                <div
                  key={cat.id || idx}
                  className="relative group overflow-hidden rounded-2xl shadow-lg border border-gray-200 h-[340px] flex flex-col justify-end text-left bg-[#0a1420]"
                >
                  {/* Background image with Web NH dark gradient */}
                  <div className="absolute inset-0">
                    <img
                      src={cardImg}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420] via-[#0a1420]/85 to-[#0a1420]/35" />
                  </div>

                  {/* Top-Right Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#0a1420]/90 border border-[#dfa82e]/40 text-[#dfa82e] text-[10px] font-bold tracking-wider uppercase shadow-md">
                      <EditableText
                        fieldPath={`services.pillars.${idx}.count`}
                        fallback={cat.count || '242 Layanan'}
                        label={`Jumlah ${cat.name}`}
                      />
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 p-6 flex flex-col justify-end text-white">
                    <div className="w-10 h-10 rounded-xl bg-[#dfa82e]/20 text-[#dfa82e] flex items-center justify-center mb-3 border border-[#dfa82e]/30">
                      <EditableIcon
                        iconKey={`services.pillars.${idx}.icon`}
                        fallbackIcon={cat.iconName || 'FileCheck'}
                        className="w-5 h-5"
                        label={`Ikon Pilar ${idx + 1}`}
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-sans">
                      <EditableText
                        fieldPath={`services.pillars.${idx}.name`}
                        fallback={cat.name}
                        label={`Nama Pilar ${idx + 1}`}
                        as="span"
                      />
                    </h3>
                    <div className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-light mb-3">
                      <EditableText
                        fieldPath={`services.pillars.${idx}.description`}
                        fallback={cat.description}
                        label={`Deskripsi Pilar ${idx + 1}`}
                        multiline={true}
                        as="p"
                      />
                    </div>
                    <div className="w-8 h-0.5 bg-[#dfa82e] mb-3" />
                    <Link
                      href={currentLink}
                      onClick={(e) => {
                        if (isEditMode) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#dfa82e] hover:text-white uppercase tracking-wider transition-colors"
                    >
                      <EditableText
                        fieldPath={`services.pillars.${idx}.linkText`}
                        fallback={cat.linkText || 'Lihat Layanan'}
                        label={`Link Pilar ${idx + 1}`}
                        linkPath={`services.pillars.${idx}.linkUrl`}
                        fallbackLink={fallbackLink}
                      />
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Web NH Interactive Directory Search Banner (SELECO Navy & Gold Palette) */}
      <div className="py-12 bg-[#0f2034] border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-[#0a1420] text-white rounded-2xl p-6 md:p-8 border border-[#dfa82e]/30 shadow-2xl text-left">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
                  <Search size={13} />
                  Direktori Lengkap &amp; Pencarian Terpadu
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  <EditableText
                    fieldPath="services.ctaBannerTitle"
                    fallback="Kasus Anda Butuh Penanganan Khusus?"
                    label="Judul Banner CTA Layanan"
                  />
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  <EditableText
                    fieldPath="services.ctaBannerSubtitle"
                    fallback="Kirim ringkasan bidang usaha dan lokasi proyek Anda. Kami cek KBLI dan instansi terkait, lalu beri langkah paling efektif."
                    label="Subjudul Banner CTA Layanan"
                    multiline={true}
                  />
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto lg:min-w-[430px]">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari layanan (misal: OSS, KITAS, SPT, PBG, PKB)..."
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#142740] border border-white/15 focus:border-[#dfa82e] text-white placeholder-slate-400 focus:outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-[#dfa82e] text-[#0a1420] hover:bg-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer"
                  >
                    <Search size={15} />
                    Cari Layanan
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-3 text-xs">
              <span className="text-slate-300">
                Tersedia {totalServices} Layanan di 5 Bidang Praktik (242 Perizinan · 36 Imigrasi · 86 Pajak · 45 Pertanahan · 36 SDM)
              </span>
              <a
                href={`https://wa.me/${waNum}?text=${encodeURIComponent('Halo SELECO, saya ingin berkonsultasi mengenai kebutuhan perizinan dan layanan korporasi.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#dfa82e] hover:text-white font-bold uppercase tracking-wider"
              >
                <Phone size={14} />
                <EditableText
                  fieldPath="services.ctaBannerButtonText"
                  fallback="Chat Konsultan via WhatsApp"
                  label="Tombol Banner CTA Layanan"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </EditableSection>
  );
}
