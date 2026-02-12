'use client';

import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const screenshots = [
  { id: 'feed', labelKey: 'feed', src: '/images/screenshots/feed.jpg' },
  { id: 'chat', labelKey: 'chat', src: '/images/screenshots/chat.jpg' },
  { id: 'food', labelKey: 'food', src: '/images/screenshots/food.jpg' },
  { id: 'transport', labelKey: 'transport', src: '/images/screenshots/transport.jpg' },
  { id: 'carpool', labelKey: 'carpool', src: '/images/screenshots/carpool.jpg' },
  { id: 'clubs', labelKey: 'clubs', src: '/images/screenshots/clubs.jpg' },
  { id: 'events', labelKey: 'events', src: '/images/screenshots/events.jpg' },
  { id: 'documents', labelKey: 'documents', src: '/images/screenshots/documents.jpg' },
  { id: 'badges', labelKey: 'badges', src: '/images/screenshots/badges.jpg' },
  { id: 'leaderboard', labelKey: 'leaderboard', src: '/images/screenshots/leaderboard.jpg' },
  { id: 'profile', labelKey: 'profile', src: '/images/screenshots/profile.jpg' },
  { id: 'departments', labelKey: 'departments', src: '/images/screenshots/departments.jpg' },
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
          loop={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          pagination={{ clickable: true }}
          className="!pb-12"
        >
          {screenshots.map((screenshot) => {
            const label = t(screenshot.labelKey);
            return (
              <SwiperSlide key={screenshot.id} className="!w-[280px] md:!w-[300px]">
                <div className="relative mx-auto w-[260px] md:w-[280px] group">
                  {/* Phone Frame */}
                  <div className="relative rounded-[3rem] bg-black p-3 shadow-2xl border border-gray-800 transition-transform duration-300 group-hover:scale-105">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20 flex items-center justify-center">
                      <div className="w-16 h-4 bg-gray-900 rounded-full" />
                    </div>

                    {/* Screen */}
                    <div className="relative w-full aspect-[9/19.5] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                      <Image
                        src={screenshot.src}
                        alt={label}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 260px, 280px"
                        priority={false}
                      />
                    </div>

                    {/* Label Badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1.5 rounded-full shadow-lg z-20">
                      <p className="text-white text-xs font-semibold whitespace-nowrap">{label}</p>
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
