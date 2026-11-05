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
    <EditableSection id="trust-stats" name="Statistik Kepercayaan Banner" className="bg-slate-50/70 py-10 sm:py-12 lg:py-14 border-b border-slate-200 text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Trust strip with gold accents and pillar badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 mb-8 border-b border-slate-200">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1420] border border-[#0a1420] text-[#dfa82e] text-[10px] font-bold uppercase tracking-widest mb-2.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#dfa82e]" />
              <span>Kepercayaan &amp; Akuntabilitas</span>
            </div>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#0a1420] leading-tight">
              Dipercaya Ratusan <span className="text-[#b88917]">Korporasi &amp; Pengusaha</span> di Seluruh Indonesia
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              Standar kepatuhan terintegrasi untuk akselerasi izin, legalitas usaha, dan tata kelola korporasi.
            </p>
          </div>

          <div className="flex flex-wrap lg:justify-end items-center gap-2 sm:gap-2.5 max-w-xl">
            {pillarBadges.map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <div
                  key={idx}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 hover:border-[#0a1420] text-slate-800 text-xs font-semibold tracking-wide uppercase transition-colors shadow-sm"
                >
                  <span className="w-5 h-5 rounded-md bg-[#0a1420] flex items-center justify-center text-[#dfa82e]">
                    <IconComp className="w-3 h-3 text-[#dfa82e]" />
                  </span>
                  <span>{badge.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative rounded-xl p-4 sm:p-5 bg-white border border-slate-200/90 hover:border-[#0a1420] transition-colors text-center flex flex-col items-center justify-center group shadow-sm overflow-hidden"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0a1420] text-[#dfa82e] flex items-center justify-center mb-3 group-hover:bg-[#dfa82e] group-hover:text-[#0a1420] transition-colors shadow-xs">
                <EditableIcon
                  iconKey={stat.iconKey}
                  fallbackIcon={stat.fallbackIcon}
                  className="w-4 h-4"
                  label={stat.iconLabel}
                />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#0a1420] tracking-tight group-hover:text-[#b88917] transition-colors font-sans mb-0.5">
                <EditableText
                  fieldPath={stat.numberPath}
                  fallback={stat.numberFallback}
                  label={stat.numberLabel}
                />
                <span className="text-[#b88917]">{stat.numberSuffix}</span>
              </p>
              <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">
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
