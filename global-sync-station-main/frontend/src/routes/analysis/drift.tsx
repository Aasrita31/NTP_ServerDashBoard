import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, LineMetricChart, AreaMetricChart } from '@/components/dashboard/MiniCharts';

const driftTrend = Array.from({ length: 18 }, (_, i) => ({ t: `${i * 5}m`, v: Math.round((Math.sin(i / 2.5) * 0.8 + 0.4) * 100) / 100 }));
const driftCorrection = Array.from({ length: 18 }, (_, i) => ({ t: `${i * 5}m`, v: Math.round((Math.cos(i / 3) * 0.3 + 0.5) * 100) / 100 }));

function DriftPage(){
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Drift Analysis</h1>
        <p className="text-sm text-muted-foreground mt-2">Historical drift trends and correction rates.</p>
      </header>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Drift Trend" note="positive and negative drift over time">
          <LineMetricChart data={driftTrend} yKey="v" />
        </ChartCard>
        <ChartCard title="Correction Rate" note="how often the clock is re-centered">
          <AreaMetricChart data={driftCorrection} yKey="v" />
        </ChartCard>
        <Card className="p-5 glass xl:col-span-2">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">DRIFT SUMMARY</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-4">Average drift<br /><span className="text-cyan-glow text-xl font-bold">+0.42 ms</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Peak drift<br /><span className="text-cyan-glow text-xl font-bold">+1.24 ms</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Corrections<br /><span className="text-cyan-glow text-xl font-bold">18/hr</span></div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/analysis/drift")({
  component: DriftPage,
});
