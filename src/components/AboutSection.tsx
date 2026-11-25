'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection } from './EditableElement';

export default function AboutSection({ showMoreLink = false }: { showMoreLink?: boolean }) {
  const { content } = useContent();
  const about = content?.about;

  const values = about?.values || [
    {
      title: 'Patuh Prosedur',
      description: 'Setiap berkas disusun sesuai undang-undang dan aturan pelaksana yang berlaku.',
    },
    {
      title: 'Rencana Terukur',
      description: 'Urutan izin, persyaratan teknis, dan potensi hambatan kami petakan sebelum pengajuan.',
    },
    {
      title: 'Transparan & Berkala',
      description: 'Status tiap tahap dilaporkan rutin, dan biaya resmi (PNBP) maupun jasa konsultan dirinci tertulis sejak awal.',
    },
    {
      title: 'Data Aman',
      description: 'Akta, laporan keuangan, dan berkas internal Anda dijaga dengan prosedur kerahasiaan ketat.',
    },
  ];

  return (
    <EditableSection id="about" name="Tentang Kami Section" className="py-14 md:py-20 bg-gray-50 text-[#0a1420]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Web NH Split Content Layout */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#dfa82e]/20 aspect-video bg-gray-100">
              <EditableImage
                fieldPath="about.image1"
                fallback="https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&w=1000&q=80"
                alt="Ruang referensi dan dokumen korporasi"
                label="Foto Utama Tentang"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#b88917] text-xs font-bold uppercase tracking-widest mb-3">
              <EditableText
                fieldPath="about.badge"
                fallback="Profil Firma"
                label="Badge Tentang"
              />
            </span>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#0a1420] leading-snug">
              <EditableText
                fieldPath="about.title"
                fallback="Bukan Sekadar Mengurus Izin."
                label="Judul Tentang"
              />{' '}
              <span className="text-[#b88917]">
                <EditableText
                  fieldPath="about.titleAccent"
                  fallback="Kami Memastikan Usaha Anda Berjalan Pasti."
                  label="Aksen Judul"
                />
              </span>
            </h2>

            <div className="w-16 h-1 bg-[#dfa82e] mb-5" />

            <p className="text-sm md:text-base leading-relaxed mb-4 text-gray-600">
              <EditableText
                fieldPath="about.paragraph1"
                fallback="PT SELECO SWAKARYA NUSANTARA, yang dikenal dengan nama SELECO (Sedana Legal Consultant), berkantor di kawasan M.H. Thamrin, Jakarta Pusat. Kami menangani legalitas usaha, izin tinggal tenaga kerja asing, kepatuhan pajak badan, sertifikasi tanah, hingga peraturan ketenagakerjaan. Semuanya dalam satu tim, sehingga Anda tidak perlu lagi berpindah-pindah konsultan."
                label="Paragraf 1"
                multiline={true}
                as="span"
              />
            </p>

            <p className="text-sm md:text-base leading-relaxed mb-6 text-gray-600">
              <EditableText
                fieldPath="about.paragraph2"
                fallback="Kami menguasai 411+ klasifikasi izin OSS RBA dan berkoordinasi langsung dengan kementerian serta dinas daerah di seluruh Indonesia. Setiap tahap punya jadwal, dokumen, dan dasar regulasi yang jelas."
                label="Paragraf 2"
                multiline={true}
                as="span"
              />
            </p>

            {showMoreLink && (
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 bg-[#dfa82e] text-[#0a1420] px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#0a1420] hover:text-white transition"
              >
                <span>Kenali Profil SELECO</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </div>

        {/* 4 Values Grid matching Web NH card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {values.map((v: any, i: number) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-200 border-l-4 border-l-[#dfa82e] bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-[#b88917] uppercase tracking-widest mb-2">
                  0{i + 1}
                </div>
                <h3 className="font-bold text-base text-[#0a1420] mb-2">
                  <EditableText
                    fieldPath={`about.values.${i}.title`}
                    fallback={v.title}
                    label={`Nilai #${i + 1} Judul`}
                  />
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  <EditableText
                    fieldPath={`about.values.${i}.description`}
                    fallback={v.description || v.desc}
                    label={`Nilai #${i + 1} Deskripsi`}
                    multiline={true}
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
