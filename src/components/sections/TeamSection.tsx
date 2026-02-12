'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TEAM_MEMBERS } from '@/lib/constants';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { Github, Linkedin, Instagram } from 'lucide-react';

export function TeamSection() {
  const t = useTranslations('team');

  return (
    <section id="team" className="section-padding relative">
      <SectionHeading
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <div className="max-w-4xl mx-auto">
        {/* Team Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative w-full max-w-2xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
            <Image
              src="/images/team/team.jpg"
              alt="IYTE Mobile Team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </motion.div>

        {/* Team Members */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              className="glass-card-hover p-6 text-center group"
            >
              {/* Avatar with Initials */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-surface-light border-2 border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                <span className="text-2xl font-bold text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              <h3 className="font-semibold text-white mb-1">{member.name}</h3>
              <p className="text-text-secondary text-sm mb-4">{member.role}</p>

              {/* Social */}
              <div className="flex items-center justify-center gap-3">
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-text-muted hover:text-white" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-text-muted hover:text-white" />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Github className="w-4 h-4 text-text-muted hover:text-white" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
