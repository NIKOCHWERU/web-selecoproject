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
    <EditableSection id="trust-stats" name="Statistik Kepercayaan Banner" className="bg-slate-50 py-8 sm:py-10 border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 bg-white rounded-lg divide-slate-200 max-lg:[&>*:nth-child(n+3)]:border-t max-lg:[&>*:nth-child(even)]:border-l lg:divide-x">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 sm:p-5 flex flex-col items-start gap-1">
              <div className="text-[#0f2034] mb-1">
                <EditableIcon
                  iconKey={stat.iconKey}
                  fallbackIcon={stat.fallbackIcon}
                  className="w-5 h-5"
                  label={stat.iconLabel}
                />
              </div>
              <p className="order-1 text-2xl sm:text-3xl font-bold text-[#0a1420] tracking-tight">
                <EditableText
                  fieldPath={stat.numberPath}
                  fallback={stat.numberFallback}
                  label={stat.numberLabel}
                />
                <span>{stat.numberSuffix}</span>
              </p>
              <p className="order-2 text-sm font-medium text-slate-600">
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
