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
    'Konsultan Perizinan (OSS RBA & Sektoral)',
    'Konsultan Imigrasi (KITAS, VISA & TKA)',
    'Konsultan Pajak (SPT Badan & Tax Advisory)',
    'Konsultan Pertanahan (BPN, KKPR, PBG/SLF)',
    'Konsultan SDM (Peraturan Perusahaan & Ketenagakerjaan)',
    'Corporate Retainer Program',
    'Pendirian PT / CV / PMA',
    'Hak Kekayaan Intelektual (HAKI)',
    'Lainnya',
  ];

  return (
    <EditableSection id="contact" name="Kontak & Kantor Section" className="py-20 lg:py-28 bg-[#0a1420] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#dfa82e] mb-3">
            <EditableText
              fieldPath="contact.badge"
              fallback="Hubungi Kami"
              label="Badge Kontak"
            />
          </p>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            <EditableText
              fieldPath="contact.title"
              fallback="Mari Diskusikan Kebutuhan Konsultan Bisnis Anda."
              label="Judul Kontak"
            />
          </h2>
          <div className="w-10 h-[2px] bg-[#dfa82e] my-5" />
          <p className="text-sm text-slate-300 font-normal">
            <EditableText
              fieldPath="contact.subtitle"
              fallback="Sampaikan secara singkat kebutuhan bisnis dan korporasi Anda. Tim kami akan merespons dalam 1x24 jam kerja."
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
            className="lg:col-span-2 bg-[#0f2034] text-white rounded-xl p-8 lg:p-10 shadow-xl border border-white/10 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif-title text-xl lg:text-2xl font-bold text-white mb-1">
                {global?.brandName || 'SELECO'}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-8 font-light">
                {global?.brandTagline || 'SEDANA CORPORATE CONSULTANT'} — Strategic Corporate Consultant in Indonesia.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#b88917] mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#b88917] font-bold uppercase tracking-widest mb-1">Alamat Kantor</p>
                    <p className="text-xs text-white/70 leading-relaxed">
                      <EditableText
                        fieldPath="global.address"
                        fallback="Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340"
                        label="Alamat Kantor"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#b88917]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#b88917] font-bold uppercase tracking-widest mb-1">Email Resmi</p>
                    <a href={`mailto:${global?.email || 'hello@selecoproject.com'}`} className="text-xs text-white/70 hover:text-white transition-colors block">
                      <EditableText
                        fieldPath="global.email"
                        fallback="hello@selecoproject.com"
                        label="Email Resmi"
                      />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#b88917]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#b88917] font-bold uppercase tracking-widest mb-1">Telepon / WhatsApp</p>
                    <a href={`https://wa.me/${global?.whatsappNumber || '6282211020022'}`} target="_blank" rel="noopener noreferrer" className="text-xs text-white/70 hover:text-white transition-colors block">
                      {global?.whatsappDisplay || '+62 822-1102-0022'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Photo */}
            <div className="mt-8 relative h-44 rounded-lg overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=600&q=80"
                alt="Kantor SELECO Jakarta"
                className="w-full h-full object-cover brightness-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="font-serif-title text-base font-bold text-white">SELECO — Thamrin, Jakarta</span>
                <span className="text-[10px] text-[#b88917] font-semibold uppercase tracking-widest mt-1">
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
            className="lg:col-span-3 bg-[#0f2034] border border-white/10 rounded-xl p-8 lg:p-10 shadow-xl"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 gap-4">
                <CheckCircle2 className="w-12 h-12 text-[#dfa82e]" />
                <h3 className="font-serif-title text-2xl font-bold text-white">Formulir Berhasil Dikirim</h3>
                <p className="text-sm text-slate-300 max-w-md font-normal">
                  Tim SELECO akan menghubungi Anda dalam 1x24 jam kerja untuk langkah komunikasi selanjutnya.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="nama"
                      required
                      placeholder="Nama lengkap Anda"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0a1420] border border-white/15 rounded focus:outline-none focus:bg-[#0c1826] focus:border-[#dfa82e] focus:ring-1 focus:ring-[#dfa82e]/30 text-white placeholder-white/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Perusahaan</label>
                    <input
                      type="text"
                      name="perusahaan"
                      placeholder="PT / CV / nama bisnis"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0a1420] border border-white/15 rounded focus:outline-none focus:bg-[#0c1826] focus:border-[#dfa82e] focus:ring-1 focus:ring-[#dfa82e]/30 text-white placeholder-white/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alamat Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@perusahaan.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0a1420] border border-white/15 rounded focus:outline-none focus:bg-[#0c1826] focus:border-[#dfa82e] focus:ring-1 focus:ring-[#dfa82e]/30 text-white placeholder-white/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telepon / WhatsApp *</label>
                    <input
                      type="tel"
                      name="telepon"
                      required
                      placeholder="+62 812 XXXX XXXX"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0a1420] border border-white/15 rounded focus:outline-none focus:bg-[#0c1826] focus:border-[#dfa82e] focus:ring-1 focus:ring-[#dfa82e]/30 text-white placeholder-white/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori Layanan Konsultan *</label>
                  <select
                    name="layanan"
                    required
                    defaultValue=""
                    className="w-full px-3.5 py-2.5 text-sm bg-[#0a1420] border border-white/15 rounded focus:outline-none focus:bg-[#0c1826] focus:border-[#dfa82e] focus:ring-1 focus:ring-[#dfa82e]/30 text-white transition-all"
                  >
                    <option value="" disabled className="bg-[#0f2034] text-white/50">Pilih kategori layanan...</option>
                    {serviceOptions.map(opt => (
                      <option key={opt} value={opt} className="bg-[#0f2034] text-white">{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deskripsi Singkat Kebutuhan *</label>
                  <textarea
                    name="deskripsi"
                    required
                    rows={4}
                    placeholder="Jelaskan secara singkat konteks kebutuhan perizinan, imigrasi, pajak, pertanahan, atau SDM bisnis Anda..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#0a1420] border border-white/15 rounded focus:outline-none focus:bg-[#0c1826] focus:border-[#dfa82e] focus:ring-1 focus:ring-[#dfa82e]/30 text-white placeholder-white/30 resize-none transition-all"
                  />
                </div>

                <div className="flex items-start gap-2.5 text-xs text-slate-400">
                  <input type="checkbox" required id="disclaimer" className="mt-0.5 accent-[#dfa82e]" />
                  <label htmlFor="disclaimer" className="cursor-pointer">
                    Pengiriman formulir ini adalah untuk konsultasi awal perizinan dan operasional bisnis Anda.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-gold-accent to-gold-bright text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#0a1420]" />
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
