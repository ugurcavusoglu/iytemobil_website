import { BatteryFull, Signal, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-[1/1.97] w-[270px] rounded-[2.6rem] [container-type:inline-size] border border-border-light bg-surface p-2.5 shadow-[0_40px_120px_-20px_rgba(230,57,70,0.35)] md:w-[300px]',
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[12cqw] bg-background">
        <div className="absolute inset-x-0 top-0 z-10 flex h-[11cqw] items-center justify-between px-[8cqw] text-[4cqw] font-semibold text-text-primary">
          <span>9:41</span>
          <span className="absolute left-1/2 top-[3cqw] h-[6.5cqw] w-[28cqw] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-[1.4cqw]">
            <Signal className="h-[4.4cqw] w-[4.4cqw]" />
            <Wifi className="h-[4.4cqw] w-[4.4cqw]" />
            <BatteryFull className="h-[5.2cqw] w-[5.2cqw]" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-[11cqw]">{children}</div>
      </div>
    </div>
  );
}
