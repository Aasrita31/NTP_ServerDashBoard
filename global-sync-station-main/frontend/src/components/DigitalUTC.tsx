import { useEffect, useState } from "react";

export interface DigitalUTCProps {
  epochMs?: number;
}

export function DigitalUTC({ epochMs }: DigitalUTCProps) {
  const [now, setNow] = useState(() => new Date(epochMs ?? Date.now()));
  useEffect(() => {
    const refTime = epochMs ?? Date.now();
    const offset = refTime - Date.now();

    setNow(new Date(Date.now() + offset));

    const id = setInterval(() => {
      setNow(new Date(Date.now() + offset));
    }, 100);

    return () => clearInterval(id);
  }, [epochMs]);
  const time = now.toISOString().substring(11, 23);
  const date = now.toISOString().substring(0, 10);
  return (
    <div className="text-center digital-contrast">
      <div className="text-[10px] tracking-[0.5em] text-cyan-glow/70 font-mono mb-1">
        ◆ MASTER UTC SYNCHRONIZED ◆
      </div>
      {
        (() => {
          const parts = time.split('.');
          const main = parts[0] ?? time;
          const ms = parts[1] ?? '';
          return (
            <div className="font-mono text-5xl font-bold tracking-[0.15em] text-glow tabular-nums">
              <span className="mr-2 time-main">{main}</span>
              <span className="align-super font-normal time-ms">.{ms}</span>
            </div>
          );
        })()
      }
      <div className="text-xs text-muted-foreground font-mono mt-1 tracking-widest">
        {date} • COORDINATED UNIVERSAL TIME
      </div>
    </div>
  );
}
