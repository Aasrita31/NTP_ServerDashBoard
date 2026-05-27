import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, BarMetricChart, PieMetricChart } from '@/components/dashboard/MiniCharts';
import { useLiveData } from '@/components/LiveDataContext';

const alertCounts = [
  { name: 'Drift', value: 8 },
  { name: 'Jitter', value: 5 },
  { name: 'Loss', value: 3 },
  { name: 'Offline', value: 2 },
];
const alertSeverity = [
  { name: 'Critical', value: 4, color: '#ff5a6f' },
  { name: 'Warning', value: 8, color: '#ffb020' },
  { name: 'Info', value: 16, color: '#56f0ff' },
];

function AlertsPage(){
  const { live, apiState, activityFeed } = useLiveData();
  const activeAlerts = Math.max(3, (live?.nodes.length ?? 0) % 7 + (apiState === 'offline' ? 2 : 0));
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Sync Alerts</h1>
        <p className="text-sm text-muted-foreground mt-2">Critical alerts for drift, jitter, packet loss, and synchronization failures.</p>
      </header>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Alert Types" note="current active alert categories">
          <BarMetricChart data={alertCounts.map((item, index) => ({ ...item, value: item.value + (activeAlerts % (index + 2)) }))} yKey="value" />
        </ChartCard>
        <ChartCard title="Severity Split" note="how alerts are distributed by severity">
          <PieMetricChart data={alertSeverity.map((item) => ({ ...item, value: item.name === 'Critical' ? activeAlerts : item.value }))} />
        </ChartCard>
        <Card className="p-5 glass xl:col-span-2">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">ACTIVE ALERTS</div>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-red-400/30 p-3">CRITICAL • {activityFeed[0] ?? 'No critical drift alert yet'}</div>
            <div className="rounded-lg border border-yellow-400/30 p-3">WARNING • {activityFeed[1] ?? 'No warning alert yet'}</div>
            <div className="rounded-lg border border-cyan-glow/20 p-3">INFO • {live?.nodes.length ?? 0} nodes monitored • API {apiState.toUpperCase()}</div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/live/alerts")({
  component: AlertsPage,
});
