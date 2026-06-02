import React from 'react';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { WorldMapBg } from './WorldMapBg';

export default function Layout({ children, bgVariant }: { children: React.ReactNode; bgVariant?: 'darker'|'brighter' }){
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [themeVariant, setThemeVariant] = React.useState<'darker' | 'brighter'>(() => {
    if (bgVariant) return bgVariant;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bgVariant') as 'darker' | 'brighter' | null;
        if (saved === 'darker' || saved === 'brighter') return saved;
      } catch {
        // ignore storage failures
      }
    }
    return 'darker';
  });

  React.useEffect(() => {
    if (bgVariant) {
      setThemeVariant(bgVariant);
      return;
    }
    try {
      const saved = localStorage.getItem('bgVariant') as 'darker' | 'brighter' | null;
      if (saved === 'darker' || saved === 'brighter') setThemeVariant(saved);
    } catch {
      // ignore storage failures
    }
  }, [bgVariant]);

  React.useEffect(() => {
    try {
      localStorage.setItem('bgVariant', themeVariant);
    } catch {
      // ignore storage failures
    }
  }, [themeVariant]);

  const mainStyle = React.useMemo(() => {
    if (themeVariant !== 'brighter') return {} as React.CSSProperties;

    return {
      background:
        'radial-gradient(circle at 18% 16%, rgba(45,212,255,0.18), transparent 22%), radial-gradient(circle at 82% 10%, rgba(59,130,246,0.12), transparent 22%), radial-gradient(circle at 50% 110%, rgba(15,118,255,0.10), transparent 36%), linear-gradient(180deg, #fbfdff 0%, #eef7ff 46%, #eaf4ff 100%)',
      color: '#0f172a',
      '--primary': '#1dbcf7',
      '--accent': '#3b82f6',
      '--ring': '#22d3ee',
      '--cyan-glow': '#2dd4ff',
      '--neon': '#60a5fa',
      '--online': '#14b8a6',
      '--background': '#f8fcff',
      '--foreground': '#0f172a',
      '--card': 'rgba(255,255,255,0.72)',
      '--card-foreground': '#0f172a',
      '--popover': 'rgba(255,255,255,0.92)',
      '--popover-foreground': '#0f172a',
      '--muted': 'rgba(15,23,42,0.04)',
      '--muted-foreground': 'rgba(15,23,42,0.58)',
      '--border': 'rgba(34,211,238,0.14)',
      '--input': 'rgba(15,23,42,0.06)',
      '--secondary-container': 'rgba(34,211,238,0.18)',
      '--on-secondary-container': '#0f172a',
      '--primary-container': 'rgba(37,99,235,0.16)',
      '--on-primary-container': '#0f172a',
      '--surface': 'rgba(255,255,255,0.58)',
      '--surface-container-lowest': 'rgba(255,255,255,0.82)',
      '--surface-container-low': 'rgba(250,253,255,0.84)',
      '--surface-container': 'rgba(244,249,255,0.90)',
      '--surface-container-high': 'rgba(235,244,252,0.92)',
      '--surface-container-highest': 'rgba(225,237,248,0.95)',
      '--on-surface-variant': '#475569',
      '--outline-variant': 'rgba(15,23,42,0.10)',
      '--grid': 'rgba(34,211,238,0.08)',
    } as React.CSSProperties;
  }, [themeVariant]);
  return (
    <div className={`relative min-h-screen overflow-hidden ${themeVariant === 'brighter' ? 'theme-bright' : 'theme-dark'}`} style={mainStyle} data-theme={themeVariant}>
      <TopNav
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        themeVariant={themeVariant}
        onThemeVariantChange={setThemeVariant}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        themeVariant={themeVariant}
      />
      <WorldMapBg variant={themeVariant} />

      <main className={`relative z-10 pt-20 sm:pt-24 px-3 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-4 min-h-screen transition-[margin] duration-300 ${sidebarCollapsed ? 'lg:ml-[92px]' : 'lg:ml-[280px]'}`}>
        <div className="max-w-[100%] sm:max-w-[calc(100%-1rem)] md:max-w-[calc(100%-2rem)] lg:max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
