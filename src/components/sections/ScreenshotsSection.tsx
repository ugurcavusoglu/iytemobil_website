'use client';

import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const screenshots = [
  { id: 'feed', labelKey: 'feed', color: '#dc2626' },
  { id: 'chat', labelKey: 'chat', color: '#3B82F6' },
  { id: 'food', labelKey: 'food', color: '#F97316' },
  { id: 'transport', labelKey: 'transport', color: '#22C55E' },
  { id: 'clubs', labelKey: 'clubs', color: '#9333EA' },
  { id: 'documents', labelKey: 'documents', color: '#3B82F6' },
  { id: 'jobs', labelKey: 'jobs', color: '#22C55E' },
  { id: 'badges', labelKey: 'badges', color: '#EAB308' },
  { id: 'profile', labelKey: 'profile', color: '#dc2626' },
];

export function ScreenshotsSection() {
  const t = useTranslations('screenshots');

  return (
    <section id="screenshots" className="section-padding relative overflow-hidden">
      <SectionHeading
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <ScrollReveal>
        <Swiper
          modules={[EffectCoverflow, Autoplay, Pagination]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 150,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="!pb-12"
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 1.5 },
            1024: { slidesPerView: 2.5 },
            1280: { slidesPerView: 3 },
          }}
        >
          {screenshots.map((screenshot) => {
            const label = t(screenshot.labelKey);
            return (
              <SwiperSlide key={screenshot.id} className="!w-[260px] md:!w-[280px]">
                <div className="relative mx-auto w-[240px] md:w-[260px]">
                  <div className="rounded-[2.5rem] bg-surface border-2 border-white/10 p-2 shadow-2xl">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-background rounded-full z-10" />
                    <div
                      className="w-full aspect-[9/19] rounded-[2rem] flex flex-col items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${screenshot.color}20, #1a1a1a 60%)` }}
                    >
                      <div
                        className="w-14 h-14 rounded-xl mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${screenshot.color}20` }}
                      >
                        <span className="text-xl font-bold" style={{ color: screenshot.color }}>
                          {label.charAt(0)}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      <p className="text-text-muted text-xs mt-1">İYTE Mobil</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </ScrollReveal>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #888 !important;
          opacity: 0.5 !important;
        }
        .swiper-pagination-bullet-active {
          background: #dc2626 !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
