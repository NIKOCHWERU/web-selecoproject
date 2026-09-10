import { Suspense } from 'react';

export const metadata = {
  title: 'Direktori 445+ Layanan Hukum & Perizinan | SELECO',
  description: 'Direktori komprehensif 34 Perkara Hukum (Litigasi & Non-Litigasi) dan 411 Perizinan Usaha OSS RBA yang ditangani SELECO — Sedana Legal Consultant.',
};

export default function LayananLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-offwhite flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-navy-deep/60 font-semibold">Memuat direktori layanan...</p>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
