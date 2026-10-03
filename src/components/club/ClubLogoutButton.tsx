'use client';

import { useRouter } from '@/i18n/navigation';

export function ClubLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/club-auth/logout', { method: 'POST' });
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 backdrop-blur transition-colors hover:bg-red-500/20"
    >
      Çıkış
    </button>
  );
}
