export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] hidden lg:flex flex-col py-margin bg-surface-container-lowest/80 backdrop-blur-2xl border-r border-outline-variant/20 shadow-2xl z-40 pt-20">
      <div className="px-6 mb-8">
        <div className="font-headline-md text-headline-md text-primary-container">STRATUM-0</div>
        <div className="font-label-caps text-[10px] text-secondary-fixed-dim tracking-[0.2em]">MASTER SYNC ACTIVE</div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <div className="group flex items-center gap-4 px-4 py-3 bg-secondary-container/10 text-secondary-container border-r-4 border-secondary-container transition-all duration-200 cursor-pointer">
          <span className="text-lg">🛰️</span>
          <span className="font-label-caps text-label-caps">Master UTC Clock</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">🌐</span>
          <span className="font-label-caps text-label-caps">Global Sync Nodes</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">📡</span>
          <span className="font-label-caps text-label-caps">IITTNIF NTP Server</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">🧭</span>
          <span className="font-label-caps text-label-caps">Stratum Hierarchy</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">📊</span>
          <span className="font-label-caps text-label-caps">Drift Analysis</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">⚡</span>
          <span className="font-label-caps text-label-caps">Jitter Monitor</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">📈</span>
          <span className="font-label-caps text-label-caps">Delay Metrics</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">🔄</span>
          <span className="font-label-caps text-label-caps">Live Synchronization</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">🖥️</span>
          <span className="font-label-caps text-label-caps">Packet Monitoring</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">⚠️</span>
          <span className="font-label-caps text-label-caps">Sync Alerts</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">🔐</span>
          <span className="font-label-caps text-label-caps">System Security</span>
        </div>
        <div className="group flex items-center gap-4 px-4 py-3 text-on-surface-variant/60 hover:bg-surface-container-highest/40 hover:text-secondary-fixed transition-all duration-200 cursor-pointer">
          <span className="text-lg">⚙️</span>
          <span className="font-label-caps text-label-caps">Settings</span>
        </div>
      </nav>
      <div className="px-6 mt-auto">
        <button className="w-full py-3 bg-error-container text-on-error-container font-label-caps text-[10px] tracking-widest hover:brightness-125 transition-all">EMERGENCY BYPASS</button>
      </div>
    </aside>
  );
}
