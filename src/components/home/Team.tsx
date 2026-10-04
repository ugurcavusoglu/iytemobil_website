'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';
import { TEAM_MEMBERS } from '@/lib/constants';
import { EASE, EASE_IN_OUT } from '@/lib/motion';
import { SectionHeader } from './SectionHeader';

export function Team() {
  const t = useTranslations('home.team');

  return (
    <section id="team" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <SectionHeader index="05" eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[1.3fr_1fr]">
          <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.3 }} className="relative aspect-[16/10] lg:aspect-auto">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
              <Image src="/images/team/team.jpg" alt={t('photoAlt')} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <motion.div
                variants={{ hidden: { scaleX: 1 }, shown: { scaleX: 0, transition: { duration: 1.1, ease: EASE_IN_OUT } } }}
                className="absolute inset-0 origin-right bg-background will-change-transform"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.08 }}
            className="grid grid-cols-2 gap-4"
          >
            {TEAM_MEMBERS.map((member) => (
              <motion.div
                key={member.id}
                variants={{ hidden: { opacity: 0, y: 24 }, shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-sm font-black text-primary">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 3)}
                  </span>
                  <p className="mt-4 font-bold leading-tight">{member.name}</p>
                  <p className="mt-1 text-sm text-text-muted">{member.role}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full border border-border-light text-text-secondary transition-colors hover:border-primary hover:text-primary">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-full border border-border-light text-text-secondary transition-colors hover:border-primary hover:text-primary">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
