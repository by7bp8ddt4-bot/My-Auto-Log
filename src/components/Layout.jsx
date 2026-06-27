import logoImg from '/assets/logo.png';
import iconImg from '/assets/icon-1024.png';
import { Car, ClipboardList, Bell, Settings, LogOut, ChevronRight, Calendar } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Car },
  { id: 'vehicles', label: 'My Vehicles', icon: Car },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'logs', label: 'Service Logs', icon: ClipboardList },
  { id: 'reminders', label: 'Reminders', icon: Bell },
];

export default function Layout({ currentPage, onNavigate, onLogout, children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={iconImg} alt="MyAutoLog" className="w-8 h-8 rounded-lg" />
            <img src={logoImg} alt="MyAutoLog" className="h-5 hidden sm:block" />
            <span className="font-bold text-lg tracking-tight sm:hidden">
              <span className="text-white">My</span>
              <span className="text-blue-400">Auto</span>
              <span className="text-cyan-400">Log</span>
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

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 bg-slate-900/50 border-r border-slate-800 flex-col p-3">
        <nav className="flex-1 space-y-1">
          {navItems.map(item => {
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
          <p className="text-[10px] text-slate-600 px-3">MyAutoLog v1.0</p>
        </div>
      </aside>
    </div>
  );
}