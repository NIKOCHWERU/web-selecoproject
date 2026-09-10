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
    <section id="attorneys" className="py-20 bg-offwhite border-b border-corporate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/30 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
            TIM KONSULTAN HUKUM
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white">
            Profil Advokat & Konsultan
          </h2>
          <div className="w-12 h-[2px] bg-gold-accent mx-auto my-3" />
          <p className="text-sm text-white/70">
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
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-navy-royal border border-corporate rounded overflow-hidden hover:border-gold-accent transition-all group"
            >
              <div className="h-72 overflow-hidden border-b border-corporate">
                <img
                  src={atty.img}
                  alt={atty.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-serif-title text-xl font-bold text-white">{atty.name}</h3>
                <p className="text-xs font-bold text-gold-accent uppercase tracking-widest mt-0.5 mb-3">{atty.role}</p>
                <p className="text-xs text-white/70 border-t border-corporate pt-3 leading-relaxed">{atty.focus}</p>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-white hover:text-gold-accent font-semibold transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" /> Profil LinkedIn
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
