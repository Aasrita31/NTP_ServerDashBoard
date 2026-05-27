import React from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

export function ChartCard({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">{title}</div>
          {note ? <div className="mt-1 text-xs text-cyan-glow/80">{note}</div> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

export function LineMetricChart({ data, xKey = 't', yKey = 'v', stroke = 'var(--cyan-glow)', height = 220 }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey={xKey} tick={{ fill: 'var(--muted-foreground)' }} />
        <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke={stroke} strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaMetricChart({ data, xKey = 't', yKey = 'v', stroke = 'var(--cyan-glow)', height = 220 }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="95%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey={xKey} tick={{ fill: 'var(--muted-foreground)' }} />
        <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
        <Tooltip />
        <Area type="monotone" dataKey={yKey} stroke={stroke} fill="url(#areaFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarMetricChart({ data, xKey = 'name', yKey = 'value', height = 220 }: any) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey={xKey} tick={{ fill: 'var(--muted-foreground)' }} />
        <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
        <Tooltip />
        <Bar dataKey={yKey} fill="var(--cyan-glow)">
          {data.map((_: any, index: number) => <Cell key={index} fill={index % 2 ? '#16c3ff' : '#56f0ff'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PieMetricChart({ data, height = 220 }: { data: { name: string; value: number; color: string }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
