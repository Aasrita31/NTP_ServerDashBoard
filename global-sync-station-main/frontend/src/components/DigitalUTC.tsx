import { useEffect, useState } from "react";

export interface DigitalUTCProps {
  epochMs?: number;
  displayMs?: number;
  tone?: "cyan" | "blue";
  heading?: string;
  footer?: string;
  variant?: 'normal' | 'large';
}

export function DigitalUTC({
  epochMs,
  displayMs,
  tone = "cyan",
  heading = "◆ MASTER UTC SYNCHRONIZED ◆",
  footer = "COORDINATED UNIVERSAL TIME",
  variant = 'normal',
}: DigitalUTCProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date(epochMs ?? 0));

  const toneClasses = tone === "blue"
    ? {
        heading: "text-blue-400/70",
        time: "text-blue-400",
        date: "text-blue-400/60",
      }
    : {
        heading: "text-cyan-glow/70",
        time: "text-glow text-cyan-glow",
        date: "text-muted-foreground",
      };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (displayMs !== undefined) {
      setNow(new Date(displayMs));
      return;
    }

    const refTime = epochMs ?? Date.now();
    const offset = refTime - Date.now();

    setNow(new Date(Date.now() + offset));

    const id = setInterval(() => {
      setNow(new Date(Date.now() + offset));
    }, 100);

    return () => clearInterval(id);
  }, [epochMs, mounted, displayMs]);
  const time = now.toISOString().substring(11, 23);
  const isLarge = variant === 'large';
  const timeSizeClass = isLarge ? 'text-[3.25rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem]' : 'text-5xl';
  const headingSizeClass = isLarge ? 'text-[12px] sm:text-[14px]' : 'text-[10px]';
  const dateSizeClass = isLarge ? 'text-sm' : 'text-xs';
  const date = now.toISOString().substring(0, 10);
  return (
    <div className={`text-center digital-contrast digital-utc mt-2 ${isLarge ? 'bright-digital-large p-6 rounded-xl' : ''}`} suppressHydrationWarning>
      <div className={`${headingSizeClass} tracking-[0.5em] font-mono mb-4 ${toneClasses.heading}`}>
        {heading}
      </div>
      {!mounted ? (
        <div className={`digital-time-line font-mono ${timeSizeClass} font-extrabold tracking-[0.08em] tabular-nums ${toneClasses.time}`}>
          <span className="time-main">00:00:00</span>
          <span className="time-ms">.000</span>
        </div>
      ) : (() => {
        const parts = time.split('.');
        const main = parts[0] ?? time;
        const ms = parts[1] ?? '';
        return (
          <div className={`digital-time-line font-mono ${timeSizeClass} font-extrabold tracking-[0.08em] tabular-nums ${toneClasses.time}`}>
            <span className="time-main">{main}</span>
            <span className="time-ms">.{ms}</span>
          </div>
        );
      })()}
      <div className={`${dateSizeClass} font-mono mt-1 tracking-widest ${toneClasses.date}`}>
        {date} • {footer}
      </div>
    </div>
  );
}
