import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, BarMetricChart, PieMetricChart } from '@/components/dashboard/MiniCharts';
import { useLiveData } from '@/components/LiveDataContext';

const packetTypes = [
  { name: 'Client', value: 52 },
  { name: 'Server', value: 31 },
  { name: 'Control', value: 9 },
  { name: 'Error', value: 4 },
];
const packetStatus = [
  { name: 'Valid', value: 88, color: '#56f0ff' },
  { name: 'Delayed', value: 7, color: '#ffb020' },
  { name: 'Dropped', value: 5, color: '#ff5a6f' },
];

function PacketsPage(){
  const { live, activityFeed } = useLiveData();
  const packetCount = Math.max(18, live?.nodes.length ?? 0 * 3);
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Packet Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-2">Inspect NTP packets, sources, and packet-level metrics.</p>
      </header>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Packet Types" note="traffic breakdown by packet class">
          <BarMetricChart data={packetTypes.map((item, index) => ({ ...item, value: item.value + (packetCount % (index + 2)) }))} yKey="value" />
        </ChartCard>
        <ChartCard title="Packet Status" note="valid / delayed / dropped distribution">
          <PieMetricChart data={packetStatus.map((item) => ({ ...item, value: item.name === 'Valid' ? packetCount : item.value }))} />
        </ChartCard>
        <Card className="p-5 glass xl:col-span-2">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">RECENT PACKETS</div>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-3">Recent feed • {activityFeed[0] ?? 'no packet feed yet'}</div>
            <div className="rounded-lg border border-cyan-glow/20 p-3">Recent feed • {activityFeed[1] ?? 'waiting for packet updates'}</div>
            <div className="rounded-lg border border-cyan-glow/20 p-3">Live nodes tracked • {live?.nodes.length ?? 0}</div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/live/packets")({
  component: PacketsPage,
});
