import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { CountryCard } from '@/components/CountryCard';
import { Card } from '@/components/ui/card';
import { ChartCard, BarMetricChart, PieMetricChart, AreaMetricChart } from '@/components/dashboard/MiniCharts';
import { useLiveData } from '@/components/LiveDataContext';

const regionLoad = [
  { name: 'Asia', value: 42 },
  { name: 'Europe', value: 24 },
  { name: 'Americas', value: 21 },
  { name: 'Africa', value: 13 },
];
const nodeHealth = [
  { name: 'Online', value: 26, color: '#56f0ff' },
  { name: 'Degraded', value: 3, color: '#ffb020' },
  { name: 'Down', value: 1, color: '#ff5a6f' },
];
const latencyTrend = Array.from({ length: 12 }, (_, i) => ({ t: `${i * 10}m`, v: 10 + Math.sin(i / 2) * 3 + i * 0.2 }));

function NodesPage(){
  const { live } = useLiveData();
  const liveNodes = live?.nodes ?? [];
  const onlineCount = liveNodes.length;
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Global Sync Nodes</h1>
        <p className="text-sm text-muted-foreground mt-2">Distributed time servers around the world. Click a node to view details.</p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <ChartCard title="Regional Load" note="how nodes are distributed across the globe">
          <BarMetricChart data={regionLoad.map((item, index) => ({ ...item, value: item.value + (onlineCount % (index + 3)) }))} yKey="value" />
        </ChartCard>
        <ChartCard title="Node Health" note="online, degraded, and down states">
          <PieMetricChart data={nodeHealth.map((item) => ({ ...item, value: item.name === 'Online' ? onlineCount : item.value }))} />
        </ChartCard>
        <ChartCard title="Latency Trend" note="average delay over time">
          <AreaMetricChart data={latencyTrend.map((item, index) => ({ ...item, v: item.v + (onlineCount * 0.02) + (index % 3) * 0.05 }))} yKey="v" />
        </ChartCard>
      </section>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {(liveNodes.length ? liveNodes.slice(0, 6) : Array.from({ length: 6 }).map((_, i) => ({ name: `Node ${i + 1}`, code: `N${i + 1}`, peer: `ntp${i + 1}.example.net`, baseRtt: 10 + i, stratum: 1 } as any))).map((node, i) => (
          <Card key={i} className="p-4 glass">
            <div className="text-[10px] text-muted-foreground font-mono tracking-[0.3em]">{node.code}</div>
            <div className="mt-2 text-lg font-bold text-cyan-glow">{node.name}</div>
            <div className="mt-2 text-sm text-muted-foreground">Peer: {node.peer} • RTT {node.baseRtt?.toFixed?.(1) ?? node.baseRtt} ms • Stratum {node.stratum}</div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

export const Route = createFileRoute("/nodes")({
  component: NodesPage,
});
