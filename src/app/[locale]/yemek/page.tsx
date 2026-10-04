'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Apple, ChevronLeft, ChevronRight, Flame, Home, Leaf, Moon, School, Sun, Utensils, Wheat } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

interface MenuItem {
  id?: string;
  name: string;
  calories?: number | null;
  order: number;
}

interface DailyMenu {
  id: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  location: 'SCHOOL' | 'DORM';
  menuType: string;
  items: MenuItem[];
}

type Location = 'SCHOOL' | 'DORM';
type Meal = 'BREAKFAST' | 'LUNCH' | 'DINNER';

const API_URL = 'https://api.iytemobil.com/api';
const CALORIE_LINE = /^\s*[\d.,]+(\s*[-–]\s*[\d.,]+)?\s*kcal\s*$/i;

const TEXT = {
  tr: {
    eyebrow: 'Yemekhane & KYK',
    title: 'Yemek Menüsü',
    subtitle: 'Merkezi yemekhane ve KYK yurt menüleri, her gün güncel.',
    school: 'Merkezi Yemekhane',
    dorm: 'KYK Yurt',
    meals: { BREAKFAST: 'Kahvaltı', LUNCH: 'Öğle Yemeği', DINNER: 'Akşam Yemeği' },
    types: { REGULAR: 'Günlük Menü', VEGETARIAN: 'Vejetaryen Menü', VEGAN: 'Vegan Menü', GLUTEN_FREE: 'Glutensiz Menü' } as Record<string, string>,
    closed: 'Kapalı',
    schoolInfo: 'Merkezi yemekhanede sadece öğle yemeği servisi vardır.',
    empty: 'Bu tarih için menü bulunamadı.',
    emptySub: 'Başka bir gün seçmeyi dene.',
    days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    cta: 'Restoranlar, puanlar ve fazlası için İYTE Mobil uygulamasını indir.',
    ctaButton: 'Uygulamayı İndir',
  },
  en: {
    eyebrow: 'Cafeteria & Dorm',
    title: 'Food Menu',
    subtitle: 'Central cafeteria and KYK dorm menus, updated every day.',
    school: 'Central Cafeteria',
    dorm: 'KYK Dorm',
    meals: { BREAKFAST: 'Breakfast', LUNCH: 'Lunch', DINNER: 'Dinner' },
    types: { REGULAR: 'Daily Menu', VEGETARIAN: 'Vegetarian', VEGAN: 'Vegan', GLUTEN_FREE: 'Gluten-Free' } as Record<string, string>,
    closed: 'Closed',
    schoolInfo: 'The central cafeteria serves lunch only.',
    empty: 'No menu for this date.',
    emptySub: 'Try another day.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    cta: 'Get the IYTE Mobil app for restaurants, ratings and more.',
    ctaButton: 'Download the App',
  },
};

