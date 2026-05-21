import { useEffect, useState } from "react";

export interface AnalogClockProps {
  epochMs?: number;
}

export function AnalogClock({ epochMs }: AnalogClockProps) {
  const [now, setNow] = useState(() => new Date(epochMs ?? Date.now()));
  useEffect(() => {
    const refTime = epochMs ?? Date.now();
    const offset = refTime - Date.now();

    setNow(new Date(Date.now() + offset));

    const id = setInterval(() => {
      setNow(new Date(Date.now() + offset));
    }, 1000);

    return () => clearInterval(id);
  }, [epochMs]);

  const utc = {
    h: now.getUTCHours() % 12,
    m: now.getUTCMinutes(),
    s: now.getUTCSeconds(),
  };
  const secAngle = utc.s * 6;
  const minAngle = utc.m * 6 + utc.s * 0.1;
  const hourAngle = utc.h * 30 + utc.m * 0.5;

  return (
    <div className="relative w-56 h-56">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,oklch(0.85_0.18_78/0.4),transparent_40%,oklch(0.85_0.18_78/0.6),transparent_80%)] blur-md animate-spin-slow" />
      {/* Metallic bezel */}
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_45deg,oklch(0.35_0.04_250),oklch(0.6_0.05_220),oklch(0.25_0.03_250),oklch(0.55_0.05_220),oklch(0.35_0.04_250))] p-[3px] shadow-[0_0_40px_oklch(0.85_0.18_78/0.5)]">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[oklch(0.15_0.04_250)] to-[oklch(0.08_0.02_250)] relative overflow-hidden border border-cyan-glow/40">
          {/* Tick marks */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 origin-bottom"
              style={{
                height: "50%",
                transform: `translateX(-50%) rotate(${i * 6}deg)`,
              }}
            >
              <div
                className={i % 5 === 0 ? "w-[2px] h-3 bg-cyan-glow shadow-[0_0_6px_oklch(0.85_0.18_78)]" : "w-px h-1.5 bg-cyan-glow/40"}
              />
            </div>
          ))}
          {/* Numerals */}
          {[12, 3, 6, 9].map((n, i) => {
            const angle = i * 90;
            return (
              <div
                key={n}
                className="absolute left-1/2 top-1/2 text-cyan-glow text-xs font-mono font-bold text-glow"
                style={{
                  transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-78px) rotate(${-angle}deg)`,
                }}
              >
                {n.toString().padStart(2, "0")}
              </div>
            );
          })}
          {/* Hour hand */}
          <div className="absolute left-1/2 top-1/2 origin-bottom" style={{ height: "28%", transform: `translate(-50%,-100%) rotate(${hourAngle}deg)` }}>
            <div className="w-1.5 h-full bg-gradient-to-t from-cyan-glow to-white rounded-full shadow-[0_0_8px_oklch(0.85_0.18_78)]" />
          </div>
          {/* Minute hand */}
          <div className="absolute left-1/2 top-1/2 origin-bottom" style={{ height: "38%", transform: `translate(-50%,-100%) rotate(${minAngle}deg)` }}>
            <div className="w-1 h-full bg-gradient-to-t from-cyan-glow to-white rounded-full shadow-[0_0_8px_oklch(0.85_0.18_78)]" />
          </div>
          {/* Second hand */}
          <div className="absolute left-1/2 top-1/2 origin-bottom" style={{ height: "44%", transform: `translate(-50%,-100%) rotate(${secAngle}deg)` }}>
            <div className="w-px h-full bg-[oklch(0.9_0.25_25)] shadow-[0_0_10px_oklch(0.9_0.25_25)]" />
          </div>
          {/* Center cap */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-glow shadow-[0_0_12px_oklch(0.85_0.18_78)] border border-white/60" />
          {/* MASTER label */}
          <div className="absolute left-1/2 top-[68%] -translate-x-1/2 text-[9px] tracking-[0.3em] text-cyan-glow/70 font-mono">MASTER • UTC</div>
        </div>
      </div>
    </div>
  );
}
