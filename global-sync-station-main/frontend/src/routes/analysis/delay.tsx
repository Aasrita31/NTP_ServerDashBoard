import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, AreaMetricChart, PieMetricChart } from '@/components/dashboard/MiniCharts';

const delayTrend = Array.from({ length: 18 }, (_, i) => ({ t: `${i * 5}m`, v: 12 + Math.sin(i / 3) * 4 + i * 0.2 }));
const delaySplit = [
  { name: 'Under 10ms', value: 40, color: '#56f0ff' },
  { name: '10-30ms', value: 35, color: '#2cb7ff' },
  { name: '30-60ms', value: 18, color: '#ffb020' },
  { name: '60ms+', value: 7, color: '#ff5a6f' },
];

function DelayPage(){
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Delay Metrics</h1>
        <p className="text-sm text-muted-foreground mt-2">Round-trip delay, latency trends, and heatmaps.</p>
      </header>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Delay Trend" note="current round-trip latency across the window">
          <AreaMetricChart data={delayTrend} yKey="v" />
        </ChartCard>
        <ChartCard title="Delay Distribution" note="how packets spread by latency class">
          <PieMetricChart data={delaySplit} />
        </ChartCard>
        <Card className="p-5 glass xl:col-span-2">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">LATENCY SUMMARY</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-4">Average delay<br /><span className="text-cyan-glow text-xl font-bold">14.2 ms</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Maximum delay<br /><span className="text-cyan-glow text-xl font-bold">61.8 ms</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Packet loss<br /><span className="text-cyan-glow text-xl font-bold">0.2%</span></div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/analysis/delay")({
  component: DelayPage,
});
