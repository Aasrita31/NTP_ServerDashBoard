import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, BarMetricChart, LineMetricChart } from '@/components/dashboard/MiniCharts';

const jitterBars = [
  { name: 'Client A', value: 0.18 },
  { name: 'Client B', value: 0.24 },
  { name: 'Client C', value: 0.14 },
  { name: 'Client D', value: 0.31 },
  { name: 'Client E', value: 0.09 },
];
const jitterTrend = Array.from({ length: 16 }, (_, i) => ({ t: `${i * 4}m`, v: 0.12 + Math.abs(Math.sin(i / 2) * 0.22) }));

function JitterPage(){
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Jitter Monitor</h1>
        <p className="text-sm text-muted-foreground mt-2">Monitor packet timing variation and stability.</p>
      </header>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Jitter Trend" note="timing variance across the monitoring window">
          <LineMetricChart data={jitterTrend} yKey="v" />
        </ChartCard>
        <ChartCard title="Top Jitter Sources" note="peers with the highest instability">
          <BarMetricChart data={jitterBars} yKey="value" />
        </ChartCard>
        <Card className="p-5 glass xl:col-span-2">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">ALERT THRESHOLDS</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-4">Low jitter<br /><span className="text-cyan-glow text-xl font-bold">&lt;0.15 ms</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Warning<br /><span className="text-cyan-glow text-xl font-bold">0.15-0.30 ms</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Critical<br /><span className="text-cyan-glow text-xl font-bold">&gt;0.30 ms</span></div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/analysis/jitter")({
  component: JitterPage,
});
