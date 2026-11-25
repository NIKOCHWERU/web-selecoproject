'use client';

import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function TrustStatsBanner() {
  const { content } = useContent();
  const global = content?.global;
  const totalServices = global?.totalServices || '445+';
  const ossLicenseCount = global?.ossLicenseCount || '411+';

  const stats = [
    {
      numberPath: 'global.totalServices',
      numberFallback: totalServices,
      labelPath: 'global.litigationLabel',
      labelFallback: 'Layanan dalam Satu Pintu',
      numberLabel: 'Jumlah Total Layanan',
      labelEdit: 'Label Total Layanan',
    },
    {
      numberPath: 'global.ossLicenseCount',
      numberFallback: ossLicenseCount,
      labelPath: 'global.ossLicenseLabel',
      labelFallback: 'Klasifikasi Izin OSS RBA',
      numberLabel: 'Jumlah Perizinan OSS',
      labelEdit: 'Label Perizinan OSS',
    },
    {
      numberPath: 'global.trustStat3Number',
      numberFallback: '100%',
      labelPath: 'global.trustStat3Label',
      labelFallback: 'Kerahasiaan Dokumen Klien',
      numberLabel: 'Angka Kerahasiaan',
      labelEdit: 'Label Kerahasiaan',
    },
    {
      numberPath: 'global.trustStat4Number',
      numberFallback: 'Nasional',
      labelPath: 'global.trustStat4Label',
      labelFallback: 'Jangkauan Seluruh Indonesia',
      numberLabel: 'Angka Jangkauan',
      labelEdit: 'Label Jangkauan',
    },
  ];

  return (
    <EditableSection
      id="trust-stats"
      name="Statistik Kepercayaan Banner"
      className="bg-white py-12 md:py-16 border-y border-gray-200 text-[#0a1420]"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-[#dfa82e] text-center transition-all"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-[#b88917] mb-1.5 font-sans">
                <EditableText
                  fieldPath={stat.numberPath}
                  fallback={stat.numberFallback}
                  label={stat.numberLabel}
                />
              </div>
              <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-600">
                <EditableText
                  fieldPath={stat.labelPath}
                  fallback={stat.labelFallback}
                  label={stat.labelEdit}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
