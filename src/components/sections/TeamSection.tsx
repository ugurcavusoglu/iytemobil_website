'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TEAM_MEMBERS } from '@/lib/constants';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { Github, Linkedin } from 'lucide-react';

export function TeamSection() {
  const t = useTranslations('team');

  return (
    <section id="team" className="section-padding relative">
      <SectionHeading
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {TEAM_MEMBERS.map((member) => (
          <motion.div
            key={member.id}
            variants={fadeInUp}
            className="glass-card-hover p-6 text-center group"
          >
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-surface-light border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-colors">
              <span className="text-2xl font-bold text-primary">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>

            <h3 className="font-semibold text-white mb-1">{member.name}</h3>
            <p className="text-text-secondary text-sm mb-4">{member.role}</p>

            {/* Social */}
            <div className="flex items-center justify-center gap-3">
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
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
