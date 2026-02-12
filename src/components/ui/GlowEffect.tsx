interface GlowEffectProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-32 h-32',
  md: 'w-64 h-64',
  lg: 'w-96 h-96',
};

export function GlowEffect({ className = '', color = 'rgba(220, 38, 38, 0.15)', size = 'md' }: GlowEffectProps) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${sizeMap[size]} ${className}`}
      style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
    />
  );
}
