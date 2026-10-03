import Image from 'next/image';

export const CATEGORY_COLORS: Record<string, string> = {
  SPORTS: '#f97316', ART: '#a855f7', TECHNOLOGY: '#3b82f6', ARCHITECTURE: '#14b8a6', TRAVEL: '#22c55e',
  MUSIC: '#ec4899', ACADEMIC: '#f59e0b', SOCIAL: '#06b6d4', OTHER: '#a1a1aa',
};

export function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.OTHER;
}

export function ClubLogo({ name, logoUrl, color, size }: { name: string; logoUrl?: string | null; color: string; size: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, ${color}55)`, padding: 2 }}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-surface">
        {logoUrl ? (
          <Image src={logoUrl} alt={name} fill sizes={`${size}px`} className="object-cover" />
        ) : (
          <span className="font-black" style={{ color, fontSize: size * 0.42 }}>{name.charAt(0)}</span>
        )}
      </div>
    </div>
  );
}
