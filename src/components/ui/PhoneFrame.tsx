import { BatteryFull, Signal, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-[1264/2620] w-[270px] rounded-[2.6rem] border border-border-light bg-surface p-2.5 shadow-[0_40px_120px_-20px_rgba(230,57,70,0.35)] md:w-[300px]',
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-background">
        <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between px-6 text-[11px] font-semibold text-text-primary">
          <span>9:41</span>
          <span className="absolute left-1/2 top-2 h-[18px] w-20 -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-8">{children}</div>
      </div>
    </div>
  );
}
