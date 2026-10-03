'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { PageHero } from '@/components/ui/PageHero';
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
  Camera,
  CheckCircle,
  AlertCircle,
  Megaphone,
  Send,
  Pencil,
  Trash2,
  X,
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

interface ClubPost {
  id: string;
  content: string;
  createdAt: string;
  isEdited: boolean;
  _count: { likes: number; comments: number };
}

interface Props {
  club: Club;
  slug: string;
}

const PRESET_COLORS = [
  '#E63946', '#ea580c', '#d97706', '#16a34a',
  '#0891b2', '#2563eb', '#7c3aed', '#db2777',
];

export function ClubDashboard({ club, slug }: Props) {
  const router = useRouter();
  const t = useTranslations('clubDashboard');
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [editingPost, setEditingPost] = useState<{ id: string; content: string } | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: club.slug || '',
    bannerUrl: club.bannerUrl || '',
    logoUrl: club.logoUrl || '',
    themeColor: club.themeColor || '#E63946',
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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/club-auth/upload-banner', { method: 'POST', body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) { showToast('error', data?.message || 'Banner yuklenemedi.'); return; }
      setForm((f) => ({ ...f, bannerUrl: data.url }));
    } catch {
      showToast('error', 'Banner yuklenemedi.');
    } finally {
      setUploadingBanner(false);
      e.target.value = '';
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/club-auth/upload-logo', { method: 'POST', body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) { showToast('error', data?.message || 'Logo yuklenemedi.'); return; }
      setForm((f) => ({ ...f, logoUrl: data.url }));
    } catch {
      showToast('error', 'Logo yuklenemedi.');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      if (form.slug) payload.slug = form.slug;
      if (form.bannerUrl) payload.bannerUrl = form.bannerUrl;
      if (form.logoUrl) payload.logoUrl = form.logoUrl;
      payload.themeColor = form.themeColor;
      payload.websitePublished = form.websitePublished;

      const cleanedLinks: Record<string, string> = {};
      Object.entries(form.socialLinks).forEach(([k, v]) => {
        if (v.trim()) cleanedLinks[k] = v.trim();
      });
      if (Object.keys(cleanedLinks).length > 0) payload.socialLinks = cleanedLinks;

      const res = await fetch('/api/club-auth/page-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) { showToast('error', data?.message || 'Kaydetme basarisiz.'); return; }

      showToast('success', 'Sayfa ayarlari kaydedildi!');

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

  const handlePost = async () => {
    if (!postContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch('/api/club-auth/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: postContent.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { showToast('error', data?.message || 'Duyuru paylasilamadi.'); return; }
      showToast('success', 'Duyuru paylasildi!');
      setPostContent('');
      fetchPosts();
    } catch {
      showToast('error', 'Beklenmeyen bir hata olustu.');
    } finally {
      setPosting(false);
    }
  };

  const fetchPosts = async () => {
    if (!club.id) return;
    try {
      const res = await fetch(`/api/clubs/${club.id}/posts?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch {}
  };

  useEffect(() => { fetchPosts(); }, [club.id]);

  const handleEditPost = async (postId: string, content: string) => {
    try {
      const res = await fetch(`/api/club-auth/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) { showToast('error', 'Düzenleme başarısız.'); return; }
      showToast('success', 'Duyuru güncellendi!');
      setEditingPost(null);
      fetchPosts();
    } catch {
      showToast('error', 'Beklenmeyen bir hata oluştu.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    setDeletingPostId(postId);
    try {
      const res = await fetch(`/api/club-auth/posts/${postId}`, { method: 'DELETE' });
      if (!res.ok) { showToast('error', 'Silme başarısız.'); return; }
      showToast('success', 'Duyuru silindi.');
      setPosts((p) => p.filter((post) => post.id !== postId));
    } catch {
      showToast('error', 'Beklenmeyen bir hata oluştu.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/club-auth/logout', { method: 'POST' });
    router.push('/');
  };

  const publicUrl = `/clubs/${form.slug || slug}`;

  return (
    <div className="min-h-screen pb-24">
      {/* Hidden file inputs */}
      <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-sm ${
          toast.type === 'success'
            ? 'border-green-500/30 bg-green-500/10 text-green-400'
            : 'border-red-500/30 bg-red-500/10 text-red-400'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
            : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      <PageHero eyebrow={t('pageTitle')} title={club.name} subtitle={t('subtitle')} image="cam-bina-havadan" compact>
        <div className="flex flex-wrap items-center gap-2">
          {(form.slug || slug) && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-border-light bg-background/50 px-4 py-2 text-sm font-semibold text-text-primary backdrop-blur transition-colors hover:border-primary hover:text-primary">
              <ExternalLink className="h-4 w-4" /> {t('viewPage')}
            </a>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 backdrop-blur transition-colors hover:bg-red-500/20">
            <LogOut className="h-4 w-4" /> {t('logout')}
          </button>
        </div>
      </PageHero>

      <main className="mx-auto max-w-2xl px-6 pt-4">
        {/* Twitter-style preview */}
        <div className="mb-4 overflow-hidden rounded-3xl border border-border bg-surface">
          {/* Banner */}
          <div className="relative h-40 w-full md:h-48 cursor-pointer overflow-hidden bg-surface-light" onClick={() => bannerInputRef.current?.click()}>
            {form.bannerUrl ? (
              <Image src={form.bannerUrl} alt="banner" fill className="object-cover" />
            ) : (
              <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${form.themeColor}33, ${form.themeColor}11)` }} />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
              {uploadingBanner
                ? <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                : <><Camera className="h-6 w-6 text-white" /><span className="ml-2 text-sm font-medium text-white">Banner Değiştir</span></>
              }
            </div>
          </div>

          {/* Logo + info */}
          <div className="relative px-4 pb-4">
            <div className="flex items-end justify-between">
              {/* Logo */}
              <div className="relative -mt-10 cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-surface"
                  style={{ boxShadow: `0 0 0 2px ${form.themeColor}55` }}>
                  {form.logoUrl ? (
                    <Image src={form.logoUrl} alt={club.name} width={80} height={80} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white" style={{ background: form.themeColor }}>
                      {club.name[0]}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  {uploadingLogo
                    ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    : <Camera className="h-5 w-5 text-white" />
                  }
                </div>
              </div>

              {/* Publish toggle */}
              <button onClick={() => setForm((f) => ({ ...f, websitePublished: !f.websitePublished }))}
                className={`mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  form.websitePublished
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'border border-border-light text-text-secondary hover:bg-white/5'
                }`}>
                {form.websitePublished ? <><Eye className="h-3.5 w-3.5" /> Yayında</> : <><EyeOff className="h-3.5 w-3.5" /> Gizli</>}
              </button>
            </div>

            <p className="mt-2 text-xs text-text-muted">
              Logo ve banner için fotoğrafa tıkla
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Slug */}
          <div className="rounded-3xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-text-muted" />
              <h2 className="font-bold text-text-primary">Sayfa Adresi (Slug)</h2>
            </div>
            <p className="mb-3 text-xs text-text-muted">
              URL: iytemobil.com/clubs/<strong className="text-text-secondary">{form.slug || 'slug-belirleyin'}</strong>
            </p>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({
                ...f,
                slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              }))}
              placeholder="yazilim-toplulugu"
              className="w-full rounded-2xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary"
            />
          </div>

          {/* Tema rengi */}
          <div className="rounded-3xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-text-muted" />
              <h2 className="font-bold text-text-primary">Tema Rengi</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map((color) => (
                <button key={color} onClick={() => setForm((f) => ({ ...f, themeColor: color }))}
                  className="h-9 w-9 rounded-full transition-transform hover:scale-110"
                  style={{ backgroundColor: color, outline: form.themeColor === color ? '3px solid white' : 'none', outlineOffset: '2px' }}
                />
              ))}
              <div className="flex items-center gap-2">
                <input type="color" value={form.themeColor}
                  onChange={(e) => setForm((f) => ({ ...f, themeColor: e.target.value }))}
                  className="h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent p-0"
                />
                <span className="text-xs text-text-muted">{form.themeColor}</span>
              </div>
            </div>
          </div>

          {/* Sosyal medya */}
          <div className="rounded-3xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-text-muted" />
              <h2 className="font-bold text-text-primary">Sosyal Medya Linkleri</h2>
            </div>
            <div className="flex flex-col gap-3">
              {([
                { key: 'instagram', Icon: Instagram, placeholder: 'https://instagram.com/toplulugunuz' },
                { key: 'twitter', Icon: Twitter, placeholder: 'https://twitter.com/toplulugunuz' },
                { key: 'linkedin', Icon: Linkedin, placeholder: 'https://linkedin.com/company/toplulugunuz' },
                { key: 'youtube', Icon: Youtube, placeholder: 'https://youtube.com/@toplulugunuz' },
                { key: 'website', Icon: Globe, placeholder: 'https://toplulugunuz.com' },
              ] as const).map(({ key, Icon, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 flex-shrink-0 text-text-muted" />
                  <input type="url" value={form.socialLinks[key]}
                    onChange={(e) => setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [key]: e.target.value } }))}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 rounded-2xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Duyuru paylaş */}
          <div className="rounded-3xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-text-muted" />
              <h2 className="font-bold text-text-primary">Duyuru Paylaş</h2>
            </div>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Etkinlik duyurusu, haber veya herhangi bir şey paylaşın..."
              maxLength={500}
              rows={4}
              className="w-full resize-none rounded-2xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-text-muted">{postContent.length}/500</span>
              <button
                onClick={handlePost}
                disabled={posting || !postContent.trim()}
                className="flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: form.themeColor }}
              >
                {posting
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <Send className="h-4 w-4" />}
                {posting ? 'Paylaşılıyor...' : 'Paylaş'}
              </button>
            </div>
          </div>

          {/* Duyuru listesi */}
          {posts.length > 0 && (
            <div className="rounded-3xl border border-border bg-surface p-5">
              <h2 className="mb-4 font-bold text-text-primary">Yayımlanan Duyurular</h2>
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-border bg-surface-light/50 p-4">
                    {editingPost?.id === post.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editingPost.content}
                          onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                          maxLength={500}
                          rows={3}
                          className="w-full resize-none rounded-2xl border border-border bg-surface-light px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPost(post.id, editingPost.content)}
                            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                            style={{ backgroundColor: form.themeColor }}
                          >
                            <Save className="h-3.5 w-3.5" /> Kaydet
                          </button>
                          <button
                            onClick={() => setEditingPost(null)}
                            className="flex items-center gap-1.5 rounded-full border border-border-light px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
                          >
                            <X className="h-3.5 w-3.5" /> İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-text-primary/90 whitespace-pre-wrap line-clamp-3">{post.content}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-text-muted">
                            {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                            {post.isEdited && ' (düzenlendi)'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingPost({ id: post.id, content: post.content })}
                              className="flex items-center gap-1 rounded-full border border-border-light px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary"
                            >
                              <Pencil className="h-3 w-3" /> Düzenle
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              disabled={deletingPostId === post.id}
                              className="flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                            >
                              <Trash2 className="h-3 w-3" /> Sil
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
          <button onClick={handleSave} disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: form.themeColor }}>
            {saving
              ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              : <Save className="h-4 w-4" />}
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </main>
    </div>
  );
}
