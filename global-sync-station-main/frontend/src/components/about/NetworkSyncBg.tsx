import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NODES = [
  { x: 12, y: 28 },
  { x: 28, y: 18 },
  { x: 45, y: 32 },
  { x: 62, y: 22 },
  { x: 78, y: 38 },
  { x: 88, y: 20 },
  { x: 35, y: 55 },
  { x: 55, y: 62 },
  { x: 72, y: 58 },
  { x: 20, y: 72 },
  { x: 50, y: 78 },
  { x: 82, y: 75 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [2, 6], [2, 7], [4, 8], [6, 9], [7, 10], [8, 11],
  [1, 6], [3, 7], [5, 8], [9, 10], [10, 11],
];

export function NetworkSyncBg({ bright }: { bright?: boolean }) {
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; delay: number }>
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 24 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
      })),
    );
  }, []);

  const stroke = bright ? "rgba(14,165,233,0.35)" : "rgba(86,240,255,0.28)";
  const nodeFill = bright ? "#0ea5e9" : "#56f0ff";
  const waveColor = bright ? "rgba(56,189,248,0.12)" : "rgba(86,240,255,0.08)";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: bright
            ? "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(56,189,248,0.18), transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(86,240,255,0.12), transparent 70%)",
        }}
      />

      {/* Floating sync waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 -translate-x-1/2 rounded-full border"
          style={{
            width: `${280 + i * 120}px`,
            height: `${280 + i * 120}px`,
            top: `${10 + i * 8}%`,
            borderColor: waveColor,
            background: `radial-gradient(circle, ${waveColor} 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        />
      ))}

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {EDGES.map(([a, b], i) => {
          const na = NODES[a];
          const nb = NODES[b];
          return (
            <motion.line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={stroke}
              strokeWidth="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: i * 0.04 }}
            />
          );
        })}
        {NODES.map((n, i) => (
          <g key={i}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="0.6"
              fill={nodeFill}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 200 }}
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="1.2"
              fill="none"
              stroke={nodeFill}
              strokeOpacity={0.5}
              animate={{ r: [1.2, 2.4], opacity: [0.6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
            />
          </g>
        ))}
      </svg>

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-glow"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 6 + p.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
    </div>
  );
}
