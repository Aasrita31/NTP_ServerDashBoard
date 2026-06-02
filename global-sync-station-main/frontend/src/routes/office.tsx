import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, LineMetricChart, AreaMetricChart } from '@/components/dashboard/MiniCharts';
import { DigitalUTC } from '@/components/DigitalUTC';
import { useLiveData } from '@/components/LiveDataContext';

const OFFICE_ENDPOINTS = [
  'http://localhost:8000/api/utc',
  'http://127.0.0.1:8000/api/utc',
];

const officeSync = Array.from({ length: 12 }, (_, i) => ({ t: `${i * 5}m`, v: 90 + Math.sin(i / 1.8) * 5 }));
const officeJitter = Array.from({ length: 12 }, (_, i) => ({ t: `${i * 5}m`, v: 0.2 + Math.cos(i / 2) * 0.08 }));

function OfficePage(){
  const { activityFeed, officeSnapshot } = useLiveData();
  const [officeLive, setOfficeLive] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchOffice = async () => {
      for (const endpoint of OFFICE_ENDPOINTS) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) continue;
          const payload = await response.json();
          if (!cancelled) setOfficeLive(payload.office ?? payload);
          return;
        } catch {
          continue;
        }
      }
    };

    fetchOffice();
    const pollId = window.setInterval(fetchOffice, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(pollId);
    };
  }, []);

  const office = officeLive ?? officeSnapshot;
  const officeLabel = office?.label ?? 'OFFICE NTP SERVER';
  const officeTime = office?.office_utc ?? office?.iso ?? '08:43:45.893 UTC';
  const officeHost = office ? `${office.host ?? '10.26.13.44'}:${office.port ?? 123}` : '10.26.13.44:123';
  const officeStatus = office?.status ?? (office ? 'CONNECTED' : 'CONNECTING');
  const delayMs = typeof office?.delay_ms === 'number'
    ? office.delay_ms
    : typeof office?.root_delay_ms === 'number'
      ? office.root_delay_ms
      : 0;
  const driftMs = typeof office?.offset_ms === 'number'
    ? office.offset_ms
    : typeof office?.difference_ms === 'number'
      ? office.difference_ms
      : 0;
  const officeEpochMs = office?.epoch_ms ?? (office?.office_utc ? new Date(office.office_utc).getTime() : Date.now());

  const formatDelta = (value: number | null) => {
    if (value === null || Number.isNaN(value)) return '-- ms';
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${Math.abs(value).toFixed(3)} ms`;
  };
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">IITTNIF NTP Server</h1>
        <p className="text-sm text-muted-foreground mt-2">Local NTP server details, logs, and controls.</p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 glass">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">OFFICE NTP SERVER</div>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-cyan-glow/80">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_currentColor]" />
            <span>{officeStatus}</span>
          </div>
          <div className="mt-4">
            <DigitalUTC epochMs={officeEpochMs} />
            <div className="mt-3 text-[10px] font-mono tracking-[0.28em] text-cyan-glow/70">
              IITTNIF SERVER UTC • {officeHost}
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">{officeLabel} • live office time synchronized from the backend office NTP feed</div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-cyan-glow/20 p-3 text-center"><div className="text-[10px] text-muted-foreground">Delay</div><div className="text-cyan-glow font-bold">{formatDelta(delayMs)}</div></div>
            <div className="rounded-lg border border-cyan-glow/20 p-3 text-center"><div className="text-[10px] text-muted-foreground">Drift</div><div className="text-cyan-glow font-bold">{formatDelta(driftMs)}</div></div>
            <div className="rounded-lg border border-cyan-glow/20 p-3 text-center"><div className="text-[10px] text-muted-foreground">Stratum</div><div className="text-cyan-glow font-bold">{office?.stratum ?? 2}</div></div>
            <div className="rounded-lg border border-cyan-glow/20 p-3 text-center"><div className="text-[10px] text-muted-foreground">Clients</div><div className="text-cyan-glow font-bold">{Math.max(12, activityFeed.length)}</div></div>
          </div>
        </Card>
        <ChartCard title="Office Sync Stability" note="time correction behavior from upstream sync">
          <LineMetricChart data={officeSync} yKey="v" />
        </ChartCard>
        <ChartCard title="Jitter Window" note="timing variance in milliseconds">
          <AreaMetricChart data={officeJitter} yKey="v" />
        </ChartCard>
        <Card className="p-5 glass">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">RECENT EVENTS</div>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-3">08:43:45 • Sync complete • offset -0.089s</div>
            <div className="rounded-lg border border-cyan-glow/20 p-3">08:42:10 • Peer health check OK</div>
            <div className="rounded-lg border border-cyan-glow/20 p-3">08:39:32 • Drift correction applied</div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/office")({
  component: OfficePage,
});
