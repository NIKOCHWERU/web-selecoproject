'use client';

import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection } from './EditableElement';

export default function TeamSection() {
  const { content } = useContent();
  const team = content?.team;
  const members = team?.members || [];

  return (
    <EditableSection id="attorneys" name="Tim Advokat & Konsultan Section" className="py-20 lg:py-28 bg-slate-50 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            <EditableText
              fieldPath="team.badge"
              fallback="TIM KONSULTAN HUKUM"
              label="Badge Tim"
            />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            <EditableText
              fieldPath="team.title"
              fallback="Profil Advokat & Konsultan"
              label="Judul Tim"
            />
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
          <p className="text-base text-slate-600 font-normal">
            <EditableText
              fieldPath="team.subtitle"
              fallback="Tenaga profesional hukum berpengalaman dengan integritas tinggi dan fokus pada solusi strategis bisnis."
              label="Subjudul Tim"
              multiline={true}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((atty: any, idx: number) => (
            <motion.div
              key={atty.id || atty.name || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold-accent transition-all duration-300 group"
            >
              <div className="h-80 overflow-hidden border-b border-gray-100 bg-slate-100">
                <EditableImage
                  fieldPath={`team.members.${idx}.image`}
                  fallback={atty.image || atty.img}
                  alt={atty.name}
                  label={`Foto ${atty.name}`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif-title text-xl font-bold text-slate-900 group-hover:text-gold-accent transition-colors">
                  <EditableText
                    fieldPath={`team.members.${idx}.name`}
                    fallback={atty.name}
                    label={`Nama Tim #${idx + 1}`}
                  />
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mt-1 mb-3">
                  <EditableText
                    fieldPath={`team.members.${idx}.role`}
                    fallback={atty.role}
                    label={`Posisi Tim #${idx + 1}`}
                  />
                </p>
                <div className="w-8 h-[2px] bg-gray-200 mb-3 group-hover:w-16 group-hover:bg-gold-accent transition-all" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <EditableText
                    fieldPath={`team.members.${idx}.bio`}
                    fallback={atty.specialization || atty.focus || atty.bio}
                    label={`Bio Tim #${idx + 1}`}
                    multiline={true}
                  />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}

