import { createFileRoute } from "@tanstack/react-router";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { ChartCard, LineMetricChart } from '@/components/dashboard/MiniCharts';
import { useLiveData } from '@/components/LiveDataContext';

const liveFlow = Array.from({ length: 18 }, (_, i) => ({ t: `${i * 2}m`, v: 1 + Math.sin(i / 2) * 0.5 + (i % 3) * 0.15 }));

function LiveSyncPage(){
  const { live, activityFeed, apiState } = useLiveData();
  const syncStatus = apiState === 'live' ? 'SYNCHRONIZED' : apiState === 'connecting' ? 'CONNECTING' : 'OFFLINE';
  const activeNodes = live?.nodes?.length ?? 0;
  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-glow">Live Synchronization</h1>
        <p className="text-sm text-muted-foreground mt-2">Real-time sync activity and client connections.</p>
      </header>
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Live Sync Flow" note="handshake intensity and update rhythm">
          <LineMetricChart data={liveFlow} yKey="v" />
        </ChartCard>
        <Card className="p-5 glass">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">LIVE CONNECTIONS</div>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-3">10.26.13.44:123 • {syncStatus.toLowerCase()} • active nodes {activeNodes}</div>
            <div className="rounded-lg border border-cyan-glow/20 p-3">Office sync feed • {activityFeed[0] ?? 'waiting for updates'}</div>
            <div className="rounded-lg border border-cyan-glow/20 p-3">Last change • {activityFeed[1] ?? 'no recent packet events'}</div>
          </div>
        </Card>
        <Card className="p-5 glass xl:col-span-2">
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">SYNC TIMELINE</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded-lg border border-cyan-glow/20 p-4">Handshake<br /><span className="text-cyan-glow">4 active</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Update rate<br /><span className="text-cyan-glow">1s interval</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">Retry window<br /><span className="text-cyan-glow">5s</span></div>
            <div className="rounded-lg border border-cyan-glow/20 p-4">State<br /><span className="text-cyan-glow">{syncStatus}</span></div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

export const Route = createFileRoute("/live/sync")({
  component: LiveSyncPage,
});
