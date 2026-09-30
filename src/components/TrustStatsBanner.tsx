'use client';

import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection, EditableIcon } from './EditableElement';

export default function TrustStatsBanner() {
  const { content } = useContent();
  const global = content?.global;
  const litigationCount = global?.litigationCount || '34';
  const ossLicenseCount = global?.ossLicenseCount || '411+';

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
    <EditableSection id="trust-stats" name="Statistik Kepercayaan Banner" className="bg-[#0a1420] py-16 lg:py-20 border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eventure-style "Innovative Companies That Trust Us" trust strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="max-w-md">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#dfa82e]">
              Kepercayaan &amp; Akuntabilitas
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white mt-1">
              Dipercaya Ratusan Korporasi &amp; Pengusaha di Seluruh Indonesia
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-white/50 text-xs font-semibold tracking-wider uppercase">
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">Kepatuhan OSS RBA</span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">Keimigrasian &amp; TKA</span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">Konsultasi Pajak</span>
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">Agraria &amp; BPN</span>
          </div>
        </div>

        {/* 4 Stats Cards in Eventure Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-[#0f2034]/70 border border-white/10 hover:border-[#dfa82e]/40 transition-all duration-300 text-center flex flex-col items-center justify-center group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#dfa82e]/10 group-hover:border-[#dfa82e]/30 flex items-center justify-center mb-4 transition-colors">
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
                {stat.numberSuffix}
              </p>
              <p className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-2">
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
