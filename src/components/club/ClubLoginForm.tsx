'use client';

import { useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export function ClubLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('E-posta/kullanıcı adı ve şifre gerekli.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/club-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: identifier.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || 'Giriş başarısız.');
        return;
      }

      // Kendi dashboard'una yönlendir
      const clubSlug = data?.club?.slug;
      if (clubSlug) {
        router.push(`/clubs/${clubSlug}/dashboard`);
      } else {
        router.push('/clubs/setup');
      }
    } catch {
      setError('Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-text-secondary">
          E-posta veya Kullanıcı Adı
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="topluluk@ornek.com veya kullanici_adi"
            autoComplete="username"
            className="w-full rounded-2xl border border-border bg-surface-light py-3.5 pl-11 pr-4 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-text-secondary">Şifre</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full rounded-2xl border border-border bg-surface-light py-3.5 pl-11 pr-11 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>

      <p className="text-center text-xs text-text-muted">
        İYTE Mobil uygulamasındaki topluluk hesabı bilgilerinizle giriş yapın
      </p>
    </form>
  );
}
