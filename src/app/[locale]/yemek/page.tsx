'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, Utensils, Home } from 'lucide-react';

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

const formatDate = (date: Date) => date.toISOString().split('T')[0];

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
    const res = await fetch(
      `${API_URL}/food/daily-menu?date=${date}&location=${location}`,
      { next: { revalidate: 0 } }
    );
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

export default function YemekPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'SCHOOL' | 'DORM'>('SCHOOL');
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMenu(formatDate(selectedDate), activeTab).then((data) => {
      setMenus(data);
      setLoading(false);
    });
  }, [selectedDate, activeTab]);

  const mealLabels = MEAL_LABELS[locale] || MEAL_LABELS.tr;
  const sortedMenus = [...menus].sort(
    (a, b) => MEAL_ORDER.indexOf(a.mealType) - MEAL_ORDER.indexOf(b.mealType)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <Home className="w-4 h-4" />
          {locale === 'tr' ? 'Ana sayfaya dön' : 'Back to home'}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-600/15 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">
              {locale === 'tr' ? 'Yemek Menüleri' : 'Food Menus'}
            </h1>
          </div>
          <p className="text-zinc-400 text-sm ml-13">
            {locale === 'tr'
              ? 'İYTE yemekhane ve KYK yurt günlük menüleri'
              : 'IYTE cafeteria and KYK dorm daily menus'}
          </p>
        </div>

        {/* Tab */}
        <div className="flex gap-2 mb-6">
          {(['SCHOOL', 'DORM'] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => setActiveTab(loc)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === loc
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {loc === 'SCHOOL'
                ? locale === 'tr' ? 'Yemekhane' : 'Cafeteria'
                : locale === 'tr' ? 'KYK Yurt' : 'KYK Dorm'}
            </button>
          ))}
        </div>

        {/* Date navigator */}
        <div className="flex items-center justify-between mb-8 bg-white/5 rounded-2xl px-4 py-3">
          <button
            onClick={() => setSelectedDate((d) => addDays(d, -1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-white capitalize">
              {displayDate(formatDate(selectedDate), locale)}
            </p>
          </div>
          <button
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-32 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-3 bg-white/10 rounded w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : sortedMenus.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <Utensils className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>{locale === 'tr' ? 'Bu tarih için menü bulunamadı.' : 'No menu found for this date.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMenus.map((menu) => (
              <div key={menu.id} className="bg-white/5 border border-white/8 rounded-2xl p-5">
                <h2 className="text-sm font-bold text-red-400 uppercase tracking-wide mb-4">
                  {mealLabels[menu.mealType] || menu.mealType}
                </h2>
                <ul className="space-y-2">
                  {menu.items
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <li key={item.id} className="flex items-center justify-between">
                        <span className="text-white text-sm">{item.name}</span>
                        {item.calories ? (
                          <span className="text-zinc-500 text-xs ml-4 shrink-0">
                            {item.calories} kcal
                          </span>
                        ) : null}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Download CTA */}
        <div className="mt-12 p-5 rounded-2xl bg-red-600/10 border border-red-600/20 text-center">
          <p className="text-sm text-zinc-300 mb-3">
            {locale === 'tr'
              ? 'Daha fazlası için İYTE Mobil uygulamasını indir'
              : 'Download IYTE Mobile for more features'}
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.iytemobil.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {locale === 'tr' ? 'Google Play\'den İndir' : 'Download on Google Play'}
          </a>
        </div>
      </div>
    </div>
  );
}
