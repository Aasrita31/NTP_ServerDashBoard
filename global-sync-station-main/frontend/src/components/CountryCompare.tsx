import { useEffect, useMemo, useState } from "react";
import type { CountryCardProps } from "@/components/CountryCard";

function seeded(seed: string, t: number) {
  let h = 2166136261;
  const s = seed + ":" + t;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) / 0xffffffff) * 2 - 1;
}

function computeMetrics(c: CountryCardProps, tick: number) {
  const { code, baseRtt, baseDrift, stratum, poll = 8 } = c as CountryCardProps;
  const isIntercontinental = baseRtt >= 80;
  const jitterScale = isIntercontinental ? baseRtt * 0.035 + 0.8 : baseRtt * 0.06 + 0.25;
  const rttJitter = seeded(code + "rtt", tick) * jitterScale;
  const delay = Math.max(0.4, baseRtt + rttJitter);

  const offRand = seeded(code + "off", tick);
  const slowWander = seeded(code + "ofw", Math.floor(tick / 11)) * 0.4;
  const offsetRaw =
    stratum === 1
      ? offRand * 0.42 + slowWander * 0.08
      : offRand * 2.4 + slowWander * 0.6;
  const offset = Math.max(-3, Math.min(3, offsetRaw));

  const jBase = stratum === 1 ? 0.08 : 0.35;
  const jitter = Math.abs(seeded(code + "jit", tick)) * (stratum === 1 ? 0.35 : 0.95) + jBase;

  const pdv = Math.abs(seeded(code + "pdv", tick)) * (isIntercontinental ? 2.4 : 0.8) + 0.05;

  const drift = baseDrift + seeded(code + "drf", Math.floor(tick / 8)) * 0.12;

  return {
    delayMs: delay,
    offsetMs: offset,
    jitterMs: jitter,
    pdvMs: pdv,
    driftPpm: drift,
    pollS: 1 << poll,
  };
}

