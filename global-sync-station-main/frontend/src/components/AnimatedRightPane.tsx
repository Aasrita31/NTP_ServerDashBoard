import React, { useEffect, useMemo, useState } from 'react';

function Sparkline({data, color='var(--cyan-glow)'}: {data: number[]; color?: string}){
  const w = 160, h = 40, pad = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = pad + (i/(data.length-1))*(w-2*pad);
    const y = h - pad - ((v - min) / (max - min || 1))*(h-2*pad);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.95} />
    </svg>
  );
}

function MetricCard({title, value, spark}:{title:string; value:string; spark:number[]}){
  return (
    <div className="glass elegant-bright-surface metric-card-bright rounded-xl p-4 flex flex-col gap-2 w-[220px] animate-fade-up">
      <div className="text-[10px] font-mono tracking-wider text-muted-foreground">{title}</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-mono font-bold text-cyan-glow tabular-nums">{value}</div>
        <div className="ml-3"><Sparkline data={spark} /></div>
      </div>
    </div>
  );
}

export default function AnimatedRightPane({
  delay = '+70.000 ms',
  drift = '-70.000 ms',
}: {delay?: string; drift?: string}){
  const [t, setT] = useState(0);
  const [cpu, setCpu] = useState<number[]>(() => Array.from({length:22},()=>Math.random()*30+20));
  const [mem, setMem] = useState<number[]>(() => Array.from({length:22},()=>Math.random()*40+30));
  const [offsets, setOffsets] = useState<number[]>(() => Array.from({length:22},()=>Math.random()*2-1));

  useEffect(() => {
    const id = setInterval(()=>{
      setT((s)=>s+1);
      setCpu((arr)=>[...arr.slice(1), Math.max(8, Math.min(98, arr[arr.length-1] + (Math.random()*8-4)))]);
      setMem((arr)=>[...arr.slice(1), Math.max(8, Math.min(98, arr[arr.length-1] + (Math.random()*6-3)))]);
      setOffsets((arr)=>[...arr.slice(1), arr[arr.length-1] + (Math.random()*0.6-0.3)]);
    }, 1000);
    return ()=>clearInterval(id);
  }, []);

  const feed = useMemo(()=>{
    const now = new Date();
    return [
      `${now.toISOString()} • Synced with time.nist.gov (rtt 92ms)`,
      `${new Date(now.getTime()-4000).toISOString()} • Drift correction applied: -0.003s`,
      `${new Date(now.getTime()-9000).toISOString()} • Peer time update: 10.26.13.44:123`,
      `${new Date(now.getTime()-15000).toISOString()} • SNTP probe success`,
    ];
  }, [t]);

  return (
    <div className="animated-right-pane w-full max-w-[420px]">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex gap-3 flex-wrap">
          <MetricCard title="Master → IITTNIF Delay" value={delay} spark={offsets.map(x=>x*100)} />
          <MetricCard title="Master → IITTNIF Drift" value={drift} spark={offsets.map(x=>x*120)} />
          <MetricCard title="System CPU" value={`${Math.round(cpu[cpu.length-1])}%`} spark={cpu} />
          <MetricCard title="System Memory" value={`${Math.round(mem[mem.length-1])}%`} spark={mem} />
        </div>

        <div className="glass elegant-bright-surface rounded-xl p-3 mt-2 overflow-hidden">
          <div className="text-[10px] font-mono tracking-wider text-muted-foreground">Recent Activity</div>
          <div className="mt-2 text-[12px] font-mono text-cyan-glow space-y-2">
            <div className="activity-ticker h-20 relative overflow-hidden">
              <div className="animate-ticker absolute top-0 left-0 w-full">
                {feed.map((f,i) => (
                  <div key={i} className="py-1">{f}</div>
                ))}
                {/* duplicate for looped ticker */}
                {feed.map((f,i) => (
                  <div key={`d-${i}`} className="py-1">{f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
