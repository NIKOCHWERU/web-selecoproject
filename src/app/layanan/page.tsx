'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X, Briefcase, ChevronRight, Filter, Grid, List, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import {
  SERVICE_CATEGORIES,
  KONSULTAN_SDM_ITEMS,
  PERIZINAN_LEGALITAS_ITEMS,
  ServiceItem,
} from '@/data/layananData';

function getBadgeInfo(type: ServiceItem['type']) {
  switch (type) {
    case 'perizinan':
      return { label: 'Perizinan', badgeClass: 'bg-gold-soft text-gold-accent border border-gold-accent/30' };
    case 'imigrasi':
      return { label: 'Imigrasi', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200' };
    case 'pajak':
      return { label: 'Pajak', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' };
    case 'pertanahan':
      return { label: 'Pertanahan', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200' };
    case 'sdm':
      return { label: 'SDM', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200' };
    default:
      return { label: 'Konsultan', badgeClass: 'bg-navy-deep text-gold-accent' };
  }
}

function LayananContent() {
  const { content } = useContent();
  const totalServices = content?.global?.totalServices || content?.hero?.stat2Number || '445+';
  const litigationCount = content?.global?.litigationCount || '34';
  const ossLicenseCount = content?.global?.ossLicenseCount || '411+';

  const searchParams = useSearchParams();
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sync URL param
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCat(cat);
  }, [searchParams]);

  const allItems: ServiceItem[] = useMemo(
    () => [...KONSULTAN_SDM_ITEMS, ...PERIZINAN_LEGALITAS_ITEMS],
    []
  );

  const filtered = useMemo(() => {
    let items = allItems;

    if (activeCat !== 'all') {
      items = allItems.filter(item => item.type === activeCat);
    }

    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeCat, searchQuery, allItems]);

  const currentCatData = SERVICE_CATEGORIES.find(c => c.id === activeCat);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* Page Hero Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-[#b88917] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#b88917] font-semibold">Direktori Layanan</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfa82e]/15 border border-[#dfa82e]/35 rounded-full text-[#b88917] text-[10px] font-bold uppercase tracking-widest mb-2.5">
                <Building2 className="w-3.5 h-3.5" /> 5 PILAR LAYANAN KONSULTAN TERPADU
              </div>
              <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-[#0a1420] leading-tight">
                Konsultan Perizinan, Imigrasi, Pajak, Pertanahan &amp; SDM
              </h1>
              <div className="w-12 h-0.5 bg-[#dfa82e] mt-2.5 mb-3 rounded-full" />
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
                Direktori komprehensif mencakup <strong className="text-[#0a1420] font-semibold">{totalServices} Layanan Konsultan Spesialis</strong>: Perizinan Usaha OSS RBA, Keimigrasian &amp; TKA, Perpajakan Korporasi, Pertanahan BPN, serta Manajemen &amp; Ketenagakerjaan SDM.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-center shrink-0">
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-3 shadow-xs">
                <p className="font-serif-title text-2xl sm:text-3xl font-bold text-[#b88917]">{totalServices}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Total Layanan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* === LEFT SIDEBAR: Category Filter === */}
          <aside className="xl:w-72 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl sticky top-24 text-slate-900 overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <p className="text-xs font-bold text-[#0a1420] uppercase tracking-widest flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#b88917]" /> Filter Kategori
                </p>
              </div>
              <nav className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); setSearchQuery(''); }}
                    className={`w-full flex items-start justify-between gap-2 px-4 py-3 text-left transition-all text-xs cursor-pointer ${
                      activeCat === cat.id
                        ? 'bg-[#dfa82e]/15 border-l-2 border-[#dfa82e] text-[#b88917] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#0a1420]'
                    }`}
                  >
                    <span className="leading-snug font-semibold">{cat.id === 'all' ? `Semua Layanan (${totalServices})` : cat.name}</span>
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${activeCat === cat.id ? 'bg-[#b88917] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {cat.id === 'all' ? totalServices : cat.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* === MAIN CONTENT: Search + Items === */}
          <div className="flex-1 min-w-0">

            {/* Search & View Controls */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari layanan perizinan, imigrasi, pajak, pertanahan, atau SDM..."
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#b88917] text-slate-900 placeholder-slate-400 transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#0a1420] text-white border-[#0a1420]' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${viewMode === 'list' ? 'bg-[#0a1420] text-white border-[#0a1420]' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Title & Description */}
            {currentCatData && (
              <div className="mb-6 p-5 bg-slate-50 border border-slate-200 border-l-4 border-l-[#dfa82e] rounded-xl shadow-xs">
                <h2 className="font-serif-title text-xl font-bold text-[#0a1420] mb-1">{currentCatData.name}</h2>
                <p className="text-xs text-slate-600">{currentCatData.description}</p>
                <p className="text-xs text-[#b88917] font-bold mt-2">
                  Menampilkan {filtered.length} dari {currentCatData.count} layanan
                  {searchQuery && ` - cocok dengan "${searchQuery}"`}
                </p>
              </div>
            )}

            {/* Results Count */}
            <p className="text-xs text-slate-500 mb-4 font-semibold">
              {filtered.length} Layanan Ditemukan
            </p>

            {/* Items - Grid Mode */}
            {filtered.length === 0 && (
              <div className="text-center py-20 text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#b88917]" />
                <p className="font-serif-title text-xl font-bold mb-1 text-[#0a1420]">Tidak Ada Hasil</p>
                <p className="text-sm text-slate-500">Coba kata kunci lain atau pilih kategori berbeda.</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filtered.map((item, idx) => {
                    const badge = getBadgeInfo(item.type);
                    return (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3) }}
                        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#dfa82e]/60 hover:shadow-sm transition-all group flex flex-col justify-between shadow-xs"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${badge.badgeClass}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold shrink-0">#{item.id}</span>
                          </div>
                          <h3 className="text-sm font-bold text-[#0a1420] leading-snug mb-1 group-hover:text-[#b88917] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[10px] text-slate-500 font-semibold">{item.category}</p>
                        </div>
                        <Link
                          href="/kontak"
                          className="mt-3 text-xs font-bold text-[#b88917] border-t border-slate-100 pt-2.5 flex items-center gap-1 hover:text-[#0a1420] transition-colors"
                        >
                          Konsultasikan <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-xs"
                >
                  {filtered.map((item, idx) => {
                    const badge = getBadgeInfo(item.type);
                    return (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: Math.min(idx * 0.01, 0.2) }}
                        className="flex items-start gap-4 px-4 py-3.5 hover:bg-slate-50 transition-all group"
                      >
                        <span className="text-xs text-slate-400 font-bold w-7 shrink-0 pt-0.5">
                          {String(item.id).padStart(3, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0a1420] group-hover:text-[#b88917] transition-colors leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badge.badgeClass}`}>
                            {badge.label}
                          </span>
                          <Link href="/kontak" className="text-[10px] font-bold text-[#b88917] hover:text-[#0a1420] transition-colors whitespace-nowrap">
                            Konsultasi →
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Banner */}
            {filtered.length > 0 && (
              <div className="mt-12 p-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-900 shadow-xs">
                <div>
                  <h3 className="font-serif-title text-2xl font-bold text-[#0a1420]">Tidak menemukan yang Anda cari?</h3>
                  <p className="text-xs text-slate-600 mt-1">Tim SELECO siap mendiskusikan kebutuhan konsultan perizinan, imigrasi, pajak, pertanahan, dan SDM perusahaan Anda.</p>
                </div>
                <Link
                  href="/kontak"
                  className="px-7 py-3.5 bg-[#0a1420] text-white hover:bg-[#b88917] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-white" /> Hubungi Kami
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function LayananPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">Memuat Layanan...</div>}>
      <LayananContent />
    </Suspense>
  );
}
