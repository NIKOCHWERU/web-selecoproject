'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { content } = useContent();
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
    'Program Retainer Bulanan',
    'Pendirian PT / CV / PMA',
    'Hak Kekayaan Intelektual (HAKI)',
    'Lainnya',
  ];

  const waNum = global?.whatsappNumber || '6282211020022';

  return (
    <EditableSection
      id="contact"
      name="Kontak & Kantor Section"
      className="py-16 md:py-20 bg-gray-50 relative overflow-hidden border-t border-gray-200 text-[#0a1420]"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Exact Web NH Contact Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#b88917] text-xs font-bold uppercase tracking-widest mb-3">
            <EditableText
              fieldPath="contact.badge"
              fallback="Kontak Kantor"
              label="Badge Kontak"
            />
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 uppercase tracking-wide text-[#0a1420]">
            <EditableText
              fieldPath="contact.title"
              fallback="Ceritakan Kebutuhan Anda, Kami Siapkan Langkahnya."
              label="Judul Kontak"
            />
          </h2>
          <div className="w-20 h-1 bg-[#dfa82e] mx-auto mb-6" />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed italic">
            <EditableText
              fieldPath="contact.subtitle"
              fallback="Isi formulir singkat berikut. Tim kami merespons pada hari kerja, Senin sampai Jumat."
              label="Subjudul Kontak"
              multiline={true}
            />
          </p>
          <div className="mt-5">
            <Link
              href="/tentang"
              className="text-[#0a1420] font-bold hover:text-[#b88917] transition-colors underline decoration-[#dfa82e] underline-offset-4 text-sm uppercase tracking-wider"
            >
              Lihat Profil PT SELECO SWAKARYA NUSANTARA
            </Link>
          </div>
        </div>

        {/* Exact Web NH 3 Info Cards + Centered Form */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Phone size={22} />,
                label: 'Telepon / WhatsApp',
                value: global?.phone || '+62 822-1102-0022',
                href: `https://wa.me/${waNum}?text=${encodeURIComponent('Halo SELECO, saya ingin berkonsultasi mengenai layanan konsultan dan perizinan.')}`,
              },
              {
                icon: <MapPin size={22} />,
                label: 'Kantor Jakarta Pusat',
                value: global?.address || 'Jl. M.H. Thamrin No. 9 Lt 12, Kebon Sirih, Menteng, DKI Jakarta 10340',
                href: 'https://maps.google.com/?q=Jl.+M.H.+Thamrin+No.+9+Jakarta+Pusat',
              },
              {
                icon: <Mail size={22} />,
                label: 'Email Resmi',
                value: global?.email || 'hello@selecoproject.com',
                href: `mailto:${global?.email || 'hello@selecoproject.com'}`,
              },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center group hover:border-[#dfa82e] transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#0a1420] text-[#dfa82e] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#dfa82e] group-hover:text-[#0a1420] transition-all duration-300">
                  {item.icon}
                </div>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                  {item.label}
                </p>
                <p className="font-bold text-[#0a1420] text-xs md:text-sm leading-snug">
                  {item.value}
                </p>
              </a>
            ))}
          </div>

          {/* Centered Form Card matching Web NH ContactForm */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200 relative overflow-hidden">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a1420] mb-3">Formulir Berhasil Dikirim</h3>
                  <p className="text-gray-600 text-sm">
                    Tim SELECO akan merespons pada hari kerja, Senin sampai Jumat (09:00 - 17:00 WIB).
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="nama"
                        required
                        placeholder="Nama lengkap Anda"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#dfa82e] focus:bg-white transition-all outline-none text-[#0a1420] text-sm font-medium placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Nama Perusahaan
                      </label>
                      <input
                        type="text"
                        name="perusahaan"
                        placeholder="PT / CV / nama bisnis"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#dfa82e] focus:bg-white transition-all outline-none text-[#0a1420] text-sm font-medium placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="email@perusahaan.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#dfa82e] focus:bg-white transition-all outline-none text-[#0a1420] text-sm font-medium placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Telepon / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telepon"
                        required
                        placeholder="+62 812 XXXX XXXX"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#dfa82e] focus:bg-white transition-all outline-none text-[#0a1420] text-sm font-medium placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Kategori Layanan Konsultan *
                    </label>
                    <select
                      name="layanan"
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#dfa82e] focus:bg-white transition-all outline-none text-[#0a1420] text-sm font-medium"
                    >
                      <option value="" disabled>
                        Pilih kategori layanan...
                      </option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Deskripsi Singkat Kebutuhan *
                    </label>
                    <textarea
                      name="deskripsi"
                      required
                      rows={4}
                      placeholder="Ceritakan kebutuhan perizinan, imigrasi, pajak, pertanahan, atau SDM perusahaan Anda..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#dfa82e] focus:bg-white transition-all outline-none text-[#0a1420] text-sm font-medium placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-gray-600">
                    <input type="checkbox" required id="disclaimer" className="mt-0.5 accent-[#b88917]" />
                    <label htmlFor="disclaimer" className="cursor-pointer">
                      Saya setuju data ini dikirimkan untuk konsultasi awal bersama tim konsultan SELECO.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0a1420] text-white py-3.5 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2.5 hover:bg-[#dfa82e] hover:text-[#0a1420] transition-all duration-300 shadow-md mt-2 cursor-pointer"
                  >
                    <Send size={15} />
                    <span>Kirim via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </EditableSection>
  );
}
