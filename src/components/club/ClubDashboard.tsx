'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import {
  Save,
  LogOut,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Palette,
  Link as LinkIcon,
  ImageIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  themeColor?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  category: string;
  slug?: string;
  websitePublished?: boolean;
}

interface Props {
  club: Club;
  slug: string;
}

const PRESET_COLORS = [
  '#dc2626', '#ea580c', '#d97706', '#16a34a',
  '#0891b2', '#2563eb', '#7c3aed', '#db2777',
];

export function ClubDashboard({ club, slug }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    slug: club.slug || '',
    bannerUrl: club.bannerUrl || '',
    themeColor: club.themeColor || '#dc2626',
    websitePublished: club.websitePublished ?? false,
    socialLinks: {
      instagram: club.socialLinks?.instagram || '',
      twitter: club.socialLinks?.twitter || '',
      linkedin: club.socialLinks?.linkedin || '',
      youtube: club.socialLinks?.youtube || '',
      website: club.socialLinks?.website || '',
    },
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      if (form.slug) payload.slug = form.slug;
      if (form.bannerUrl) payload.bannerUrl = form.bannerUrl;
      payload.themeColor = form.themeColor;
      payload.websitePublished = form.websitePublished;

      const cleanedLinks: Record<string, string> = {};
      Object.entries(form.socialLinks).forEach(([k, v]) => {
        if (v.trim()) cleanedLinks[k] = v.trim();
      });
      if (Object.keys(cleanedLinks).length > 0) {
        payload.socialLinks = cleanedLinks;
      }

      const res = await fetch('/api/club-auth/page-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        showToast('error', data?.message || 'Kaydetme basarisiz.');
        return;
      }

      showToast('success', 'Sayfa ayarları kaydedildi!');

      // Slug değiştiyse yeni URL'e yönlendir
      if (form.slug && form.slug !== slug) {
        router.push(`/clubs/${form.slug}/dashboard`);
      } else {
        router.refresh();
      }
    } catch {
      showToast('error', 'Beklenmeyen bir hata olustu.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/club-auth/logout', { method: 'POST' });
    router.push('/');
  };

  const publicUrl = `/clubs/${form.slug || slug}`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-sm transition-all ${
            toast.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {club.logoUrl && (
              <Image
                src={club.logoUrl}
                alt={club.name}
                width={36}
                height={36}
                className="rounded-lg object-cover"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-white">{club.name}</p>
              <p className="text-xs text-white/40">Sayfa Yönetimi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {form.slug && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition-colors hover:text-white sm:flex"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Sayfayı Gör
              </a>
            )}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Sayfa Ayarları</h1>
          <p className="mt-1 text-sm text-white/50">
            Topluluğunuzun public sayfasını özelleştirin
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Yayın durumu */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">Sayfa Yayın Durumu</h2>
                <p className="mt-0.5 text-sm text-white/50">
                  {form.websitePublished
                    ? 'Sayfanız herkese açık'
                    : 'Sayfanız henüz yayında değil'}
                </p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, websitePublished: !f.websitePublished }))}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  form.websitePublished
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'border border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {form.websitePublished ? (
                  <><Eye className="h-4 w-4" /> Yayında</>
                ) : (
                  <><EyeOff className="h-4 w-4" /> Gizli</>
                )}
              </button>
            </div>
          </div>

          {/* Slug */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-white/50" />
              <h2 className="font-semibold text-white">Sayfa Adresi (Slug)</h2>
            </div>
            <p className="mb-3 text-xs text-white/40">
              Sayfanızın URL'i: iytemobil.com/clubs/<strong>{form.slug || 'slug-belirleyin'}</strong>
            </p>
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                }))
              }
              placeholder="yazilim-toplulugu"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
            />
          </div>

          {/* Banner */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-white/50" />
              <h2 className="font-semibold text-white">Banner Fotoğrafı</h2>
            </div>
            <p className="mb-3 text-xs text-white/40">Fotoğraf URL'sini yapıştırın (önerilen: 1200x400)</p>
            <input
              type="url"
              value={form.bannerUrl}
              onChange={(e) => setForm((f) => ({ ...f, bannerUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
            />
            {form.bannerUrl && (
              <div className="mt-3 overflow-hidden rounded-xl">
                <Image
                  src={form.bannerUrl}
                  alt="banner preview"
                  width={800}
                  height={200}
                  className="h-32 w-full object-cover"
                  onError={() => setForm((f) => ({ ...f, bannerUrl: '' }))}
                />
              </div>
            )}
          </div>

          {/* Tema rengi */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-white/50" />
              <h2 className="font-semibold text-white">Tema Rengi</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm((f) => ({ ...f, themeColor: color }))}
                  className="h-9 w-9 rounded-xl transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    outline: form.themeColor === color ? `3px solid white` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.themeColor}
                  onChange={(e) => setForm((f) => ({ ...f, themeColor: e.target.value }))}
                  className="h-9 w-9 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                />
                <span className="text-xs text-white/40">{form.themeColor}</span>
              </div>
            </div>
          </div>

          {/* Sosyal medya */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-white/50" />
              <h2 className="font-semibold text-white">Sosyal Medya Linkleri</h2>
            </div>
            <div className="flex flex-col gap-3">
              {(
                [
                  { key: 'instagram', label: 'Instagram', Icon: Instagram, placeholder: 'https://instagram.com/toplulugunuz' },
                  { key: 'twitter', label: 'Twitter / X', Icon: Twitter, placeholder: 'https://twitter.com/toplulugunuz' },
                  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin, placeholder: 'https://linkedin.com/company/toplulugunuz' },
                  { key: 'youtube', label: 'YouTube', Icon: Youtube, placeholder: 'https://youtube.com/@toplulugunuz' },
                  { key: 'website', label: 'Web Sitesi', Icon: Globe, placeholder: 'https://toplulugunuz.com' },
                ] as const
              ).map(({ key, label, Icon, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 flex-shrink-0 text-white/40" />
                  <input
                    type="url"
                    value={form.socialLinks[key]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        socialLinks: { ...f.socialLinks, [key]: e.target.value },
                      }))
                    }
                    placeholder={placeholder}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: form.themeColor }}
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </main>
    </div>
  );
}
