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
    <EditableSection id="faq" name="FAQ Pertanyaan Umum Section" className="py-20 lg:py-28 bg-[#0a1420] border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-xs font-bold uppercase tracking-widest text-[#dfa82e] mb-3">
            <EditableText
              fieldPath="faq.badge"
              fallback="Pertanyaan Umum"
              label="Badge FAQ"
            />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white leading-tight">
            <EditableText
              fieldPath="faq.title"
              fallback="Frequently Asked Questions"
              label="Judul FAQ"
            />
          </h2>
          <div className="w-16 h-1 bg-[#dfa82e] rounded-full mx-auto my-4" />
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            <EditableText
              fieldPath="faq.subtitle"
              fallback={faq?.subtitle || 'Pertanyaan yang sering diajukan seputar layanan kami'}
              label="Subjudul FAQ"
              multiline={true}
            />
          </p>
        </div>

        <div className="space-y-3.5">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-xl border px-5 sm:px-6 py-4 bg-[#0f2034] border-white/10 hover:border-[#dfa82e]/40 transition-all shadow-md"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base gap-4 text-white cursor-pointer"
                aria-expanded={openIdx === idx}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#dfa82e] shrink-0 font-sans px-2 py-0.5 rounded bg-[#dfa82e]/10 border border-[#dfa82e]/20">
                    Q{idx + 1}
                  </span>
                  <span className="font-semibold text-white leading-snug">
                    <EditableText
                      fieldPath={`faq.items.${idx}.question`}
                      fallback={item.question || item.q}
                      label={`Pertanyaan #${idx + 1}`}
                    />
                  </span>
                </div>
                <span className="shrink-0 text-[#dfa82e]">
                  {openIdx === idx ? <Minus className="w-4 h-4 text-[#dfa82e]" /> : <Plus className="w-4 h-4 text-gray-400" />}
                </span>
              </button>

              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-white/10 text-sm leading-relaxed text-slate-300 font-light">
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

