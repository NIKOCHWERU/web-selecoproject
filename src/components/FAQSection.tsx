'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { content } = useContent();
  const faq = content?.faq;
  const items = faq?.items || [];

  return (
    <EditableSection id="faq" name="FAQ Pertanyaan Umum Section" className="section-y bg-slate-50 border-b border-slate-200 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10 sm:mb-12">
          <div className="eyebrow-legal mb-3">
            <EditableText
              fieldPath="faq.badge"
              fallback="Pertanyaan Umum"
              label="Badge FAQ"
            />
          </div>
          <h2 className="font-serif-title heading-section text-[#0a1420]">
            <EditableText
              fieldPath="faq.title"
              fallback="Frequently Asked Questions"
              label="Judul FAQ"
            />
          </h2>
          <div className="w-16 h-[1.5px] bg-[#dfa82e] mx-auto my-4" />
          <p className="text-sm text-slate-600 font-normal leading-relaxed">
            <EditableText
              fieldPath="faq.subtitle"
              fallback={faq?.subtitle || 'Pertanyaan yang sering diajukan seputar layanan kami'}
              label="Subjudul FAQ"
              multiline={true}
            />
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-md border px-5 sm:px-6 py-4 bg-white border-[#0f2034]/12 hover:border-[#b88917]/60 transition-colors"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full min-h-[44px] flex items-center justify-between text-left font-bold text-sm gap-4 text-[#0a1420] cursor-pointer"
                aria-expanded={openIdx === idx}
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-serif-title text-sm font-bold text-[#0f2034] shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="font-semibold text-[#0a1420] leading-snug">
                    <EditableText
                      fieldPath={`faq.items.${idx}.question`}
                      fallback={item.question || item.q}
                      label={`Pertanyaan #${idx + 1}`}
                    />
                  </span>
                </div>
                <span className="shrink-0 text-[#0a1420]">
                  {openIdx === idx ? <Minus className="w-4 h-4 text-[#0a1420]" /> : <Plus className="w-4 h-4 text-slate-600" />}
                </span>
              </button>

              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs leading-relaxed text-slate-600 font-normal">
                      <EditableText
                        fieldPath={`faq.items.${idx}.answer`}
                        fallback={item.answer || item.a}
                        label={`Jawaban #${idx + 1}`}
                        multiline={true}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}

