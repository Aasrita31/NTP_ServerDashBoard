import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, LineMetricChart, AreaMetricChart, PieMetricChart, BarMetricChart } from '@/components/dashboard/MiniCharts';
import { useLiveData } from '@/components/LiveDataContext';

const masterDrift = Array.from({ length: 12 }, (_, i) => ({ t: `${i * 5}m`, v: Math.round((Math.sin(i / 2) * 0.5 + 0.6) * 100) / 100 }));
const syncHealth = [
  { name: 'In sync', value: 72, color: '#56f0ff' },
  { name: 'Pending', value: 18, color: '#2cb7ff' },
  { name: 'Warning', value: 10, color: '#ffb020' },
];
const refSources = [
  { name: 'GPS', value: 7 },
  { name: 'PPS', value: 4 },
  { name: 'Atomic', value: 2 },
  { name: 'NIST', value: 5 },
];

function MasterPage(){
  const { live, apiState } = useLiveData();
  const utc = live?.utc;
  const nodes = live?.nodes ?? [];
  const connectionState = apiState === 'live' ? 'LIVE' : apiState === 'connecting' ? 'CONNECTING' : 'OFFLINE';
  const nodeCount = nodes.length;
  const stratum = utc?.stratum ?? 1;
  const leap = utc?.leap ?? 'NONE';
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Master UTC Clock</h1>
        <p className="text-sm text-muted-foreground mt-2">Primary reference time source — Coordinated Universal Time (UTC).</p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card className="p-6 glass">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">CLOCK STATUS</div>
          <div className="mt-3 text-5xl font-mono font-black text-cyan-glow tracking-[0.12em]">{connectionState}</div>
          <p className="mt-4 text-sm text-cyan-glow/90">All systems synchronize with UTC to keep timestamps, servers, and distributed clients aligned globally.</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-cyan-glow/20 p-3"><div className="text-[10px] text-muted-foreground">Nodes</div><div className="text-lg font-bold text-cyan-glow">{nodeCount}</div></div>
            <div className="rounded-lg border border-cyan-glow/20 p-3"><div className="text-[10px] text-muted-foreground">Stratum</div><div className="text-lg font-bold text-cyan-glow">{stratum}</div></div>
            <div className="rounded-lg border border-cyan-glow/20 p-3"><div className="text-[10px] text-muted-foreground">Leap</div><div className="text-lg font-bold text-cyan-glow">{leap}</div></div>
          </div>
        </Card>
        <ChartCard title="UTC Drift Trend" note="small drift fluctuation over the last hour">
          <LineMetricChart data={masterDrift} yKey="v" />
        </ChartCard>

        <ChartCard title="Sync Health" note="status split across the current node pool">
          <PieMetricChart data={syncHealth} />
        </ChartCard>
        <ChartCard title="Reference Sources" note="monitoring source mix across systems">
          <BarMetricChart data={refSources} yKey="value" />
        </ChartCard>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/master")({
  component: MasterPage,
});
