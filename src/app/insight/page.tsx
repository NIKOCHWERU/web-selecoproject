import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insight & Updates | SELECO',
  description: 'Baca insight, artikel hukum, dan update regulasi terbaru dari SELECO Law Firm.',
};

export default function InsightPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold text-navy-deep mb-8 uppercase tracking-wide">Insight & Updates</h1>
      <div className="w-24 h-1.5 bg-gold-accent mb-8"></div>
      <p className="text-gray-600 max-w-2xl text-lg mb-12">
        Temukan artikel hukum terbaru, analisis regulasi, dan update dari para ahli hukum kami untuk membantu bisnis Anda tetap patuh dan aman.
      </p>

      {/* Placeholder list for insights */}
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-navy-deep mb-3">Judul Insight {idx}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ringkasan singkat mengenai isu hukum atau regulasi terbaru yang relevan dengan kebutuhan bisnis dan korporasi.
            </p>
            <a href="#" className="text-gold-accent font-bold text-sm uppercase tracking-wider hover:underline">
              Baca Insight &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
