import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { 
  LayoutDashboard, Truck, Users, Map, Wrench, 
  Fuel, BarChart3, LogOut, Menu, User as UserIcon
} from 'lucide-react';
import { cn } from './utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
  { path: '/vehicles', label: 'Vehicles', icon: Truck, roles: ['Fleet Manager'] },
  { path: '/drivers', label: 'Drivers', icon: Users, roles: ['Fleet Manager', 'Safety Officer'] },
  { path: '/trips', label: 'Trips', icon: Map, roles: ['Fleet Manager', 'Driver'] },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['Fleet Manager'] },
  { path: '/fuel', label: 'Fuel & Expenses', icon: Fuel, roles: ['Fleet Manager', 'Financial Analyst'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
];

export function Layout() {
  const { state, dispatch } = useStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  if (!state.currentUser) {
    return <Navigate to="/login" />;
  }

  const allowedNavItems = navItems.filter(item => item.roles.includes(state.currentUser!.role));
  const currentPathName = navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-cream-light font-sans text-ink">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-cream/80 flex flex-col transition-all duration-300 shadow-sm z-20",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-cream/80 bg-white">
          {sidebarOpen && (
            <div className="flex items-center gap-2 pl-2">
              <Truck className="w-6 h-6 text-accent animate-pulse" />
              <span className="font-bold text-xl font-display tracking-tight text-ink">TransitOps</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-cream-light rounded-lg transition-colors ml-auto"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5 text-ink" />
          </button>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-1.5 px-3 overflow-y-auto">
          {allowedNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  isActive 
                    ? "bg-ink text-cream font-semibold shadow-sm" 
                    : "text-rust hover:bg-cream-light hover:text-ink font-medium"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-accent" : "text-sage group-hover:text-ink")} />
                {sidebarOpen && <span className="text-sm tracking-wide">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream/80">
          <button 
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-3 px-3 py-3 w-full text-rust hover:bg-red-50 hover:text-accent rounded-xl transition-all duration-200 font-medium cursor-pointer group"
          >
            <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            {sidebarOpen && <span className="text-sm tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur border-b border-cream/80 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-rust font-medium uppercase tracking-wider font-mono">TransitOps</span>
            <span className="text-cream text-sm">/</span>
            <h1 className="text-lg font-display font-semibold text-ink tracking-tight">
              {currentPathName}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-semibold text-ink leading-tight">{state.currentUser.name}</p>
              <span className="inline-flex items-center px-2 py-0.5 mt-0.5 rounded-full text-xs font-semibold bg-sage/20 text-ink">
                {state.currentUser.role}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-cream text-rust flex items-center justify-center font-bold font-display shadow-sm border border-cream/80 transition-transform hover:scale-105">
              {state.currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

