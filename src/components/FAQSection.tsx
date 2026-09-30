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
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#dfa82e] mb-3">
            <EditableText
              fieldPath="faq.badge"
              fallback="Pertanyaan Umum"
              label="Badge FAQ"
            />
          </p>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white leading-tight">
            <EditableText
              fieldPath="faq.title"
              fallback="Frequently Asked Questions"
              label="Judul FAQ"
            />
          </h2>
          <div className="w-10 h-[2px] bg-[#dfa82e] mx-auto my-5" />
          <p className="text-sm text-slate-300 font-normal">
            <EditableText
              fieldPath="faq.subtitle"
              fallback={faq?.subtitle || 'Pertanyaan yang sering diajukan seputar layanan kami'}
              label="Subjudul FAQ"
              multiline={true}
            />
          </p>
        </div>

        <div className="divide-y divide-white/10 border border-white/10 rounded-2xl bg-[#0f2034] overflow-hidden shadow-xl">
          {items.map((item: any, idx: number) => (
            <div key={idx}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start justify-between gap-4 px-6 sm:px-8 py-5 text-left hover:bg-white/5 transition-colors"
                aria-expanded={openIdx === idx}
              >
                <div className="flex items-start gap-4">
                  <span className="font-serif-title text-xl font-bold text-[#dfa82e] shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="font-serif-title text-lg sm:text-xl font-bold text-white leading-snug">
                    <EditableText
                      fieldPath={`faq.items.${idx}.question`}
                      fallback={item.question || item.q}
                      label={`Pertanyaan #${idx + 1}`}
                    />
                  </span>
                </div>
                <span className="shrink-0 text-[#dfa82e] mt-1">
                  {openIdx === idx ? <Minus className="w-5 h-5 text-[#dfa82e]" /> : <Plus className="w-5 h-5 text-white/50" />}
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
                    <div className="px-6 sm:px-8 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed font-normal bg-[#0a1420]/60 border-t border-white/5">
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

