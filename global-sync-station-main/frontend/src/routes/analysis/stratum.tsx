import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, BarMetricChart, PieMetricChart } from '@/components/dashboard/MiniCharts';

const levels = [
  { name: 'Stratum 0', value: 1 },
  { name: 'Stratum 1', value: 5 },
  { name: 'Stratum 2', value: 12 },
  { name: 'Stratum 3', value: 20 },
];
const sourceTypes = [
  { name: 'Atomic', value: 12, color: '#56f0ff' },
  { name: 'GPS', value: 18, color: '#2cb7ff' },
  { name: 'NIST', value: 8, color: '#7b61ff' },
  { name: 'PPS', value: 10, color: '#ffb020' },
];

function StratumPage(){
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Stratum Hierarchy</h1>
        <p className="text-sm text-muted-foreground mt-2">Visualize the stratum hierarchy and upstream references.</p>
      </header>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Hierarchy Levels" note="distribution by stratum">
          <BarMetricChart data={levels} yKey="value" />
        </ChartCard>
        <ChartCard title="Reference Sources" note="upstream source mix across the network">
          <PieMetricChart data={sourceTypes} />
        </ChartCard>
        <Card className="p-5 glass xl:col-span-2">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">TREE VIEW</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-4">Stratum 0<br /><span className="text-cyan-glow">Atomic/GPS clock</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Stratum 1<br /><span className="text-cyan-glow">Primary NTP server</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Stratum 2<br /><span className="text-cyan-glow">Regional servers</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Stratum 3<br /><span className="text-cyan-glow">Local machines</span></div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/analysis/stratum")({
  component: StratumPage,
});
