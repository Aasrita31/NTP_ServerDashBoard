import React, { useEffect, useState } from 'react';

type Office = {
  iso?: string;
  epoch_ms?: number;
  host?: string;
  port?: number;
  label?: string;
};

export default function OfficeDebugger() {
  const [office, setOffice] = useState<Office | null>(null);
  useEffect(() => {
    let cancelled = false;
    const fetchOnce = async () => {
      try {
        // Use relative /api/utc so Vite dev proxy forwards to backend
        const r = await fetch('/api/utc');
        if (!r.ok) return;
        const j = await r.json();
        if (cancelled) return;
        setOffice(j.office ?? { iso: j.iso, epoch_ms: j.epoch_ms, host: 'backend', port: 0, label: 'BACKEND' });
      } catch (e) {
        console.error('OfficeDebugger fetch failed:', e);
      }
    };
    fetchOnce();
    const id = window.setInterval(fetchOnce, 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!office) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-background/95 border-2 border-cyan-glow/60 px-4 py-3 rounded-lg text-xs font-mono shadow-[0_0_25px_rgba(0,217,255,0.4)]">
      <div className="text-[10px] text-cyan-glow/80 font-bold tracking-[0.15em]">Office Debug</div>
      <div className="text-sm text-cyan-glow font-bold mt-2 shadow-[0_0_10px_rgba(0,217,255,0.6)]">{office.iso ? office.iso.replace('T',' ').replace('Z',' UTC') : 'no iso'}</div>
      <div className="text-[11px] text-cyan-glow font-bold mt-2 tracking-[0.1em]">{office.host}:{office.port}</div>
    </div>
  );
}
