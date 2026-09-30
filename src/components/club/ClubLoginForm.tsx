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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">
          E-posta veya Kullanıcı Adı
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="topluluk@ornek.com veya kullanici_adi"
            autoComplete="username"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30 focus:ring-1 focus:ring-white/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">Şifre</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30 focus:ring-1 focus:ring-white/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>

      <p className="text-center text-xs text-white/30">
        İYTE Mobil uygulamasındaki topluluk hesabı bilgilerinizle giriş yapın
      </p>
    </form>
  );
}
