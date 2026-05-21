import { useEffect, useState } from "react";

export function WorldMapBg({ variant = 'darker' }: { variant?: 'darker' | 'brighter' }) {
  // Simplified continents as dotted SVG
  const brighter = variant === 'brighter';
  const gridOpacity = brighter ? 0.85 : 0.6;
  const svgOpacity = brighter ? 0.55 : 0.3;
  const particleOpacity = brighter ? 0.9 : 0.4;
  const vignetteOpacity = brighter ? 0.08 : 0.06;

  const [particles, setParticles] = useState<Array<{x:number;y:number;w:string;h:string;delay:string;}>>([]);

  useEffect(() => {
    const p = Array.from({ length: 30 }).map(() => ({
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 500),
      w: `${Math.floor(Math.random() * 3) + 1}px`,
      h: `${Math.floor(Math.random() * 3) + 1}px`,
      delay: `${(Math.random() * 8).toFixed(2)}s`,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg" style={{ opacity: gridOpacity }} />
      <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full" style={{ opacity: svgOpacity }}>
        <defs>
          <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.18 78)" stopOpacity={brighter ? 0.55 : 0.4} />
            <stop offset="100%" stopColor="oklch(0.85 0.18 78)" stopOpacity="0" />
          </radialGradient>
          <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="oklch(0.85 0.18 78)" />
          </pattern>
          <mask id="continents">
            {/* North America */}
            <path d="M 100 120 Q 150 90 220 110 Q 280 130 270 200 Q 230 250 180 240 Q 130 220 100 180 Z" fill="white"/>
            {/* South America */}
            <path d="M 240 270 Q 280 260 290 320 Q 280 390 250 410 Q 230 380 235 320 Z" fill="white"/>
            {/* Europe */}
            <path d="M 460 130 Q 510 110 540 130 Q 555 170 520 190 Q 480 185 460 160 Z" fill="white"/>
            {/* Africa */}
            <path d="M 480 200 Q 540 200 560 260 Q 555 340 510 370 Q 470 340 470 270 Z" fill="white"/>
            {/* Asia */}
            <path d="M 560 110 Q 680 90 780 130 Q 820 170 800 220 Q 720 250 640 230 Q 580 210 560 170 Z" fill="white"/>
            {/* Australia */}
            <path d="M 760 330 Q 830 320 860 350 Q 850 390 800 395 Q 760 385 755 360 Z" fill="white"/>
          </mask>
        </defs>
        <rect width="1000" height="500" fill="url(#globe-glow)" />
        <rect width="1000" height="500" fill="url(#dots)" mask="url(#continents)" />
      </svg>

      {/* Satellite arcs */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none" style={{ opacity: brighter ? 0.55 : 0.4 }}>
        <g fill="none" stroke="oklch(0.85 0.18 78)" strokeWidth="1" strokeDasharray="4 6" className="animate-orbit">
          <path d="M 150 180 Q 500 -50 850 200" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_62%,rgba(15,23,42,0.06)_100%)]" />
          <path d="M 100 250 Q 500 100 900 280" />
        </g>
        {[
          [150, 180], [850, 200], [500, 100], [200, 350], [800, 320], [900, 280], [480, 220], [720, 380]
        ].map(([x,y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="oklch(0.9 0.2 80)" style={{ opacity: particleOpacity }} />
            <circle cx={x} cy={y} r="6" fill="none" stroke="oklch(0.9 0.2 80)" strokeOpacity={brighter ? 0.7 : 0.5} className="animate-radar" style={{transformOrigin: `${x}px ${y}px`}} />
          </g>
        ))}
      </svg>

      {/* Particles (client-only positions) */}
      <div suppressHydrationWarning>
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-glow animate-particle"
            style={{
              width: p.w,
              height: p.h,
              top: `${(p.y / 500) * 100}%`,
              left: `${(p.x / 1000) * 100}%`,
              animationDelay: p.delay,
              boxShadow: '0 0 6px oklch(0.85 0.18 78)',
              opacity: particleOpacity,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 62%, rgba(139,92,246,${vignetteOpacity}) 100%)` }} />
    </div>
  );
}
