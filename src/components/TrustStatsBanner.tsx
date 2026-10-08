'use client';

import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection, EditableIcon } from './EditableElement';
import { ShieldCheck, FileCheck, Globe, Coins, Building2, Users } from 'lucide-react';

export default function TrustStatsBanner() {
  const { content } = useContent();
  const global = content?.global;
  const litigationCount = global?.litigationCount || '34';
  const ossLicenseCount = global?.ossLicenseCount || '411+';

  const pillarBadges = [
    { title: 'Kepatuhan OSS RBA', icon: FileCheck },
    { title: 'Keimigrasian & TKA', icon: Globe },
    { title: 'Konsultasi Pajak', icon: Coins },
    { title: 'Agraria & BPN', icon: Building2 },
    { title: 'Manajemen SDM', icon: Users },
  ];

  const stats = [
    {
      iconKey: 'stats.icon1',
      fallbackIcon: 'Scale',
      numberPath: 'global.litigationCount',
      numberFallback: litigationCount,
      numberSuffix: '+',
      labelPath: 'global.litigationLabel',
      labelFallback: 'Legalitas Bisnis & Kontrak',
      numberLabel: 'Jumlah Legalitas Bisnis',
      iconLabel: 'Ikon Legalitas Bisnis',
      labelEdit: 'Label Legalitas Bisnis',
    },
    {
      iconKey: 'stats.icon2',
      fallbackIcon: 'ShieldCheck',
      numberPath: 'global.ossLicenseCount',
      numberFallback: ossLicenseCount,
      numberSuffix: '',
      labelPath: 'global.ossLicenseLabel',
      labelFallback: 'Perizinan Usaha OSS',
      numberLabel: 'Jumlah Perizinan OSS',
      iconLabel: 'Ikon Perizinan OSS',
      labelEdit: 'Label Perizinan OSS',
    },
    {
      iconKey: 'stats.icon3',
      fallbackIcon: 'Users',
      numberPath: 'global.trustStat3Number',
      numberFallback: '100%',
      numberSuffix: '',
      labelPath: 'global.trustStat3Label',
      labelFallback: 'Standar Kerahasiaan',
      numberLabel: 'Angka Kerahasiaan',
      iconLabel: 'Ikon Kerahasiaan',
      labelEdit: 'Label Kerahasiaan',
    },
    {
      iconKey: 'stats.icon4',
      fallbackIcon: 'Award',
      numberPath: 'global.trustStat4Number',
      numberFallback: 'Nasional',
      numberSuffix: '',
      labelPath: 'global.trustStat4Label',
      labelFallback: 'Jangkauan Wilayah RI',
      numberLabel: 'Angka Jangkauan',
      iconLabel: 'Ikon Jangkauan Wilayah',
      labelEdit: 'Label Jangkauan',
    },
  ];

  return (
    <EditableSection id="trust-stats" name="Statistik Kepercayaan Banner" className="bg-[#0a1420] py-16 lg:py-20 border-b border-white/10 text-white relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#dfa82e]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Trust strip with gold accents and pillar badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 mb-10 border-b border-[#dfa82e]/15">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#dfa82e]/15 to-[#dfa82e]/5 border border-[#dfa82e]/35 text-[#dfa82e] text-[11px] font-bold uppercase tracking-widest mb-3.5 shadow-[0_0_15px_rgba(223,168,46,0.12)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#dfa82e]" />
              <span>Kepercayaan &amp; Akuntabilitas</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white leading-tight">
              Dipercaya Ratusan <span className="text-[#dfa82e]">Korporasi &amp; Pengusaha</span> di Seluruh Indonesia
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 font-light leading-relaxed">
              Standar kepatuhan terintegrasi untuk akselerasi izin, legalitas usaha, dan tata kelola korporasi.
            </p>
          </div>

          <div className="flex flex-wrap lg:justify-end items-center gap-2.5 sm:gap-3 max-w-xl">
            {pillarBadges.map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={idx}
                  className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-b from-[#0f2034] to-[#0b1726] border border-[#dfa82e]/30 hover:border-[#dfa82e] text-slate-200 hover:text-white text-xs font-semibold tracking-wider uppercase shadow-sm hover:shadow-[0_0_18px_rgba(223,168,46,0.22)] transition-all duration-300"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#dfa82e]/10 border border-[#dfa82e]/25 flex items-center justify-center group-hover:bg-[#dfa82e]/20 group-hover:border-[#dfa82e]/50 transition-colors">
                    <IconComp className="w-3.5 h-3.5 text-[#dfa82e]" />
                  </span>
                  <span className="group-hover:text-amber-100 transition-colors">{badge.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Stats Cards in Eventure Style with Gold Accents */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-6 bg-gradient-to-b from-[#0f2034] via-[#0d1b2a] to-[#0a1420] border border-[#dfa82e]/20 hover:border-[#dfa82e]/60 transition-all duration-300 text-center flex flex-col items-center justify-center group shadow-lg hover:shadow-[0_4px_25px_rgba(223,168,46,0.15)] overflow-hidden"
            >
              {/* Subtle top gold accent glow */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#dfa82e]/50 to-transparent group-hover:via-[#dfa82e] transition-colors" />

              <div className="w-12 h-12 rounded-2xl bg-[#dfa82e]/10 border border-[#dfa82e]/30 group-hover:bg-[#dfa82e]/20 group-hover:border-[#dfa82e]/60 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105">
                <EditableIcon
                  iconKey={stat.iconKey}
                  fallbackIcon={stat.fallbackIcon}
                  className="w-5 h-5 text-[#dfa82e]"
                  label={stat.iconLabel}
                />
              </div>
              <p className="font-serif-title text-3xl sm:text-4xl font-bold text-white tracking-tight group-hover:text-[#dfa82e] transition-colors">
                <EditableText
                  fieldPath={stat.numberPath}
                  fallback={stat.numberFallback}
                  label={stat.numberLabel}
                />
                <span className="text-[#dfa82e]">{stat.numberSuffix}</span>
              </p>
              <p className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-2 group-hover:text-slate-100 transition-colors">
                <EditableText
                  fieldPath={stat.labelPath}
                  fallback={stat.labelFallback}
                  label={stat.labelEdit}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
