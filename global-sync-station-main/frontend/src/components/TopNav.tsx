import { Link } from '@tanstack/react-router';

export function TopNav({
  onToggleSidebar,
  sidebarOpen = false,
  themeVariant = 'darker',
  onThemeVariantChange,
}: {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  themeVariant?: 'darker' | 'brighter';
  onThemeVariantChange?: (variant: 'darker' | 'brighter') => void;
}) {
  return (
    <header className="top-nav fixed top-0 z-50 grid h-20 sm:h-24 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4 px-3 sm:px-6 md:px-12 bg-surface/72 backdrop-blur-xl border-b border-primary-container/30 shadow-[0_4px_30px_rgba(0,0,0,0.14)]">
      <div className="flex items-center gap-3 sm:gap-5 md:gap-6 min-w-0 justify-self-start">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
          className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl border border-cyan-200/20 bg-white/10 text-cyan-50 shadow-[0_0_18px_rgba(0,240,255,0.08)] transition-all hover:border-cyan-200/40 hover:bg-white/15 hover:text-white lg:hidden flex-shrink-0"
        >
          <span className="text-xl sm:text-2xl leading-none">{sidebarOpen ? '×' : '☰'}</span>
        </button>

        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-cyan-50 shadow-[0_0_22px_rgba(0,240,255,0.10)] transition-all hover:-translate-y-0.5 hover:border-cyan-200/45 hover:bg-white/15 hover:text-white flex-shrink-0"
        >
          <span aria-hidden>🏠</span>
          <span>Main</span>
        </Link>

        <div className="inline-flex items-center gap-2 sm:gap-4 md:gap-5 min-w-0 flex-shrink-0">
          <div className="nav-logo-frame inline-flex items-center justify-center p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0">
            <img
              src="/IITTNIF_logo.jpeg"
              alt="IITTNIF logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none justify-self-center flex w-full items-center justify-center px-2 sm:px-4 text-center min-w-0">
        <div className="nav-masthead pointer-events-auto flex flex-col items-center gap-0.5 sm:gap-1 truncate w-full">
          <h1 className="nav-title-elegant text-[11px] sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold leading-tight tracking-[0.08em] bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent animate-title-glow drop-shadow-lg" style={{ 
            backgroundSize: '400% auto',
            filter: 'drop-shadow(0 0 8px rgba(56, 214, 255, 0.4)) drop-shadow(0 0 16px rgba(0, 200, 255, 0.2))'
          }}>
            NTP Precision Monitoring Dashboard
          </h1>
          <div className="hidden sm:flex items-center gap-1 text-[8px] md:text-[9px] text-cyan-200/50 tracking-widest uppercase font-mono">
            <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Global Synchronization Network</span>
            <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 justify-self-end">
        <button
          type="button"
          onClick={() => onThemeVariantChange?.(themeVariant === 'darker' ? 'brighter' : 'darker')}
          aria-label="Toggle theme"
          aria-pressed={themeVariant === 'brighter'}
          className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-cyan-200/30 bg-slate-950/35 text-cyan-100 shadow-[0_0_22px_rgba(0,240,255,0.08)] transition-all hover:border-cyan-200/50 hover:bg-white/15 hover:text-white hover:shadow-[0_8px_24px_rgba(0,240,255,0.20)]"
        >
          <span className="text-lg sm:text-xl">{themeVariant === 'darker' ? '🌙' : '☀️'}</span>
        </button>
      </div>
    </header>
  );
}
