'use client';

import { useState, useRef } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle2, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    formRef.current?.reset();
    setTimeout(() => setSubmitted(false), 6000);
  };

  const serviceOptions = [
    'Hukum Korporasi & Komersial',
    'Penyusunan & Review Kontrak',
    'Ketenagakerjaan & HR',
    'Corporate Legal Retainer',
    'Penyelesaian Sengketa Bisnis',
    'Perizinan Usaha & OSS RBA',
    'Legal Due Diligence',
    'Hak Kekayaan Intelektual (HAKI)',
    'Perpajakan & Tax Advisory',
    'Keimigrasian & TKA',
    'Pertanahan & PBG/IMB',
    'Energi, Migas & Minerba',
    'AMDAL & Lingkungan Hidup',
    'Lainnya',
  ];

  return (
    <section id="contact" className="py-20 bg-navy-royal border-b border-corporate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/30 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
            HUBUNGI KAMI
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white">
            Mari Diskusikan Kebutuhan Hukum Anda.
          </h2>
          <div className="w-12 h-[2px] bg-gold-accent mx-auto my-3" />
          <p className="text-sm text-white/70">
            Sampaikan secara singkat kebutuhan hukum Anda. Tim kami akan merespons dalam 1×24 jam kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-navy-deep text-white border border-gold-accent/40 rounded p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif-title text-2xl font-bold text-white mb-1">
                Sedana Legal Consultant
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                Strategic Legal Counsel for Business & Individuals in Indonesia.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-soft border border-gold-accent/40 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gold-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gold-accent font-bold uppercase tracking-widest">Alamat</p>
                    <p className="text-sm text-white/90">Jakarta, Indonesia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-soft border border-gold-accent/40 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-gold-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gold-accent font-bold uppercase tracking-widest">Email Resmi</p>
                    <a href="mailto:consult@seleco.id" className="text-sm text-white/90 hover:text-gold-accent transition-colors">
                      consult@seleco.id
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-soft border border-gold-accent/40 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-gold-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gold-accent font-bold uppercase tracking-widest">Telepon / WhatsApp</p>
                    <a href="tel:+6281200000000" className="text-sm text-white/90 hover:text-gold-accent transition-colors">
                      +62 812-0000-0000
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Photo */}
            <div className="mt-8 relative h-40 rounded overflow-hidden border border-gold-accent/30">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80"
                alt="SELECO Office Jakarta"
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="font-serif-title text-lg font-bold text-white">SELECO — Jakarta</span>
                <span className="text-xs text-gold-accent font-semibold uppercase tracking-widest mt-1">
                  Senin–Jumat | 09:00–17:00 WIB
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-navy-royal border border-corporate rounded p-8"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-4">
                <CheckCircle2 className="w-14 h-14 text-gold-accent" />
                <h3 className="font-serif-title text-2xl font-bold text-white">Formulir Berhasil Dikirim</h3>
                <p className="text-sm text-white/70 max-w-md">
                  Tim SELECO akan menghubungi Anda dalam 1×24 jam kerja untuk langkah komunikasi selanjutnya.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Budi Santoso"
                      className="w-full px-3 py-2.5 text-sm bg-offwhite border border-corporate rounded focus:outline-none focus:border-navy-deep text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">Nama Perusahaan</label>
                    <input
                      type="text"
                      placeholder="PT Maju Bersama"
                      className="w-full px-3 py-2.5 text-sm bg-offwhite border border-corporate rounded focus:outline-none focus:border-navy-deep text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">Alamat Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@perusahaan.com"
                      className="w-full px-3 py-2.5 text-sm bg-offwhite border border-corporate rounded focus:outline-none focus:border-navy-deep text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">Telepon / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+62 812 XXXX XXXX"
                      className="w-full px-3 py-2.5 text-sm bg-offwhite border border-corporate rounded focus:outline-none focus:border-navy-deep text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">Kategori Layanan Hukum *</label>
                  <select
                    required
                    defaultValue=""
                    className="w-full px-3 py-2.5 text-sm bg-offwhite border border-corporate rounded focus:outline-none focus:border-navy-deep text-white"
                  >
                    <option value="" disabled>Pilih kategori layanan...</option>
                    {serviceOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">Deskripsi Singkat Kebutuhan Hukum *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Jelaskan secara singkat konteks atau kebutuhan hukum Anda..."
                    className="w-full px-3 py-2.5 text-sm bg-offwhite border border-corporate rounded focus:outline-none focus:border-navy-deep text-white resize-none"
                  />
                </div>

                <div className="flex items-start gap-2 text-xs text-white/60">
                  <input type="checkbox" required id="disclaimer" className="mt-0.5 accent-navy-deep" />
                  <label htmlFor="disclaimer">
                    Pengiriman formulir ini tidak secara otomatis membentuk hubungan advokat–klien formal.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-navy-deep text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-navy-royal transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Kirim Formulir Konsultasi
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
