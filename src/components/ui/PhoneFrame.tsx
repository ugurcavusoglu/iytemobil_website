import { cn } from '@/lib/utils';

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-[1264/2450] w-[270px] rounded-[2.6rem] border border-border-light bg-surface p-2.5 shadow-[0_40px_120px_-20px_rgba(230,57,70,0.35)] md:w-[300px]',
        className,
      )}
    >
      <div className="absolute left-1/2 top-4 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-background" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-background">{children}</div>
    </div>
  );
}
