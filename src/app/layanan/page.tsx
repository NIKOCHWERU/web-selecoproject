'use client';

import { useState, useMemo, useEffect } from 'react';
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

export default function LayananPage() {
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
    <div className="min-h-screen bg-[#0a1420] text-slate-100">
      
      {/* Page Hero Banner */}
      <div className="bg-[#0f2034] border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dfa82e] font-semibold">Direktori Layanan</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#dfa82e]/10 border border-[#dfa82e]/30 rounded-full text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
                <Building2 className="w-3.5 h-3.5" /> 5 PILAR LAYANAN KONSULTAN TERPADU
              </div>
              <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Konsultan Perizinan, Imigrasi, Pajak, Pertanahan &amp; SDM
              </h1>
              <div className="w-16 h-[3px] bg-[#dfa82e] mt-3 mb-4 rounded-full" />
              <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
                Direktori komprehensif mencakup <strong className="text-white font-semibold">{totalServices} Layanan Konsultan Spesialis</strong>: Perizinan Usaha OSS RBA, Keimigrasian &amp; TKA, Perpajakan Korporasi, Pertanahan BPN, serta Manajemen &amp; Ketenagakerjaan SDM.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-center shrink-0">
              <div className="bg-[#0a1420] border border-white/10 rounded-2xl px-8 py-4 shadow-md">
                <p className="font-serif-title text-4xl font-bold text-[#dfa82e]">{totalServices}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Total Layanan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* === LEFT SIDEBAR: Category Filter === */}
          <aside className="xl:w-72 shrink-0">
            <div className="bg-[#0f2034] border border-white/10 rounded-xl sticky top-24 text-white overflow-hidden shadow-lg">
              <div className="px-4 py-3 border-b border-white/10 bg-[#0a1420]">
                <p className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#dfa82e]" /> Filter Kategori
                </p>
              </div>
              <nav className="divide-y divide-white/10 max-h-[70vh] overflow-y-auto">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); setSearchQuery(''); }}
                    className={`w-full flex items-start justify-between gap-2 px-4 py-3 text-left transition-all text-xs ${
                      activeCat === cat.id
                        ? 'bg-[#dfa82e]/15 border-l-2 border-[#dfa82e] text-[#dfa82e] font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="leading-snug font-semibold">{cat.id === 'all' ? `Semua Layanan (${totalServices})` : cat.name}</span>
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${activeCat === cat.id ? 'bg-[#dfa82e] text-[#0a1420]' : 'bg-white/10 text-white/70'}`}>
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
            <div className="bg-[#0f2034] border border-white/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center shadow-md">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari layanan perizinan, imigrasi, pajak, pertanahan, atau SDM..."
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-[#0a1420] border border-white/15 rounded-lg focus:outline-none focus:border-[#dfa82e] text-white placeholder-white/40 transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-white/40 hover:text-white" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg border transition-all ${viewMode === 'grid' ? 'bg-[#dfa82e] text-[#0a1420] border-[#dfa82e]' : 'border-white/15 text-white/60 hover:border-white/30'}`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg border transition-all ${viewMode === 'list' ? 'bg-[#dfa82e] text-[#0a1420] border-[#dfa82e]' : 'border-white/15 text-white/60 hover:border-white/30'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Title & Description */}
            {currentCatData && (
              <div className="mb-6 p-5 bg-[#0f2034] border border-white/10 border-l-4 border-l-[#dfa82e] rounded-xl shadow-md">
                <h2 className="font-serif-title text-xl font-bold text-white mb-1">{currentCatData.name}</h2>
                <p className="text-xs text-slate-300">{currentCatData.description}</p>
                <p className="text-xs text-[#dfa82e] font-bold mt-2">
                  Menampilkan {filtered.length} dari {currentCatData.count} layanan
                  {searchQuery && ` — cocok dengan "${searchQuery}"`}
                </p>
              </div>
            )}

            {/* Results Count */}
            <p className="text-xs text-white/60 mb-4 font-semibold">
              {filtered.length} Layanan Ditemukan
            </p>

            {/* Items — Grid Mode */}
            {filtered.length === 0 && (
              <div className="text-center py-20 text-white/40 bg-[#0f2034] border border-white/10 rounded-2xl p-8">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#dfa82e]" />
                <p className="font-serif-title text-xl font-bold mb-1 text-white">Tidak Ada Hasil</p>
                <p className="text-sm text-slate-400">Coba kata kunci lain atau pilih kategori berbeda.</p>
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
                        className="bg-[#0f2034] border border-white/10 rounded-xl p-5 hover:border-[#dfa82e]/50 hover:bg-[#13263c] transition-all group flex flex-col justify-between shadow-md"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${badge.badgeClass}`}>
                              {badge.label}
                            </span>
                            <span className="text-[10px] text-white/40 font-semibold shrink-0">#{item.id}</span>
                          </div>
                          <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-[#dfa82e] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-semibold">{item.category}</p>
                        </div>
                        <Link
                          href="/kontak"
                          className="mt-3 text-xs font-bold text-[#dfa82e] border-t border-white/10 pt-2.5 flex items-center gap-1 hover:text-white transition-colors group-hover:text-[#dfa82e]"
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
                  className="bg-[#0f2034] border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10 shadow-md"
                >
                  {filtered.map((item, idx) => {
                    const badge = getBadgeInfo(item.type);
                    return (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: Math.min(idx * 0.01, 0.2) }}
                        className="flex items-start gap-4 px-4 py-3.5 hover:bg-white/5 transition-all group"
                      >
                        <span className="text-xs text-white/40 font-bold w-7 shrink-0 pt-0.5">
                          {String(item.id).padStart(3, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white group-hover:text-[#dfa82e] transition-colors leading-snug">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badge.badgeClass}`}>
                            {badge.label}
                          </span>
                          <Link href="/kontak" className="text-[10px] font-bold text-[#dfa82e] hover:text-white transition-colors whitespace-nowrap">
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
              <div className="mt-12 p-8 bg-[#0f2034] border border-[#dfa82e]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-white shadow-xl">
                <div>
                  <h3 className="font-serif-title text-2xl font-bold text-white">Tidak menemukan yang Anda cari?</h3>
                  <p className="text-xs text-slate-300 mt-1">Tim SELECO siap mendiskusikan kebutuhan konsultan perizinan, imigrasi, pajak, pertanahan, dan SDM perusahaan Anda.</p>
                </div>
                <Link
                  href="/kontak"
                  className="px-7 py-3.5 bg-gradient-to-r from-gold-accent to-gold-bright text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all whitespace-nowrap flex items-center gap-2 shadow-md"
                >
                  <Briefcase className="w-4 h-4 text-[#0a1420]" /> Hubungi Kami
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
