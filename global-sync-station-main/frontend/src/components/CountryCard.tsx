import { useEffect, useMemo, useState } from "react";

export interface CountryCardMetrics {
  delayMs: string;
  offsetMs: string;
  jitterMs: string;
  pdvMs: string;
  driftPpm: string;
  reach: string;
  pollS: number;
  holdover: boolean;
  qualityLabel: "LOCKED" | "NOMINAL" | "DRIFT" | "HOLDOVER";
}

export interface CountryCardProps {
  flag: string;
  iso: string;
  name: string;
  code: string;
  tz: string;
  offsetLabel: string;
  accent?: string;
  // NTP engineering metadata
  peer: string;        // upstream peer hostname
  refid: string;       // reference clock identifier (.GPS., .PPS., .DCFa., NIST, etc.)
  stratum: 1 | 2;      // hierarchy level
  baseRtt: number;     // round-trip latency in ms (geographically realistic)
  baseDrift: number;   // clock drift in ppm
  poll?: number;       // poll exponent (2^n seconds) — typical 6..10
  time?: string;
  date?: string;
  metrics?: CountryCardMetrics;
}

// Deterministic pseudo-random in [-1, 1] from a string + tick — keeps each
// node's jitter pattern stable across renders.
function seeded(seed: string, t: number) {
  let h = 2166136261;
  const s = seed + ":" + t;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) / 0xffffffff) * 2 - 1;
}

