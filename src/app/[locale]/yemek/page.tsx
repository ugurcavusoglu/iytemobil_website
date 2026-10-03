'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Utensils, Leaf, Wheat, Apple, School, Home } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

interface MenuItem {
  id: string;
  name: string;
  calories?: number;
  allergens?: string;
  order: number;
}

interface DailyMenu {
  id: string;
  date: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  location: 'SCHOOL' | 'DORM';
  menuType: string;
  items: MenuItem[];
}

const API_URL = 'https://api.iytemobil.com/api';

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const displayDate = (dateStr: string, locale: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

async function fetchMenu(date: string, location: 'SCHOOL' | 'DORM'): Promise<DailyMenu[]> {
  try {
    const res = await fetch(`${API_URL}/food/daily-menu?date=${date}&location=${location}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data.menus) return data.menus;
    return [];
  } catch {
    return [];
  }
}

const MEAL_ORDER = ['BREAKFAST', 'LUNCH', 'DINNER'];

const MEAL_LABELS: Record<string, Record<string, string>> = {
  tr: { BREAKFAST: 'Kahvaltı', LUNCH: 'Öğle Yemeği', DINNER: 'Akşam Yemeği' },
  en: { BREAKFAST: 'Breakfast', LUNCH: 'Lunch', DINNER: 'Dinner' },
};

const MEAL_COLORS: Record<string, { glow: string; text: string; dot: string }> = {
  BREAKFAST: { glow: 'bg-amber-500', text: 'text-amber-400', dot: 'bg-amber-400' },
  LUNCH: { glow: 'bg-red-500', text: 'text-red-400', dot: 'bg-red-400' },
  DINNER: { glow: 'bg-blue-500', text: 'text-blue-400', dot: 'bg-blue-400' },
};

const MENU_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: Record<string, string>; color: string; bg: string }> = {
  VEGETARIAN: { icon: Leaf, label: { tr: 'Vejetaryen', en: 'Vegetarian' }, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/25' },
  VEGAN: { icon: Apple, label: { tr: 'Vegan', en: 'Vegan' }, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/25' },
  GLUTEN_FREE: { icon: Wheat, label: { tr: 'Glutensiz', en: 'Gluten-Free' }, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/25' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function YemekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'SCHOOL' | 'DORM'>('SCHOOL');
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    setLoading(true);
    fetchMenu(formatDate(selectedDate), activeTab).then((data) => {
      if (isFirstLoad.current && activeTab === 'SCHOOL' && data.length === 0) {
        isFirstLoad.current = false;
        setActiveTab('DORM');
        return;
      }
      isFirstLoad.current = false;
      setMenus(data);
      setLoading(false);
    });
  }, [selectedDate, activeTab]);

  const mealLabels = MEAL_LABELS[locale] || MEAL_LABELS.tr;
  const isTr = locale === 'tr';

  const groupedMenus = MEAL_ORDER.reduce<Record<string, DailyMenu[]>>((acc, mealType) => {
    acc[mealType] = menus.filter((m) => m.mealType === mealType);
    return acc;
  }, {});

  const hasSomeMenu = menus.length > 0;

  return (
    <>
      <PageHero
        eyebrow={isTr ? 'Yemekhane & KYK' : 'Cafeteria & Dorm'}
        title={isTr ? 'Yemek Menüsü' : 'Food Menu'}
        subtitle={isTr ? 'Kampüs yemekhanesi ve KYK yurdunun günlük menüsü, kalori bilgisiyle.' : 'Daily menus of the campus cafeteria and KYK dorm, with calories.'}
        image="amfi"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border-light bg-background/50 px-5 py-2.5 text-sm font-semibold text-text-secondary backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {isTr ? 'Geri' : 'Back'}
        </Link>
      </PageHero>

      <section className="pb-24 pt-4 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.08 }}
              className="space-y-3"
            >
              <motion.div variants={fadeUp} className="flex gap-1 rounded-full border border-border bg-surface p-1">
                {(['SCHOOL', 'DORM'] as const).map((loc) => {
                  const Icon = loc === 'SCHOOL' ? School : Home;
                  return (
                    <button
                      key={loc}
                      onClick={() => setActiveTab(loc)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${
                        activeTab === loc
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {loc === 'SCHOOL'
                        ? isTr ? 'Yemekhane' : 'Cafeteria'
                        : isTr ? 'KYK Yurt' : 'KYK Dorm'}
                    </button>
                  );
                })}
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center justify-between gap-2 rounded-full border border-border bg-surface p-1.5">
                <button
                  onClick={() => setSelectedDate((d) => addDays(d, -1))}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-light text-text-secondary transition-colors hover:bg-primary hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="min-w-0 text-center text-sm font-semibold capitalize text-text-primary md:text-base">
                  {displayDate(formatDate(selectedDate), locale)}
                </p>
                <button
                  onClick={() => setSelectedDate((d) => addDays(d, 1))}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-light text-text-secondary transition-colors hover:bg-primary hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>

            <div className="mt-8">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded-3xl border border-border bg-surface p-6">
                      <div className="mb-5 flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-surface-light" />
                        <div className="h-4 w-32 rounded-full bg-surface-light" />
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="flex justify-between">
                            <div className="h-3 w-3/5 rounded-full bg-surface-light" />
                            <div className="h-3 w-12 rounded-full bg-surface-light" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : !hasSomeMenu ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl border border-border bg-surface px-6 py-16 text-center"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-light">
                    <Utensils className="h-7 w-7 text-text-muted" />
                  </div>
                  <p className="text-lg font-bold text-text-primary">
                    {isTr ? 'Bu tarih için menü bulunamadı.' : 'No menu found for this date.'}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {isTr ? 'Başka bir tarih seçmeyi deneyin.' : 'Try selecting a different date.'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.08 }}
                  className="space-y-4"
                >
                  {MEAL_ORDER.map((mealType) => {
                    const mealMenus = groupedMenus[mealType];
                    if (!mealMenus || mealMenus.length === 0) return null;
                    const colors = MEAL_COLORS[mealType];

                    return (
                      <motion.div
                        key={mealType}
                        variants={fadeUp}
                        className="relative overflow-hidden rounded-3xl border border-border bg-surface"
                      >
                        <div className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-20 blur-3xl ${colors.glow}`} />
                        <div className="relative flex items-center gap-2.5 border-b border-border px-6 py-4">
                          <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                          <h2 className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.text}`}>
                            {mealLabels[mealType]}
                          </h2>
                        </div>

                        <div className="relative divide-y divide-border">
                          {mealMenus
                            .sort((a, b) => {
                              const order = ['REGULAR', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'];
                              return order.indexOf(a.menuType) - order.indexOf(b.menuType);
                            })
                            .map((menu) => {
                              const typeConfig = MENU_TYPE_CONFIG[menu.menuType];
                              const TypeIcon = typeConfig?.icon;
                              return (
                                <div key={menu.id} className="px-6 py-5">
                                  {typeConfig && (
                                    <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${typeConfig.bg} ${typeConfig.color}`}>
                                      <TypeIcon className="h-3 w-3" />
                                      {typeConfig.label[locale] || typeConfig.label.tr}
                                    </div>
                                  )}
                                  <ul className="space-y-3">
                                    {menu.items
                                      .sort((a, b) => a.order - b.order)
                                      .map((item) => (
                                        <li key={item.id} className="flex items-center justify-between gap-4">
                                          <span className="text-[15px] leading-snug text-text-primary">{item.name}</span>
                                          {item.calories ? (
                                            <span className="shrink-0 rounded-full bg-surface-light px-2.5 py-0.5 text-xs tabular-nums text-text-muted">
                                              {item.calories} kcal
                                            </span>
                                          ) : null}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              );
                            })}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative mt-12 overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center md:p-10"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <p className="mx-auto mb-6 max-w-md whitespace-pre-line text-text-secondary">
                  {isTr
                    ? 'Restoran menüleri, değerlendirmeler ve daha fazlası için\nİYTE Mobil uygulamasını indir.'
                    : 'For restaurant menus, ratings and more,\ndownload IYTE Mobile.'}
                </p>
                <a
                  href={`/${locale}/indir`}
                  className="inline-flex items-center rounded-full bg-primary px-7 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark"
                >
                  {isTr ? 'Uygulamayı İndir' : 'Download App'}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
