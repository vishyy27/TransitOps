import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { 
  LayoutDashboard, Truck, Users, Map, Wrench, 
  Fuel, BarChart3, LogOut, Menu, Share2, Star, Plus, Shield, MapPin, Inbox, Briefcase, FileText
} from 'lucide-react';
import { cn } from './utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vehicles', label: 'Vehicles', icon: Truck },
  { path: '/drivers', label: 'Drivers', icon: Users },
  { path: '/trips', label: 'Trips', icon: Map },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/fuel', label: 'Fuel', icon: Fuel },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/customers', label: 'Clients', icon: Briefcase },
  { path: '/invoices', label: 'Billing', icon: FileText },
];

export function Layout() {
  const { state, dispatch } = useStore();
  const location = useLocation();

  if (!state.currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-[#e5e9f0] font-sans text-slate-900 p-2 sm:p-4 overflow-hidden">
      
      {/* Mini Sidebar */}
      <aside className="w-16 sm:w-20 flex flex-col items-center py-4 gap-6 z-10 shrink-0 bg-white/50 backdrop-blur-[16px] rounded-[32px] border border-white/40 shadow-sm mr-2 sm:mr-4">
        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-md mb-2">
          <Truck className="w-6 h-6" />
        </div>
        
        <div className="flex flex-col gap-3 flex-1 w-full items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-white transition-colors">
             <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-white transition-colors">
             <Star className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-white transition-colors">
             <Plus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-black hover:bg-white transition-colors">
             <Shield className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5 ml-1" />
        </button>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-white/40 backdrop-blur-[24px] rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white/60 overflow-hidden relative">
        
        {/* Top Navigation Bar */}
        <header className="h-24 px-6 sm:px-10 flex items-center justify-between shrink-0">
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
             {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Overview'}
          </h1>
          
          <nav className="hidden lg:flex items-center gap-1 bg-transparent p-1.5 rounded-full overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border",
                    isActive ? "bg-white/60 backdrop-blur-md text-black border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.5)]" : "border-transparent text-slate-500 hover:text-black hover:bg-white/30"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
             {/* Search or extra actions */}
             <div className="hidden md:flex items-center gap-3">
               <button className="relative w-10 h-10 rounded-full bg-white/70 backdrop-blur-[12px] flex items-center justify-center text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/40 hover:bg-white transition-colors">
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
               </button>
             </div>
             
             {/* User Profile */}
             <div className="flex items-center gap-2">
               <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold font-display shadow-sm">
                 {state.currentUser.name.charAt(0).toUpperCase()}
               </div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-10 pt-0">
           <Outlet />
        </main>
      </div>
    </div>
  );
}
