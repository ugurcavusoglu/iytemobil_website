import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({
  children,
  className,
  from = '#dc2626',
  to = '#f97316',
}: GradientTextProps) {
  return (
    <span
      className={cn('bg-clip-text text-transparent bg-gradient-to-r', className)}
      style={{ backgroundImage: `linear-gradient(to right, ${from}, ${to})` }}
    >
      {children}
    </span>
  );
}
