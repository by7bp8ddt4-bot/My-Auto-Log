import { useState } from 'react';
import logoImg from '/assets/logo.png';
import iconImg from '/assets/icon-1024.png';
import { LayoutDashboard, Car, ClipboardList, Bell, Settings, LogOut, ChevronRight, Calendar, Fuel, Wrench, Grid3X3, X, FileText, Zap } from 'lucide-react';

const allNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Garage', icon: Car },
  { id: 'schedule', label: 'Scheduled Maintenance', icon: Calendar },
  { id: 'fuel', label: 'Fuel', icon: Fuel },
  { id: 'logs', label: 'Service Logs', icon: ClipboardList },
  { id: 'mods', label: 'Performance Mods', icon: Wrench },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'wiring', label: 'Wiring Diagrams', icon: Zap },
  { id: 'reminders', label: 'Reminders', icon: Bell },
];

// Primary items shown in bottom nav; rest go in the More drawer
const primaryNavItems = allNavItems.filter(i =>
  ['dashboard', 'vehicles', 'schedule', 'logs'].includes(i.id)
);
const moreNavItems = allNavItems.filter(i =>
  ['fuel', 'mods', 'documents', 'wiring', 'reminders'].includes(i.id)
);

export default function Layout({ currentPage, onNavigate, onLogout, children }) {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const handleNavigate = (id) => {
    onNavigate(id);
    setShowMoreDrawer(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={iconImg} alt="MTXtrkr" className="w-8 h-8 rounded-lg" />
            <div>
              <img src={logoImg} alt="MTXtrkr" className="h-5 hidden sm:block" />
              <span className="text-[9px] text-slate-500 italic hidden sm:block -mt-0.5">Maintenance Tracker</span>
              <span className="text-[8px] text-slate-600 italic hidden sm:block">— Your Owner's Manual Simplified</span>
            </div>
            <span className="font-bold text-lg tracking-tight sm:hidden">
              <span className="text-white">MTX</span>
              <span className="text-blue-400">tr</span>
              <span className="text-cyan-400">kr</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop layout: sidebar + main content in flex row */}
      <div className="flex flex-1">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-56 bg-slate-900/50 border-r border-slate-800 flex-col p-3 shrink-0 relative z-10">
          <nav className="flex-1 space-y-1">
            {allNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 px-3">MTXtrkr v1.0</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto md:mx-0 w-full px-4 py-6 pb-24 md:pb-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 md:hidden">
        <div className="flex items-center justify-around h-16 px-1">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center gap-0.5 py-1 min-w-[60px] h-14 rounded-xl transition-all text-slate-500 hover:text-slate-300 active:scale-95"
                style={{ minHeight: '48px', minWidth: '56px' }}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-blue-400' : ''}`}>{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-blue-400" />}
              </button>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1 min-w-[60px] h-14 rounded-xl transition-all text-slate-500 hover:text-slate-300 active:scale-95"
            style={{ minHeight: '48px', minWidth: '56px' }}
          >
            <Grid3X3 className={`w-5 h-5 ${moreNavItems.some(i => i.id === currentPage) ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
            <span className={`text-[10px] font-medium ${moreNavItems.some(i => i.id === currentPage) ? 'text-blue-400' : ''}`}>More</span>
          </button>
        </div>
      </nav>

      {/* More Drawer Overlay */}
      {showMoreDrawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMoreDrawer(false)} />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-2xl shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h3 className="text-sm font-semibold text-white">More</h3>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
                style={{ minHeight: '40px', minWidth: '40px' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 pb-6 pt-2 space-y-1">
              {moreNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                    style={{ minHeight: '48px' }}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
