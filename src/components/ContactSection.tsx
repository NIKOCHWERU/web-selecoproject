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
    <EditableSection id="contact" name="Kontak & Kantor Section" className="py-12 sm:py-16 bg-[#0a1420] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa82e]/10 border border-[#dfa82e]/30 text-[10px] font-bold uppercase tracking-widest text-[#dfa82e] mb-2.5">
            <EditableText
              fieldPath="contact.badge"
              fallback="Hubungi Kami"
              label="Badge Kontak"
            />
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-white leading-tight">
            <EditableText
              fieldPath="contact.title"
              fallback="Mari Diskusikan Kebutuhan Konsultan Bisnis Anda."
              label="Judul Kontak"
            />
          </h2>
          <div className="w-12 h-0.5 bg-[#dfa82e] rounded-full my-3" />
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            <EditableText
              fieldPath="contact.subtitle"
              fallback="Sampaikan secara singkat kebutuhan bisnis dan korporasi Anda. Tim kami akan merespons dalam 1x24 jam kerja."
              label="Subjudul Kontak"
              multiline={true}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-[#0f2034] text-white rounded-xl p-6 sm:p-7 shadow-lg border border-white/10 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif-title text-lg lg:text-xl font-bold text-white mb-0.5">
                {global?.brandName || 'SELECO'}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-6 font-normal">
                {global?.brandTagline || 'SEDANA LEGAL CONSULTANT'} | Strategic Corporate Consultant in Indonesia.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center shrink-0 text-[#dfa82e] mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#dfa82e] font-bold uppercase tracking-widest mb-0.5">Alamat Kantor</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <EditableText
                        fieldPath="global.address"
                        fallback="Jl.M.H Thamrin No. 9 Lt 12, Kebon Sirih Menteng, DKI Jakarta, 10340"
                        label="Alamat Kantor"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center shrink-0 text-[#dfa82e]">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#dfa82e] font-bold uppercase tracking-widest mb-0.5">Email Resmi</p>
                    <a href={`mailto:${global?.email || 'hello@selecoproject.com'}`} className="text-xs text-slate-300 hover:text-white transition-colors block">
                      <EditableText
                        fieldPath="global.email"
                        fallback="hello@selecoproject.com"
                        label="Email Resmi"
                      />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center shrink-0 text-[#dfa82e]">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#dfa82e] font-bold uppercase tracking-widest mb-0.5">Telepon / WhatsApp</p>
                    <a href={`https://wa.me/${global?.whatsappNumber || '6282211020022'}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-300 hover:text-white transition-colors block">
                      {global?.whatsappDisplay || '+62 822-1102-0022'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Photo Frame */}
            <div className="mt-6 relative h-36 rounded-lg overflow-hidden border border-white/10 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=600&q=80"
                alt="Kantor SELECO Jakarta"
                className="w-full h-full object-cover brightness-40"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="font-serif-title text-sm font-bold text-white">SELECO | Thamrin, Jakarta</span>
                <span className="text-[9px] text-[#dfa82e] font-semibold uppercase tracking-widest mt-0.5">
                  Senin - Jumat | 09:00 - 17:00 WIB
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-[#0f2034] border border-white/10 rounded-xl p-6 sm:p-7 shadow-lg"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-3">
                <CheckCircle2 className="w-10 h-10 text-[#dfa82e]" />
                <h3 className="font-serif-title text-xl font-bold text-white">Formulir Berhasil Dikirim</h3>
                <p className="text-xs text-slate-300 max-w-md font-normal leading-relaxed">
                  Tim SELECO akan menghubungi Anda dalam 1x24 jam kerja untuk langkah komunikasi selanjutnya.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="nama"
                      required
                      placeholder="Nama lengkap Anda"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#0a1420] border border-white/15 rounded-lg focus:outline-none focus:border-[#dfa82e] text-white placeholder-slate-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Perusahaan</label>
                    <input
                      type="text"
                      name="perusahaan"
                      placeholder="PT / CV / nama bisnis"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#0a1420] border border-white/15 rounded-lg focus:outline-none focus:border-[#dfa82e] text-white placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alamat Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@perusahaan.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#0a1420] border border-white/15 rounded-lg focus:outline-none focus:border-[#dfa82e] text-white placeholder-slate-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Telepon / WhatsApp *</label>
                    <input
                      type="tel"
                      name="telepon"
                      required
                      placeholder="+62 812 XXXX XXXX"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#0a1420] border border-white/15 rounded-lg focus:outline-none focus:border-[#dfa82e] text-white placeholder-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Kategori Layanan Konsultan *</label>
                  <select
                    name="layanan"
                    required
                    defaultValue=""
                    className="w-full px-3.5 py-2.5 text-xs bg-[#0a1420] border border-white/15 rounded-lg focus:outline-none focus:border-[#dfa82e] text-white transition-colors"
                  >
                    <option value="" disabled className="bg-[#0f2034] text-white/50">Pilih kategori layanan...</option>
                    {serviceOptions.map(opt => (
                      <option key={opt} value={opt} className="bg-[#0f2034] text-white">{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Deskripsi Singkat Kebutuhan *</label>
                  <textarea
                    name="deskripsi"
                    required
                    rows={3}
                    placeholder="Jelaskan secara singkat konteks kebutuhan perizinan, imigrasi, pajak, pertanahan, atau SDM bisnis Anda..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#0a1420] border border-white/15 rounded-lg focus:outline-none focus:border-[#dfa82e] text-white placeholder-slate-400 resize-none transition-colors"
                  />
                </div>

                <div className="flex items-start gap-2 text-[11px] text-slate-400">
                  <input type="checkbox" required id="disclaimer" className="mt-0.5 accent-[#dfa82e]" />
                  <label htmlFor="disclaimer" className="cursor-pointer">
                    Pengiriman formulir ini adalah untuk konsultasi awal perizinan dan operasional bisnis Anda.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#dfa82e] hover:bg-white text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
