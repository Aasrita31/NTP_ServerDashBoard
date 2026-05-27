import { Link, useMatchRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SecurityPanel, SettingsPanel } from './SystemPanels';

type SidebarItem = { to: string; icon: string; label: string };

const SIDEBAR_ITEMS: { section: string; items: SidebarItem[] }[] = [
  {
    section: 'MONITORING',
    items: [
      { to: '/master', icon: '🛰️', label: 'Master UTC Clock' },
      { to: '/nodes', icon: '🌐', label: 'Global Sync Nodes' },
      { to: '/office', icon: '📡', label: 'IITTNIF NTP Server' },
    ],
  },
  {
    section: 'ANALYSIS',
    items: [
      { to: '/analysis/stratum', icon: '🧭', label: 'Stratum Hierarchy' },
      { to: '/analysis/drift', icon: '📊', label: 'Drift Analysis' },
      { to: '/analysis/jitter', icon: '⚡', label: 'Jitter Monitor' },
      { to: '/analysis/delay', icon: '📈', label: 'Delay Metrics' },
    ],
  },
  {
    section: 'LIVE',
    items: [
      { to: '/live/sync', icon: '🔄', label: 'Live Synchronization' },
      { to: '/live/packets', icon: '🖥️', label: 'Packet Monitoring' },
      { to: '/live/alerts', icon: '⚠️', label: 'Sync Alerts' },
    ],
  },
];

function SidebarLink({ to, icon, label, active, onNavigate, collapsed }: SidebarItem & { active: boolean; onNavigate?: () => void; collapsed?: boolean }) {
  const [clicked, setClicked] = useState(false);

  function handleClick(e: any) {
    // trigger showcase animation, then call navigation/close handler
    setClicked(true);
    try {
      onNavigate && onNavigate();
    } finally {
      // clear the animation state after it finishes
      window.setTimeout(() => setClicked(false), 600);
    }
  }

  return (
    <Link
      to={to as any}
      onClick={handleClick}
      className={`relative overflow-hidden group flex items-center ${collapsed ? 'justify-center gap-0 px-3' : 'gap-4 px-4'} py-3 rounded-2xl transition-all duration-200 ${active ? 'bg-secondary-container/10 text-secondary-container shadow-[0_0_0_1px_rgba(0,240,255,0.22),0_14px_28px_rgba(0,200,255,0.10)]' : 'text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed'} ${clicked ? 'sidebar-clicked' : ''}`}
      activeProps={{ className: 'bg-secondary-container/10 text-secondary-container shadow-[0_0_0_1px_rgba(0,240,255,0.22),0_14px_28px_rgba(0,200,255,0.10)]' }}
      inactiveProps={{ className: 'text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed' }}
    >
      <span className="text-lg">{icon}</span>
      <span className={`font-label-caps text-label-caps ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
      <span aria-hidden className={`sidebar-ripple pointer-events-none ${clicked ? 'animate' : ''}`} />
    </Link>
  );
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapse, themeVariant = 'darker' }: { open?: boolean; onClose?: () => void; collapsed?: boolean; onToggleCollapse?: () => void; themeVariant?: 'darker' | 'brighter' }) {
  const matchRoute = useMatchRoute();
  const isActive = (to: string) => !!matchRoute({ to: to as any, fuzzy: false });
  const [showSecurity, setShowSecurity] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`sidebar-shell fixed left-0 top-0 h-full ${collapsed ? 'lg:w-[92px]' : 'lg:w-[280px]'} w-[280px] ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:flex flex-col py-margin bg-surface-container-lowest/80 backdrop-blur-2xl border-r border-outline-variant/20 shadow-2xl z-40 pt-24 transform transition-transform duration-300`}>
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-28 items-center justify-center w-6 h-12 rounded-full border border-cyan-glow/30 bg-surface-container-lowest/90 text-cyan-glow shadow-lg hover:bg-cyan-glow/10 transition-all"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '›' : '‹'}
      </button>
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'}`}>
        <div className={`mt-8 space-y-2 ${collapsed ? 'lg:space-y-3' : ''}`}>
          {SIDEBAR_ITEMS.map((section) => (
            <div key={section.section} className="space-y-2">
              <div className={`px-4 text-[10px] text-muted-foreground font-mono tracking-widest ${collapsed ? 'lg:hidden' : ''}`}>{section.section}</div>
              {section.items.map((item) => (
                <SidebarLink key={item.to} {...item} active={isActive(item.to)} onNavigate={onClose} collapsed={collapsed} />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className={`px-4 text-[10px] text-muted-foreground font-mono tracking-widest ${collapsed ? 'lg:hidden' : ''}`}>SYSTEM</div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowSecurity(true)}
            onKeyDown={(e) => e.key === 'Enter' && setShowSecurity(true)}
            className={`group relative overflow-hidden flex items-center ${collapsed ? 'lg:justify-center lg:gap-0 lg:px-3' : 'gap-4 px-4'} py-3 rounded-2xl text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer`}
          >
            <span className="text-lg">🔐</span>
            <span className={`font-label-caps text-label-caps ${collapsed ? 'lg:hidden' : ''}`}>System Security</span>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setShowSettings(true)}
            onKeyDown={(e) => e.key === 'Enter' && setShowSettings(true)}
            className={`group relative overflow-hidden flex items-center ${collapsed ? 'lg:justify-center lg:gap-0 lg:px-3' : 'gap-4 px-4'} py-3 rounded-2xl text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer`}
          >
            <span className="text-lg">⚙️</span>
            <span className={`font-label-caps text-label-caps ${collapsed ? 'lg:hidden' : ''}`}>Settings</span>
          </div>
        </div>
      </nav>
      <div className="px-6 mt-auto">
        <button className="w-full py-3 bg-error-container text-on-error-container font-label-caps text-[10px] tracking-widest hover:brightness-125 transition-all">EMERGENCY BYPASS</button>
      </div>
    </aside>
      <SecurityPanel open={showSecurity} onClose={() => setShowSecurity(false)} />
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
