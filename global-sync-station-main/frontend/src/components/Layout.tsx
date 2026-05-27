import React from 'react';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { WorldMapBg } from './WorldMapBg';

export default function Layout({ children, bgVariant }: { children: React.ReactNode; bgVariant?: 'darker'|'brighter' }){
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <TopNav onToggleSidebar={() => setSidebarOpen((v) => !v)} themeVariant={bgVariant} />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />
      <WorldMapBg variant={bgVariant ?? 'darker'} />

      <main className={`relative z-10 pt-20 sm:pt-24 px-3 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-4 min-h-screen transition-[margin] duration-300 ${sidebarCollapsed ? 'lg:ml-[92px]' : 'lg:ml-[280px]'}`}>
        <div className="max-w-[100%] sm:max-w-[calc(100%-1rem)] md:max-w-[calc(100%-2rem)] lg:max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
