import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';
import { ClubDashboard } from '@/components/club/ClubDashboard';

async function getClubFromToken(token: string) {
  try {
    const res = await fetch(`${resolveClubApplicationApiBase()}/api/clubs/me/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.club || null;
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ locale: string }> };

export default async function ClubSetupPage({ params }: Props) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('club_token')?.value;

  if (!token) {
    redirect(`/${locale}/clubs/login`);
  }

  const club = await getClubFromToken(token);

  if (!club) {
    redirect(`/${locale}/clubs/login`);
  }

  // Slug varsa direkt dashboard'a gönder
  if (club.slug) {
    redirect(`/${locale}/clubs/${club.slug}/dashboard`);
  }

  return <ClubDashboard club={club} slug="" />;
}
