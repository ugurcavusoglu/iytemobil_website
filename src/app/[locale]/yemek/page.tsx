'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, Utensils, Leaf, Wheat, Apple } from 'lucide-react';

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

const MEAL_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  BREAKFAST: { bg: 'bg-amber-500/8', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  LUNCH:     { bg: 'bg-red-500/8',   border: 'border-red-500/20',   text: 'text-red-400',   dot: 'bg-red-400'   },
  DINNER:    { bg: 'bg-blue-500/8',  border: 'border-blue-500/20',  text: 'text-blue-400',  dot: 'bg-blue-400'  },
};

const MENU_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: Record<string, string>; color: string; bg: string }> = {
  VEGETARIAN: { icon: Leaf,  label: { tr: 'Vejetaryen', en: 'Vegetarian' }, color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/25' },
  VEGAN:      { icon: Apple, label: { tr: 'Vegan',      en: 'Vegan'      }, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/25' },
  GLUTEN_FREE:{ icon: Wheat, label: { tr: 'Glutensiz',  en: 'Gluten-Free'}, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/25' },
};

export default function YemekPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = React.use(params);
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

  const groupedMenus = MEAL_ORDER.reduce<Record<string, DailyMenu[]>>((acc, mealType) => {
    acc[mealType] = menus.filter((m) => m.mealType === mealType);
    return acc;
  }, {});

  const hasSomeMenu = menus.length > 0;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Top nav bar */}
      <div className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {locale === 'tr' ? 'Geri' : 'Back'}
          </Link>
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-sm">
              {locale === 'tr' ? 'Yemek Menüsü' : 'Food Menu'}
            </span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Location tabs */}
        <div className="flex gap-2 mb-5">
          {(['SCHOOL', 'DORM'] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => setActiveTab(loc)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === loc
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/8'
              }`}
            >
              {loc === 'SCHOOL'
                ? locale === 'tr' ? '🏫 Yemekhane' : '🏫 Cafeteria'
                : locale === 'tr' ? '🏠 KYK Yurt' : '🏠 KYK Dorm'}
            </button>
          ))}
        </div>

        {/* Date navigator */}
        <div className="flex items-center justify-between mb-6 bg-white/4 border border-white/8 rounded-2xl px-3 py-2.5">
          <button
            onClick={() => setSelectedDate((d) => addDays(d, -1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-white text-sm capitalize">
              {displayDate(formatDate(selectedDate), locale)}
            </p>
          </div>
          <button
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="h-3.5 bg-white/10 rounded w-28" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-3 bg-white/8 rounded w-3/5" />
                      <div className="h-3 bg-white/8 rounded w-12" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !hasSomeMenu ? (
          <div className="text-center py-20 text-zinc-600">
            <Utensils className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-medium text-zinc-500">
              {locale === 'tr' ? 'Bu tarih için menü bulunamadı.' : 'No menu found for this date.'}
            </p>
            <p className="text-sm mt-1 text-zinc-600">
              {locale === 'tr' ? 'Başka bir tarih seçmeyi deneyin.' : 'Try selecting a different date.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {MEAL_ORDER.map((mealType) => {
              const mealMenus = groupedMenus[mealType];
              if (!mealMenus || mealMenus.length === 0) return null;
              const colors = MEAL_COLORS[mealType];

              return (
                <div key={mealType} className={`${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}>
                  {/* Meal header */}
                  <div className="px-5 py-3.5 border-b border-white/5 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <h2 className={`text-sm font-bold ${colors.text} uppercase tracking-wider`}>
                      {mealLabels[mealType]}
                    </h2>
                  </div>

                  {/* Menu type groups */}
                  <div className="divide-y divide-white/5">
                    {mealMenus
                      .sort((a, b) => {
                        const order = ['REGULAR', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'];
                        return order.indexOf(a.menuType) - order.indexOf(b.menuType);
                      })
                      .map((menu) => {
                        const typeConfig = MENU_TYPE_CONFIG[menu.menuType];
                        const TypeIcon = typeConfig?.icon;
                        return (
                          <div key={menu.id} className="px-5 py-4">
                            {typeConfig && (
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold mb-3 ${typeConfig.bg} ${typeConfig.color}`}>
                                <TypeIcon className="w-3 h-3" />
                                {typeConfig.label[locale] || typeConfig.label.tr}
                              </div>
                            )}
                            <ul className="space-y-2.5">
                              {menu.items
                                .sort((a, b) => a.order - b.order)
                                .map((item) => (
                                  <li key={item.id} className="flex items-center justify-between gap-4">
                                    <span className="text-zinc-200 text-sm leading-snug">{item.name}</span>
                                    {item.calories ? (
                                      <span className="text-zinc-600 text-xs shrink-0 tabular-nums">
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
                </div>
              );
            })}
          </div>
        )}

        {/* Download CTA */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-br from-primary/15 to-red-900/10 border border-primary/20 text-center">
          <Utensils className="w-8 h-8 mx-auto mb-2 text-red-500 opacity-70" />
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
            {locale === 'tr'
              ? 'Restoran menüleri, değerlendirmeler ve daha fazlası için\nİYTE Mobil uygulamasını indir.'
              : 'For restaurant menus, ratings and more,\ndownload IYTE Mobile.'}
          </p>
          <a
            href={`/${locale}/indir`}
            className="inline-block bg-primary hover:bg-red-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-primary/20"
          >
            {locale === 'tr' ? 'Uygulamayı İndir' : 'Download App'}
          </a>
        </div>
      </div>
    </div>
  );
}
