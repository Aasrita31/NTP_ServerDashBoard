import { useEffect, useState } from "react";

export interface DigitalUTCProps {
  epochMs?: number;
  displayMs?: number;
  tone?: "cyan" | "blue";
  heading?: string;
  footer?: string;
}

export function DigitalUTC({
  epochMs,
  displayMs,
  tone = "cyan",
  heading = "◆ MASTER UTC SYNCHRONIZED ◆",
  footer = "COORDINATED UNIVERSAL TIME",
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
  const date = now.toISOString().substring(0, 10);
  return (
    <div className="text-center digital-contrast digital-utc mt-6" suppressHydrationWarning>
      <div className={`text-[10px] tracking-[0.5em] font-mono mb-4 ${toneClasses.heading}`}>
        {heading}
      </div>
      {!mounted ? (
        <div className={`font-mono text-5xl font-bold tracking-[0.15em] tabular-nums ${toneClasses.time}`}>
          <span className="mr-2 time-main">00:00:00</span>
          <span className="align-super font-normal time-ms">.000</span>
        </div>
      ) : (() => {
        const parts = time.split('.');
        const main = parts[0] ?? time;
        const ms = parts[1] ?? '';
        return (
          <div className={`font-mono text-5xl font-bold tracking-[0.15em] tabular-nums ${toneClasses.time}`}>
            <span className="mr-2 time-main">{main}</span>
            <span className="align-super font-normal time-ms">.{ms}</span>
          </div>
        );
      })()}
      <div className={`text-xs font-mono mt-1 tracking-widest ${toneClasses.date}`}>
        {date} • {footer}
      </div>
    </div>
  );
}
