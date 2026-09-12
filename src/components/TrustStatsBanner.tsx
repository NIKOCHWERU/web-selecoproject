'use client';

import { Scale, ShieldCheck, Users, Award } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function TrustStatsBanner() {
  const { content } = useContent();
  const global = content?.global;
  const litigationCount = global?.litigationCount || '34';
  const ossLicenseCount = global?.ossLicenseCount || '411+';

  return (
    <EditableSection id="trust-stats" name="Statistik Kepercayaan Banner" className="py-20 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
          <div className="p-7 bg-slate-50 border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-accent/70 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mx-auto mb-4 text-gold-accent">
              <Scale className="w-6 h-6" />
            </div>
            <p className="font-serif-title text-4xl lg:text-5xl font-bold text-slate-900">
              <EditableText
                fieldPath="global.litigationCount"
                fallback={litigationCount}
                label="Jumlah Perkara Litigasi"
              />+
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-2">
              <EditableText
                fieldPath="global.litigationLabel"
                fallback="Perkara Hukum Litigasi"
                label="Label Litigasi"
              />
            </p>
          </div>

          <div className="p-7 bg-slate-50 border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-accent/70 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mx-auto mb-4 text-gold-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="font-serif-title text-4xl lg:text-5xl font-bold text-slate-900">
              <EditableText
                fieldPath="global.ossLicenseCount"
                fallback={ossLicenseCount}
                label="Jumlah Perizinan OSS"
              />
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-2">
              <EditableText
                fieldPath="global.ossLicenseLabel"
                fallback="Perizinan Usaha OSS"
                label="Label Perizinan OSS"
              />
            </p>
          </div>

          <div className="p-7 bg-slate-50 border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-accent/70 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mx-auto mb-4 text-gold-accent">
              <Users className="w-6 h-6" />
            </div>
            <p className="font-serif-title text-4xl lg:text-5xl font-bold text-slate-900">
              <EditableText
                fieldPath="global.trustStat3Number"
                fallback="100%"
                label="Angka Kerahasiaan"
              />
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-2">
              <EditableText
                fieldPath="global.trustStat3Label"
                fallback="Standar Kerahasiaan"
                label="Label Kerahasiaan"
              />
            </p>
          </div>

          <div className="p-7 bg-slate-50 border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-accent/70 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mx-auto mb-4 text-gold-accent">
              <Award className="w-6 h-6" />
            </div>
            <p className="font-serif-title text-4xl lg:text-5xl font-bold text-slate-900">
              <EditableText
                fieldPath="global.trustStat4Number"
                fallback="Nasional"
                label="Angka Jangkauan"
              />
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-2">
              <EditableText
                fieldPath="global.trustStat4Label"
                fallback="Jangkauan Wilayah RI"
                label="Label Jangkauan"
              />
            </p>
          </div>
        </div>
      </div>
    </EditableSection>
  );
}
