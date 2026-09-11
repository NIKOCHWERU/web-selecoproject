'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X, Scale, ChevronRight, Filter, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SERVICE_CATEGORIES,
  PERKARA_HUKUM_ITEMS,
  PERIZINAN_LEGALITAS_ITEMS,
  ServiceItem,
} from '@/data/layananData';

export default function LayananPage() {
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
    () => [...PERKARA_HUKUM_ITEMS, ...PERIZINAN_LEGALITAS_ITEMS],
    []
  );

  const filtered = useMemo(() => {
    let items = allItems;

    if (activeCat === 'hukum') {
      items = PERKARA_HUKUM_ITEMS;
    } else if (activeCat !== 'all') {
      // Filter perizinan by category tag
      const catLabel = SERVICE_CATEGORIES.find(c => c.id === activeCat)?.name ?? '';
      items = PERIZINAN_LEGALITAS_ITEMS.filter(item => {
        const lower = item.category.toLowerCase();
        if (activeCat === 'pendirian') return lower.includes('pendirian') || lower.includes('haki') || lower.includes('oss') || lower.includes('perizinan usaha') || lower.includes('sertifikasi');
        if (activeCat === 'perpajakan') return lower.includes('perpajakan');
        if (activeCat === 'kesehatan') return lower.includes('kesehatan') || lower.includes('medis');
        if (activeCat === 'keimigrasian') return lower.includes('keimigrasian') || lower.includes('tka');
        if (activeCat === 'pertanahan') return lower.includes('pertanahan') || lower.includes('pbg');
        if (activeCat === 'energi') return lower.includes('energi') || lower.includes('migas') || lower.includes('minerba');
        if (activeCat === 'lingkungan') return lower.includes('lingkungan') || lower.includes('amdal');
        if (activeCat === 'imporekspor') return lower.includes('impor') || lower.includes('ekspor') || lower.includes('industri');
        return true;
      });
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
    <div className="min-h-screen bg-navy-dark">
      
      {/* Page Hero Banner */}
      <div className="bg-navy-deep border-b border-gold-accent/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold-accent">Direktori Layanan</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/40 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
                <Scale className="w-3.5 h-3.5" /> DIREKTORI PELAYANAN HUKUM & LEGALITAS
              </div>
              <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                445+ Layanan Hukum &amp; Perizinan Usaha
              </h1>
              <div className="w-14 h-[2px] bg-gold-accent mt-3 mb-3" />
              <p className="text-sm text-white/70 max-w-2xl">
                Direktori komprehensif mencakup <strong className="text-white">34 Perkara Hukum</strong> (Litigasi & Non-Litigasi) dan <strong className="text-white">411 Perizinan OSS RBA</strong> yang ditangani SELECO secara profesional.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-center shrink-0">
              <div className="bg-navy-royal border border-gold-accent/30 rounded px-6 py-3">
                <p className="font-serif-title text-3xl font-bold text-gold-accent">445+</p>
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Total Layanan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* === LEFT SIDEBAR: Category Filter === */}
          <aside className="xl:w-72 shrink-0">
            <div className="bg-white border border-corporate rounded sticky top-24 overflow-hidden">
              <div className="px-4 py-3 border-b border-corporate bg-navy-deep">
                <p className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gold-accent" /> Filter Kategori
                </p>
              </div>
              <nav className="divide-y divide-corporate max-h-[70vh] overflow-y-auto">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCat(cat.id); setSearchQuery(''); }}
                    className={`w-full flex items-start justify-between gap-2 px-4 py-3 text-left transition-all text-xs ${
                      activeCat === cat.id
                        ? 'bg-gold-soft border-l-2 border-gold-accent text-white font-bold'
                        : 'text-white/70 hover:bg-navy-dark hover:text-white'
                    }`}
                  >
                    <span className="leading-snug font-semibold">{cat.name}</span>
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${activeCat === cat.id ? 'bg-gold-accent text-white' : 'bg-navy-deep/8 text-white/60'}`} style={activeCat !== cat.id ? {background:'rgba(7,20,38,0.07)'} : undefined}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* === MAIN CONTENT: Search + Items === */}
          <div className="flex-1 min-w-0">

            {/* Search & View Controls */}
            <div className="bg-white border border-corporate rounded p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari layanan, perizinan, atau perkara hukum..."
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-navy-dark border border-corporate rounded focus:outline-none focus:border-navy-deep text-white"
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
                  className={`p-2 rounded border transition-all ${viewMode === 'grid' ? 'bg-navy-deep text-white border-navy-deep' : 'border-corporate text-white/60 hover:border-navy-deep'}`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded border transition-all ${viewMode === 'list' ? 'bg-navy-deep text-white border-navy-deep' : 'border-corporate text-white/60 hover:border-navy-deep'}`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Title & Description */}
            {currentCatData && (
              <div className="mb-6 p-5 bg-white border border-corporate border-l-4 border-l-gold-accent rounded">
                <h2 className="font-serif-title text-xl font-bold text-white mb-1">{currentCatData.name}</h2>
                <p className="text-xs text-white/70">{currentCatData.description}</p>
                <p className="text-xs text-gold-accent font-bold mt-2">
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
              <div className="text-center py-20 text-white/50">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-serif-title text-xl font-bold mb-1">Tidak Ada Hasil</p>
                <p className="text-sm">Coba kata kunci lain atau pilih kategori berbeda.</p>
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
                  {filtered.map((item, idx) => (
                    <motion.div
                      key={`${item.type}-${item.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3) }}
                      className="bg-white border border-corporate rounded p-4 hover:border-gold-accent transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                            item.type === 'hukum'
                              ? 'bg-navy-deep text-gold-accent'
                              : 'bg-gold-soft text-gold-accent border border-gold-accent/30'
                          }`}>
                            {item.type === 'hukum' ? 'Hukum' : 'Perizinan'}
                          </span>
                          <span className="text-[10px] text-white/40 font-semibold shrink-0">#{item.id}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-gold-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-white/50 font-semibold">{item.category}</p>
                      </div>
                      <Link
                        href="/#contact"
                        className="mt-3 text-xs font-bold text-white/60 border-t border-corporate pt-2.5 flex items-center gap-1 hover:text-gold-accent transition-colors group-hover:text-gold-accent"
                      >
                        Konsultasikan <ChevronRight className="w-3 h-3" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-corporate rounded overflow-hidden divide-y divide-corporate"
                >
                  {filtered.map((item, idx) => (
                    <motion.div
                      key={`${item.type}-${item.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.01, 0.2) }}
                      className="flex items-start gap-4 px-4 py-3.5 hover:bg-navy-dark transition-all group"
                    >
                      <span className="text-xs text-white/30 font-bold w-7 shrink-0 pt-0.5">
                        {String(item.id).padStart(3, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white group-hover:text-gold-accent transition-colors leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-white/50 mt-0.5">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.type === 'hukum'
                            ? 'bg-navy-deep text-gold-accent'
                            : 'bg-gold-soft text-gold-accent border border-gold-accent/30'
                        }`}>
                          {item.type === 'hukum' ? 'Hukum' : 'Izin'}
                        </span>
                        <Link href="/#contact" className="text-[10px] font-bold text-white/50 hover:text-gold-accent transition-colors whitespace-nowrap">
                          Konsultasi →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Banner */}
            {filtered.length > 0 && (
              <div className="mt-10 p-6 bg-navy-deep border border-gold-accent/40 rounded flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                <div>
                  <h3 className="font-serif-title text-xl font-bold">Tidak menemukan yang Anda cari?</h3>
                  <p className="text-xs text-white/70 mt-1">Tim SELECO siap mendiskusikan kebutuhan hukum spesifik Anda.</p>
                </div>
                <Link
                  href="/#contact"
                  className="px-5 py-3 bg-gold-accent text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-bright transition-all whitespace-nowrap flex items-center gap-2"
                >
                  <Scale className="w-4 h-4" /> Hubungi Kami
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
