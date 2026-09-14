'use client';

import { useState, useRef } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { content } = useContent();
  const contact = content?.contact;
  const global = content?.global;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const nama = (form.querySelector('[name="nama"]') as HTMLInputElement)?.value || '';
    const perusahaan = (form.querySelector('[name="perusahaan"]') as HTMLInputElement)?.value || '';
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value || '';
    const telepon = (form.querySelector('[name="telepon"]') as HTMLInputElement)?.value || '';
    const layanan = (form.querySelector('[name="layanan"]') as HTMLSelectElement)?.value || '';
    const deskripsi = (form.querySelector('[name="deskripsi"]') as HTMLTextAreaElement)?.value || '';

    const message = `*Formulir Konsultasi SELECO*%0A%0A*Nama:* ${encodeURIComponent(nama)}%0A*Perusahaan:* ${encodeURIComponent(perusahaan)}%0A*Email:* ${encodeURIComponent(email)}%0A*Telepon:* ${encodeURIComponent(telepon)}%0A*Layanan:* ${encodeURIComponent(layanan)}%0A*Deskripsi:*%0A${encodeURIComponent(deskripsi)}`;

    const waNum = global?.whatsappNumber || '6282211020022';
    window.open(`https://wa.me/${waNum}?text=${message}`, '_blank');

    setSubmitted(true);
    form.reset();
    setTimeout(() => setSubmitted(false), 6000);
  };

  const serviceOptions = [
    'Legalitas Korporasi & Komersial',
    'Penyusunan & Review Kontrak',
    'Ketenagakerjaan & HR',
    'Corporate Legal Retainer',
    'Penyelesaian Perselisihan Bisnis (Mediasi)',
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
    <EditableSection id="contact" name="Kontak & Kantor Section" className="py-20 lg:py-28 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            <EditableText
              fieldPath="contact.badge"
              fallback="HUBUNGI KAMI"
              label="Badge Kontak"
            />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            <EditableText
              fieldPath="contact.title"
              fallback="Mari Diskusikan Kebutuhan Hukum Anda."
              label="Judul Kontak"
            />
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
          <p className="text-base text-slate-600 font-normal">
            <EditableText
              fieldPath="contact.subtitle"
              fallback="Sampaikan secara singkat kebutuhan hukum Anda. Tim kami akan merespons dalam 1×24 jam kerja."
              label="Subjudul Kontak"
              multiline={true}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-slate-900 text-white rounded-3xl p-8 lg:p-10 shadow-xl border border-amber-400/30 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif-title text-2xl lg:text-3xl font-bold text-white mb-2">
                {global?.brandName || 'SELECO'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-8 font-light">
                {global?.brandTagline || 'SEDANA LEGAL CONSULTANT'} — Strategic Legal Counsel in Indonesia.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Alamat Kantor</p>
                    <p className="text-sm text-slate-200 font-medium mt-0.5">
                      <EditableText
                        fieldPath="global.address"
                        fallback="Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340"
                        label="Alamat Kantor"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Email Resmi</p>
                    <a href={`mailto:${global?.email || 'hello@selecoproject.com'}`} className="text-sm text-slate-200 hover:text-amber-300 transition-colors font-medium mt-0.5 block">
                      <EditableText
                        fieldPath="global.email"
                        fallback="hello@selecoproject.com"
                        label="Email Resmi"
                      />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Telepon / WhatsApp</p>
                    <a href={`https://wa.me/${global?.whatsappNumber || '6282211020022'}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-200 hover:text-amber-300 transition-colors font-medium mt-0.5 block">
                      {global?.whatsappDisplay || '+62 822-1102-0022'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Photo */}
            <div className="mt-10 relative h-48 rounded-2xl overflow-hidden border border-amber-400/30 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=600&q=80"
                alt="Kantor SELECO Jakarta"
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-slate-950/40">
                <span className="font-serif-title text-xl font-bold text-white">SELECO — Thamrin, Jakarta</span>
                <span className="text-xs text-amber-300 font-semibold uppercase tracking-widest mt-1">
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
            className="lg:col-span-3 bg-white border border-gray-200/90 rounded-3xl p-8 lg:p-12 shadow-xl"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 gap-4">
                <CheckCircle2 className="w-16 h-16 text-gold-accent" />
                <h3 className="font-serif-title text-3xl font-bold text-slate-900">Formulir Berhasil Dikirim</h3>
                <p className="text-sm text-slate-600 max-w-md">
                  Tim SELECO akan menghubungi Anda dalam 1×24 jam kerja untuk langkah komunikasi selanjutnya.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="nama"
                      required
                      placeholder="Budi Santoso"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:bg-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Nama Perusahaan</label>
                    <input
                      type="text"
                      name="perusahaan"
                      placeholder="PT Maju Bersama"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:bg-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Alamat Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="nama@perusahaan.com"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:bg-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Telepon / WhatsApp *</label>
                    <input
                      type="tel"
                      name="telepon"
                      required
                      placeholder="+62 812 XXXX XXXX"
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:bg-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Kategori Layanan Hukum *</label>
                  <select
                    name="layanan"
                    required
                    defaultValue=""
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:bg-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent text-slate-900 transition-all"
                  >
                    <option value="" disabled>Pilih kategori layanan...</option>
                    {serviceOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Deskripsi Singkat Kebutuhan Legalitas &amp; Perizinan *</label>
                  <textarea
                    name="deskripsi"
                    required
                    rows={4}
                    placeholder="Jelaskan secara singkat konteks kebutuhan perizinan atau legalitas bisnis Anda..."
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-gray-300 rounded-xl focus:outline-none focus:bg-white focus:border-gold-accent focus:ring-1 focus:ring-gold-accent text-slate-900 resize-none transition-all"
                  />
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-500 pt-1">
                  <input type="checkbox" required id="disclaimer" className="mt-0.5 accent-gold-accent rounded" />
                  <label htmlFor="disclaimer" className="cursor-pointer">
                    Pengiriman formulir ini adalah untuk konsultasi awal perizinan dan legalitas bisnis Anda.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim via WhatsApp</span>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </EditableSection>
  );
}
