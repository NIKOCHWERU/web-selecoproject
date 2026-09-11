'use client';

import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

const attorneys = [
  {
    name: 'Sedana Pratama',
    role: 'Managing Partner',
    focus: 'Hukum Korporasi · Transaksi Komersial · Legal Risk Management',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Aurelia Mahendra',
    role: 'Senior Legal Consultant',
    focus: 'Hukum Ketenagakerjaan · Kepatuhan Regulasi · Corporate Governance',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Raka Adinata',
    role: 'Legal Consultant',
    focus: 'Perancangan Kontrak · Perizinan OSS RBA · Legal Due Diligence',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
];

export default function TeamSection() {
  return (
    <section id="attorneys" className="py-20 lg:py-28 bg-slate-50 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            TIM KONSULTAN HUKUM
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Profil Advokat &amp; Konsultan
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
          <p className="text-base text-slate-600 font-normal">
            Tenaga profesional hukum berpengalaman dengan integritas tinggi dan fokus pada solusi strategis bisnis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {attorneys.map((atty, idx) => (
            <motion.div
              key={atty.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold-accent transition-all duration-300 group"
            >
              <div className="h-80 overflow-hidden border-b border-gray-100 bg-slate-100">
                <img
                  src={atty.img}
                  alt={atty.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif-title text-2xl font-bold text-slate-900 mb-1">{atty.name}</h3>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-4">{atty.role}</p>
                <p className="text-xs text-slate-600 border-t border-gray-100 pt-4 leading-relaxed font-normal">{atty.focus}</p>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-xs text-slate-800 hover:text-gold-accent font-semibold transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-gold-accent" />
                  <span>Profil LinkedIn</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