export default function CountryCompare({ nodes, selectedA, selectedB }: { nodes: readonly CountryCardProps[]; selectedA?: string; selectedB?: string }) {
  const [a, setA] = useState<string>(selectedA ?? (nodes?.[0]?.code ?? ""));
  const [b, setB] = useState<string>(selectedB ?? (nodes?.[1]?.code ?? ""));
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!nodes || nodes.length === 0) return;
    if (!a) setA(nodes[0].code);
    if (!b) setB(nodes[1]?.code ?? nodes[0].code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  const formatMs = (ms: number) => {
    const sign = ms >= 0 ? "+" : "-";
    const abs = Math.abs(ms);
    const hrs = Math.floor(abs / 3600000);
    const mins = Math.floor((abs % 3600000) / 60000);
    const secs = Math.floor((abs % 60000) / 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${sign}${pad(hrs)}:${pad(mins)}:${pad(secs)} (${abs} ms)`;
  };

  const handleCompare = () => {
    if (!a || !b) return;
    const nowMs = Date.now();
    const nowTick = Math.floor(nowMs / 1000);
    const ca = nodes.find((n) => n.code === a) || nodes[0];
    const cb = nodes.find((n) => n.code === b) || nodes[1] || nodes[0];
    const ma = computeMetrics(ca, nowTick);
    const mb = computeMetrics(cb, nowTick);
    const timestamp = new Date(nowMs).toISOString();

    // Local time formatting
    const dateObj = new Date(nowMs);
    const makeFormatter = (tz?: string) =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: tz || "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

    const aLocalTime = makeFormatter((ca as any).tz).format(dateObj);
    const bLocalTime = makeFormatter((cb as any).tz).format(dateObj);

    // compute timezone offset ms by parsing formatted parts -> UTC ms - nowMs
    const getOffsetMs = (tz?: string) => {
      const f = makeFormatter(tz);
      const parts = f.formatToParts(dateObj);
      const map: Record<string, string> = {};
      for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
      const y = Number(map.year || "0");
      const mo = Number(map.month || "1");
      const d = Number(map.day || "1");
      const hh = Number(map.hour || "0");
      const mm = Number(map.minute || "0");
      const ss = Number(map.second || "0");
      return Date.UTC(y, mo - 1, d, hh, mm, ss) - nowMs;
    };

    const offsetAms = getOffsetMs((ca as any).tz);
    const offsetBms = getOffsetMs((cb as any).tz);
    const timeDiffMs = offsetAms - offsetBms;

    setResult({
      timestamp,
      epochMs: nowMs,
      a: { country: ca.name, code: ca.code, localTime: aLocalTime, tz: (ca as any).tz, offsetZoneMs: offsetAms, ...ma },
      b: { country: cb.name, code: cb.code, localTime: bLocalTime, tz: (cb as any).tz, offsetZoneMs: offsetBms, ...mb },
      diff: {
        jitterDiff: Math.abs(ma.jitterMs - mb.jitterMs),
        delayDiff: Math.abs(ma.delayMs - mb.delayMs),
        offsetDiff: Math.abs(ma.offsetMs - mb.offsetMs),
        driftDiff: Math.abs(ma.driftPpm - mb.driftPpm),
        timeDiffMs,
      },
    });
  };

  // If parent provided selectedA/selectedB, auto-run comparison when both are present
  useEffect(() => {
    if (selectedA && selectedB) {
      setA(selectedA);
      setB(selectedB);
      // small timeout to ensure states update
      setTimeout(() => handleCompare(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedA, selectedB]);

  const options = useMemo(() => nodes.map((n) => ({ code: n.code, label: `${n.name} (${n.code})` })), [nodes]);

  return (
    <div className="mt-8 glass rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Compare A</label>
          <select value={a} onChange={(e) => setA(e.target.value)} className="w-full mt-1 p-2 rounded border">
            {options.map((o) => (
              <option key={o.code} value={o.code}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Compare B</label>
          <select value={b} onChange={(e) => setB(e.target.value)} className="w-full mt-1 p-2 rounded border">
            {options.map((o) => (
              <option key={o.code} value={o.code}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-none mt-6">
          <button onClick={handleCompare} className="px-4 py-2 rounded bg-primary text-primary-foreground">
            Compare
          </button>
        </div>
      </div>

      {result && (
        <div>
          <div className="text-xs text-muted-foreground mb-3 font-mono">
            <span className="text-cyan-glow">Snapshot:</span> {result.timestamp} ({result.epochMs} ms)
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-background/60 rounded">
              <div className="text-sm font-bold">
                {result.a.country} ({result.a.code})
              </div>
              <div className="text-[11px] text-muted-foreground mb-2 font-mono">{result.a.tz}</div>
              <div className="text-[12px] font-mono text-cyan-glow mb-2">{result.a.localTime}</div>
              <div className="text-[13px] mt-2 font-mono">Jitter: {result.a.jitterMs.toFixed(3)} ms</div>
              <div className="text-[13px] font-mono">Delay: {result.a.delayMs.toFixed(2)} ms</div>
              <div className="text-[13px] font-mono">Offset: {result.a.offsetMs.toFixed(3)} ms</div>
              <div className="text-[13px] font-mono">Drift: {result.a.driftPpm.toFixed(3)} ppm</div>
            </div>

            <div className="p-3 bg-background/60 rounded">
              <div className="text-sm font-bold">
                {result.b.country} ({result.b.code})
              </div>
              <div className="text-[11px] text-muted-foreground mb-2 font-mono">{result.b.tz}</div>
              <div className="text-[12px] font-mono text-cyan-glow mb-2">{result.b.localTime}</div>
              <div className="text-[13px] mt-2 font-mono">Jitter: {result.b.jitterMs.toFixed(3)} ms</div>
              <div className="text-[13px] font-mono">Delay: {result.b.delayMs.toFixed(2)} ms</div>
              <div className="text-[13px] font-mono">Offset: {result.b.offsetMs.toFixed(3)} ms</div>
              <div className="text-[13px] font-mono">Drift: {result.b.driftPpm.toFixed(3)} ppm</div>
            </div>

            <div className="p-3 bg-background/60 rounded">
              <div className="text-sm font-bold">Difference</div>
              <div className="text-[13px] mt-2 font-mono">Jitter Δ: {result.diff.jitterDiff.toFixed(3)} ms</div>
              <div className="text-[13px] font-mono">Delay Δ: {result.diff.delayDiff.toFixed(2)} ms</div>
              <div className="text-[13px] font-mono">Offset Δ: {result.diff.offsetDiff.toFixed(3)} ms</div>
              <div className="text-[13px] font-mono">Drift Δ: {result.diff.driftDiff.toFixed(3)} ppm</div>
              <div className="text-[13px] font-mono">Time Δ: {formatMs(result.diff.timeDiffMs)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