const TYPE_STYLE: Record<string, { icon: React.ElementType; color: string }> = {
  REGULAR: { icon: Utensils, color: '#E63946' },
  VEGETARIAN: { icon: Leaf, color: '#22c55e' },
  VEGAN: { icon: Apple, color: '#10b981' },
  GLUTEN_FREE: { icon: Wheat, color: '#eab308' },
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const mondayOf = (date: Date) => addDays(date, -((date.getDay() + 6) % 7));
const sameDay = (a: Date, b: Date) => formatDate(a) === formatDate(b);
const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

async function fetchMenu(date: Date, location: Location): Promise<DailyMenu[]> {
  try {
    const res = await fetch(`${API_URL}/food/daily-menu?date=${formatDate(date)}&location=${location}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.menus ?? [];
  } catch {
    return [];
  }
}

function splitCalories(items: MenuItem[]) {
  const line = items.find((i) => CALORIE_LINE.test(i.name));
  const food = items.filter((i) => i !== line).sort((a, b) => a.order - b.order);
  const sum = food.reduce((s, i) => s + (i.calories ?? 0), 0);
  return { food, kcal: line ? line.name.replace(/\s+/g, ' ').trim() : sum > 0 ? `${sum} kcal` : null };
}

function MenuCard({ menu, t }: { menu: DailyMenu; t: (typeof TEXT)['tr'] }) {
  const style = TYPE_STYLE[menu.menuType] ?? TYPE_STYLE.REGULAR;
  const Icon = style.icon;
  const { food, kcal } = splitCalories(menu.items);
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="overflow-hidden rounded-3xl border border-border bg-surface">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 md:px-6">
        <Icon className="h-5 w-5" style={{ color: style.color }} />
        <h3 className="text-lg font-bold">{t.types[menu.menuType] ?? menu.menuType}</h3>
        {kcal && (
          <span className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-amber-500/15 px-3 py-1 text-sm font-semibold text-amber-400"><Flame className="h-4 w-4" />{kcal}</span>
        )}
      </div>
      <ul>
        {food.map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex items-center gap-4 border-b border-border px-5 py-3.5 last:border-b-0 md:px-6">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: style.color }}>{i + 1}</span>
            <span className="flex-1 text-[15px]">{item.name}</span>
            {!!item.calories && <span className="text-sm font-semibold text-primary">{item.calories} <span className="text-[10px] text-text-muted">kcal</span></span>}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function YemekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
  const t = TEXT[locale === 'en' ? 'en' : 'tr'];
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStart, setWeekStart] = useState(() => mondayOf(today));
  const [location, setLocation] = useState<Location>(isWeekend(today) ? 'DORM' : 'SCHOOL');
  const [meal, setMeal] = useState<Meal>(isWeekend(today) || today.getHours() >= 15 ? 'DINNER' : 'LUNCH');
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMenu(selectedDate, location).then((data) => {
      setMenus(data);
      setLoading(false);
    });
  }, [selectedDate, location]);

  const activeMeal: Meal = location === 'SCHOOL' ? 'LUNCH' : meal === 'LUNCH' ? 'DINNER' : meal;
  const shown = menus.filter((m) => m.mealType === activeMeal);
  const week = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const schoolClosed = location === 'SCHOOL' && isWeekend(selectedDate);

  const pickDay = (date: Date) => setSelectedDate(date);
  const shiftWeek = (dir: number) => {
    const start = addDays(weekStart, dir * 7);
    setWeekStart(start);
    setSelectedDate(sameDay(start, mondayOf(today)) ? today : start);
  };

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} image="yemekhane" compact />

      <section className="pb-24 pt-4">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="grid grid-cols-2 gap-2 rounded-full border border-border bg-surface p-1.5">
            {(['SCHOOL', 'DORM'] as const).map((loc) => {
              const active = loc === location;
              const Icon = loc === 'SCHOOL' ? School : Home;
              return (
                <button key={loc} onClick={() => setLocation(loc)} className={`relative flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors md:text-base ${active ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}>
                  {active && <motion.span layoutId="loc-pill" className="absolute inset-0 rounded-full" style={{ backgroundColor: loc === 'SCHOOL' ? '#E63946' : '#f59e0b' }} transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{loc === 'SCHOOL' ? t.school : t.dorm}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {location === 'DORM' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(['BREAKFAST', 'DINNER'] as const).map((m) => {
                    const active = m === activeMeal;
                    const Icon = m === 'BREAKFAST' ? Sun : Moon;
                    return (
                      <button key={m} onClick={() => setMeal(m)} className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-semibold transition-colors ${active ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-text-secondary hover:text-text-primary'}`}>
                        <Icon className="h-4 w-4" />
                        {t.meals[m]}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center gap-2">
            <button onClick={() => shiftWeek(-1)} aria-label="prev" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary hover:text-text-primary"><ChevronLeft className="h-5 w-5" /></button>
            <div className="grid flex-1 grid-cols-7 gap-1.5">
              {week.map((date, i) => {
                const active = sameDay(date, selectedDate);
                const isToday = sameDay(date, today);
                const closed = location === 'SCHOOL' && isWeekend(date);
                return (
                  <button
                    key={formatDate(date)}
                    onClick={() => pickDay(date)}
                    className={`relative flex flex-col items-center rounded-2xl py-2.5 transition-colors ${active ? 'text-white' : 'bg-surface text-text-secondary hover:text-text-primary'} ${closed && !active ? 'opacity-40' : ''}`}
                  >
                    {active && <motion.span layoutId="day-box" className="absolute inset-0 rounded-2xl bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className="relative text-[11px] font-semibold uppercase">{t.days[i]}</span>
                    <span className="relative text-lg font-bold md:text-xl">{date.getDate()}</span>
                    {isToday && <span className={`relative mt-0.5 h-1 w-1 rounded-full ${active ? 'bg-white' : 'bg-primary'}`} />}
                  </button>
                );
              })}
            </div>
            <button onClick={() => shiftWeek(1)} aria-label="next" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary hover:text-text-primary"><ChevronRight className="h-5 w-5" /></button>
          </div>

          {location === 'SCHOOL' && <p className="mt-4 text-center text-xs text-text-muted">{t.schoolInfo}</p>}

          <div className="mt-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div key="loading" exit={{ opacity: 0 }} className="h-72 animate-pulse rounded-3xl bg-surface" />
              ) : shown.length > 0 ? (
                shown.map((menu) => <MenuCard key={`${menu.id}-${menu.menuType}`} menu={menu} t={t} />)
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface py-16 text-center">
                  <Utensils className="h-10 w-10 text-text-disabled" />
                  <p className="mt-2 font-semibold">{schoolClosed ? t.closed : t.empty}</p>
                  {!schoolClosed && <p className="text-sm text-text-muted">{t.emptySub}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-border p-8 text-center md:p-12">
            <Image src="/images/app/food-hero.webp" alt="" fill sizes="1000px" className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
            <div className="relative">
              <p className="mx-auto max-w-md text-lg text-text-secondary">{t.cta}</p>
              <a href={`/${locale}/indir`} className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 font-semibold text-white transition-transform hover:scale-105">{t.ctaButton}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