export function CountryCard(p: CountryCardProps & { compareMode?: boolean; onCompareSelect?: (code: string) => void; compareSelected?: boolean }) {
  const { flag, iso, name, code, tz, offsetLabel, accent,
          peer, refid, stratum, baseRtt, baseDrift, poll = 8, time: liveTime, date: liveDate, metrics: liveMetrics } = p;
  const { compareMode, onCompareSelect, compareSelected } = p as any;

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }).format(now));
      setDate(new Intl.DateTimeFormat("en-GB", {
        timeZone: tz, day: "2-digit", month: "short", year: "numeric",
      }).format(now));
      setTick(Math.floor(now.getTime() / 1000));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [tz]);

  // Live-jittered metrics — stable per-second, small deviations around base.
  // Modeled to mirror enterprise NTP/PTP telemetry (RFC 5905 + ITU-T G.8273).
  const localMetrics = useMemo(() => {
    // Path delay — regional links jitter tighter than intercontinental ones.
    const isIntercontinental = baseRtt >= 80;
    const jitterScale = isIntercontinental ? baseRtt * 0.035 + 0.8 : baseRtt * 0.06 + 0.25;
    const rttJitter = seeded(code + "rtt", tick) * jitterScale;
    const delay = Math.max(0.4, baseRtt + rttJitter);

    // Clock offset bounds by stratum (enterprise sync targets).
    //   S1: ±0.01–0.5 ms   |   S2: ±0.5–3 ms
    const offRand = seeded(code + "off", tick);
    const slowWander = seeded(code + "ofw", Math.floor(tick / 11)) * 0.4;
    const offsetRaw = stratum === 1
      ? offRand * 0.42 + slowWander * 0.08   // tight, ≈±0.5 ms peak
      : offRand * 2.4  + slowWander * 0.6;   // looser, ≈±3 ms peak
    const offset = Math.max(-3, Math.min(3, offsetRaw));

    // Wander jitter — RMS of last few samples, never perfectly flat.
    const jBase = stratum === 1 ? 0.08 : 0.35;
    const jitter = Math.abs(seeded(code + "jit", tick)) * (stratum === 1 ? 0.35 : 0.95) + jBase;

    // Packet Delay Variation (IETF RFC 5481) — short-term delay spread.
    const pdv = Math.abs(seeded(code + "pdv", tick)) * (isIntercontinental ? 2.4 : 0.8) + 0.05;

    // Frequency drift in ppm — slow oscillation typical of OCXO/Rb holdover.
    const drift = baseDrift + seeded(code + "drf", Math.floor(tick / 8)) * 0.12;

    // Reach register — occasional dropped poll (0o376, 0o375…) keeps it honest.
    const dropRoll = seeded(code + "rch", Math.floor(tick / 17));
    let reach = 0o377;
    if (dropRoll > 0.82) reach = 0o376;
    else if (dropRoll < -0.9) reach = 0o375;

    // Brief HOLDOVER windows (~3% duty) — disciplined oscillator coasting.
    const hoRoll = seeded(code + "ho", Math.floor(tick / 23));
    const holdover = hoRoll > 0.94;

    return {
      delayMs:   delay.toFixed(2),
      offsetMs:  (offset >= 0 ? "+" : "") + offset.toFixed(3),
      jitterMs:  jitter.toFixed(3),
      pdvMs:     pdv.toFixed(3),
      driftPpm:  (drift >= 0 ? "+" : "") + drift.toFixed(3),
      reach:     reach.toString(8).padStart(3, "0"),
      pollS:     (1 << poll),
      holdover,
    };
  }, [tick, code, baseRtt, baseDrift, poll, stratum]);

  // Prefer locally computed timezone time/date so each card shows its specific timing.
  const displayTime = time;
  const displayDate = date;
  const displayMetrics = liveMetrics ?? localMetrics;

  const flagUrl = `https://flagcdn.com/w160/${iso}.png`;
  const flagUrlLarge = `https://flagcdn.com/w320/${iso}.png`;

  const waveDelay = `${(code.charCodeAt(0) + code.charCodeAt(code.length - 1)) % 7 * 0.18}s`;

  const tintStyle = accent
    ? { background: `linear-gradient(135deg, ${accent}26, ${accent}0d 60%, transparent)` }
    : undefined;

  // Sync quality classification — stratum-aware thresholds + holdover state.
  const offsetAbs = Math.abs(parseFloat(displayMetrics.offsetMs));
  const lockThr   = stratum === 1 ? 0.15 : 1.0;
  const nomThr    = stratum === 1 ? 0.40 : 2.2;
  const qualityLabel = displayMetrics.holdover
    ? "HOLDOVER"
    : offsetAbs < lockThr ? "LOCKED"
    : offsetAbs < nomThr  ? "NOMINAL"
    : "DRIFT";

  const [open, setOpen] = useState(false);

  return (
    <>
    <button
      type="button"
      onClick={() => {
        if (compareMode && onCompareSelect) return onCompareSelect(code);
        setOpen(true);
      }}
      className={
        `glass glass-hover country-card rounded-xl p-5 relative overflow-hidden group text-left w-full focus:outline-none ` +
        (compareSelected ? "ring-4 ring-primary/40" : "focus-visible:ring-2 focus-visible:ring-cyan-glow/60")
      }
    >
      {accent && <div className="absolute inset-0 pointer-events-none" style={tintStyle} />}
      <div
        className="flag-bg-wave absolute inset-0 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-500 pointer-events-none bg-center bg-cover"
        style={{ backgroundImage: `url(${flagUrlLarge})` }}
      />

      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-glow" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-glow" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-glow" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-glow" />

      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flag-wrap relative w-10 h-7 rounded-sm overflow-hidden shadow-[0_0_10px_oklch(0.85_0.18_78/0.35)] ring-1 ring-cyan-glow/40 shrink-0">
            <img src={flagUrl} alt={`${name} flag`} loading="lazy"
              className="flag-img w-full h-full object-cover" draggable={false} style={{ animationDelay: waveDelay }} />
            <span className="sr-only">{flag}</span>
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider">{name}</div>
            <div className="text-[10px] text-muted-foreground font-mono tracking-[0.2em]">{code} • NTP-SYNC</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-online opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-online shadow-[0_0_6px_oklch(0.78_0.22_145)]" />
          </span>
          <span className="text-[9px] text-online font-mono tracking-widest">ONLINE</span>
        </div>
      </div>

      <div className="relative font-mono text-3xl tracking-wider text-glow text-cyan-glow tabular-nums">
        {displayTime || "--:--:--"}
      </div>
      <div className="relative flex items-center justify-between mt-2 text-[11px] font-mono">
        <span className="text-muted-foreground">{displayDate}</span>
        <span className="px-2 py-0.5 rounded border border-cyan-glow/40 text-cyan-glow bg-cyan-glow/5">
          {offsetLabel}
        </span>
      </div>

      <div className="absolute inset-x-0 h-px scanline top-0 opacity-0 group-hover:opacity-100 group-hover:animate-scan pointer-events-none" />
    </button>

    {open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      >
        <div
          className="glass relative w-full max-w-md rounded-2xl p-6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {accent && <div className="absolute inset-0 pointer-events-none opacity-60" style={tintStyle} />}
          <div
            className="flag-bg-wave absolute inset-0 opacity-[0.08] pointer-events-none bg-center bg-cover"
            style={{ backgroundImage: `url(${flagUrlLarge})` }}
          />

          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-glow" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-glow" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-glow" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-glow" />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-md flex items-center justify-center text-cyan-glow border border-cyan-glow/40 hover:bg-cyan-glow/10 font-mono text-sm"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="relative flex items-center gap-3 mb-4">
            <div className="flag-wrap relative w-14 h-10 rounded-sm overflow-hidden shadow-[0_0_14px_oklch(0.85_0.18_78/0.5)] ring-1 ring-cyan-glow/50 shrink-0">
              <img src={flagUrlLarge} alt={`${name} flag`}
                className="flag-img w-full h-full object-cover" draggable={false} style={{ animationDelay: waveDelay }} />
            </div>
            <div>
              <div className="text-base font-bold tracking-wider">{name}</div>
              <div className="text-[10px] text-muted-foreground font-mono tracking-[0.2em]">
                {code} • {tz} • {offsetLabel}
              </div>
            </div>
          </div>

          {(() => {
            const tone =
              qualityLabel === "LOCKED"   ? "text-online border-online/40 bg-online/5"
            : qualityLabel === "NOMINAL"  ? "text-cyan-glow border-cyan-glow/40 bg-cyan-glow/5"
            : qualityLabel === "HOLDOVER" ? "text-purple-600 border-purple-600/40 bg-purple-600/5"
            :                               "text-rose-400 border-rose-400/40 bg-rose-400/5";
            return (
              <div className="relative flex items-center justify-between mb-4">
                <div className="font-mono text-3xl tracking-wider text-glow text-cyan-glow tabular-nums">
                  {displayTime || "--:--:--"}
                </div>
                <span className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded border ${tone}`}>
                  {qualityLabel}
                </span>
              </div>
            );
          })()}

          <div className="relative grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px] border-t border-cyan-glow/15 pt-3">
            <Metric label="STRATUM" value={`S${stratum}`} />
            <Metric label="REFID"   value={refid} />
            <Metric label="OFFSET"  value={`${displayMetrics.offsetMs} ms`} />
            <Metric label="JITTER"  value={`${displayMetrics.jitterMs} ms`} />
            <Metric label="DELAY"   value={`${displayMetrics.delayMs} ms`} />
            <Metric label="PDV"     value={`${displayMetrics.pdvMs} ms`} />
            <Metric label="DRIFT"   value={`${displayMetrics.driftPpm} ppm`} />
            <Metric label="POLL"    value={`${displayMetrics.pollS}s`} />
            <Metric label="REACH"   value={`0${displayMetrics.reach}`} />
            <Metric label="STATE"   value={displayMetrics.holdover ? "HOLDOVER" : "TRACKING"} />
          </div>

          <div className="relative mt-3 text-[10px] font-mono text-muted-foreground/90 tracking-wider truncate">
            peer: <span className="text-cyan-glow">{peer}</span>
          </div>
          <div className="relative mt-1 text-[10px] font-mono text-muted-foreground/70 tracking-wider">
            date: <span className="text-foreground/90">{displayDate}</span>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-muted-foreground tracking-[0.15em]">{label}</span>
      <span className="text-cyan-glow/95 tabular-nums">{value}</span>
    </div>
  );
}
