'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { content } = useContent();
  const faq = content?.faq;
  const items = faq?.items || [];

  return (
    <EditableSection id="faq" name="FAQ Pertanyaan Umum Section" className="py-14 md:py-20 bg-gray-50 border-t border-gray-200 text-[#0a1420]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#b88917] text-xs font-bold uppercase tracking-widest mb-3">
            <EditableText
              fieldPath="faq.badge"
              fallback="Tanya Jawab"
              label="Badge FAQ"
            />
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 uppercase text-[#0a1420]">
            <EditableText
              fieldPath="faq.title"
              fallback="Yang Paling Sering Ditanyakan Klien"
              label="Judul FAQ"
            />
          </h2>
          <div className="w-16 h-1 bg-[#dfa82e] mx-auto mb-4" />
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            <EditableText
              fieldPath="faq.subtitle"
              fallback="Jawaban singkat soal alur kerja, estimasi waktu, jangkauan wilayah, dan biaya."
              label="Subjudul FAQ"
              multiline={true}
            />
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-xl border px-5 py-4 bg-white border-gray-200"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full min-h-[44px] flex items-center justify-between text-left font-bold text-sm md:text-base gap-4 text-[#0a1420] cursor-pointer"
                aria-expanded={openIdx === idx}
              >
                <span>
                  <EditableText
                    fieldPath={`faq.items.${idx}.question`}
                    fallback={item.question || item.q}
                    label={`Pertanyaan #${idx + 1}`}
                  />
                </span>
                {openIdx === idx ? (
                  <ChevronUp size={18} className="text-[#b88917] shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 shrink-0" />
                )}
              </button>

              {openIdx === idx && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm leading-relaxed text-gray-600">
                  <EditableText
                    fieldPath={`faq.items.${idx}.answer`}
                    fallback={item.answer || item.a}
                    label={`Jawaban #${idx + 1}`}
                    multiline={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
