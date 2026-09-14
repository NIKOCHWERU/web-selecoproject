import { Suspense } from 'react';

export const metadata = {
  title: 'Direktori 445+ Layanan Konsultan Korporasi & Perizinan | SELECO',
  description: 'Direktori komprehensif 5 Pilar Layanan Konsultan: Perizinan OSS RBA, Imigrasi & TKA, Pajak, Pertanahan BPN, dan Manajemen SDM oleh SELECO — Sedana Corporate Consultant.',
};

export default function LayananLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/60 font-semibold">Memuat direktori layanan...</p>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
