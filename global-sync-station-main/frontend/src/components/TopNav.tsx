export function TopNav() {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-gutter h-16 bg-surface/65 backdrop-blur-xl border-b border-primary-container/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4">
        <div className="h-6 w-px bg-outline-variant/30 mx-2"></div>
        <div className="-mt-1 text-left">
          <div className="text-sm font-bold tracking-[0.25em] text-cyan-glow">NTP-SYNC COMMAND</div>
          <div className="text-[9px] text-muted-foreground font-mono tracking-[0.3em]">
            GLOBAL TIME COORDINATION CENTER • CLASSIFIED
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-6 items-center">
          <button className="font-label-caps text-label-caps text-primary-container border-b-2 border-primary-container py-1 transition-colors duration-300">DASHBOARD</button>
          <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary-container transition-colors duration-300">TELEMETRY</button>
          <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary-container transition-colors duration-300">NODES</button>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary-container cursor-pointer active:scale-95">satellite_alt</span>
          <span className="material-symbols-outlined text-primary-container cursor-pointer active:scale-95">lan</span>
          <span className="material-symbols-outlined text-primary-container cursor-pointer active:scale-95">settings_input_component</span>
          <div className="w-8 h-8 rounded-full border border-primary-container/50 bg-surface-container overflow-hidden">
            <img alt="Operator Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdfj0cidjwq3BBQdceG4h68AAoMUSTQaYeUBJoPJXwYtaxVEZpfZ1AlZRXzR146xh4OYwgsWjHVLwHVybbiEbj5vKF3-vjuZN9wcWJlR2IWAmLjOYp_qIR-j4XrebKx_jomYSW9-dS4YM6ehczPYagor8autAmUKIMcf0JtxIOA2gWFMSZJKfEEQ2YispVlmbOob_m6SsT6GCIIEr0S1f5e-6SF9wF8I3MEJ6XZNMSXvMwvoWXA9A2mIlVfGurlAZ7FAPioAgnwRzz" />
          </div>
        </div>
      </div>
    </header>
  );
}
