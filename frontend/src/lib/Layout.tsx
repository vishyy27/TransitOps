import React, { useMemo, useState } from 'react';

import { createPortal } from 'react-dom';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { 
  LayoutDashboard, Truck, Users, Map, Wrench, 
  Fuel, BarChart3, LogOut, Menu, Briefcase, FileText,
  Bell, CheckCheck, ChevronDown, CircleUserRound, Settings, X,
  Sun, Moon
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
  { path: '/users', label: 'Staff Accounts', icon: CircleUserRound },
];

export function Layout() {
  const { state, dispatch } = useStore();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [isSignoutConfirmOpen, setIsSignoutConfirmOpen] = useState(false);

  const notifications = useMemo(() => {
    const items = [] as { id: string; title: string; detail: string; tone: string }[];
    const maintenance = state.maintenanceRecords.filter(record => record.status === 'Active').length;
    const drafts = state.trips.filter(trip => trip.status === 'Draft').length;
    const overdueInvoices = state.invoices.filter(invoice => invoice.status === 'Overdue').length;

    if (maintenance) items.push({ id: 'maintenance', title: `${maintenance} vehicle${maintenance > 1 ? 's' : ''} in maintenance`, detail: 'Review service work and release dates.', tone: 'bg-amber-500' });
    if (drafts) items.push({ id: 'drafts', title: `${drafts} trip draft${drafts > 1 ? 's' : ''} waiting`, detail: 'Assign a driver and dispatch when ready.', tone: 'bg-indigo-500' });
    if (overdueInvoices) items.push({ id: 'billing', title: `${overdueInvoices} overdue invoice${overdueInvoices > 1 ? 's' : ''}`, detail: 'Follow up with the client billing contact.', tone: 'bg-rose-500' });
    if (!items.length) items.push({ id: 'all-clear', title: 'Operations are on track', detail: 'No urgent fleet actions need attention.', tone: 'bg-emerald-500' });
    return items;
  }, [state.invoices, state.maintenanceRecords, state.trips]);
  const unreadCount = notificationsRead ? 0 : notifications.length;

  if (!state.currentUser) {
    return <Navigate to="/login" />;
  }

  const visibleNavItems = state.currentUser.role === 'Driver' ? navItems.filter(item => ['/dashboard', '/trips'].includes(item.path))
    : state.currentUser.role === 'Safety Officer' ? navItems.filter(item => ['/dashboard', '/drivers', '/maintenance'].includes(item.path))
    : state.currentUser.role === 'Financial Analyst' ? navItems.filter(item => ['/dashboard', '/fuel', '/reports', '/customers', '/invoices'].includes(item.path))
    : navItems;

  return (
    <div className={cn("flex h-screen font-sans text-slate-900 p-2 sm:p-4 overflow-hidden", state.workspacePreferences.darkMode ? "theme-dark bg-slate-950" : "bg-[#e5e9f0]")}>
      
      {/* Primary navigation */}
      <aside className="hidden lg:flex w-64 flex-col p-4 z-10 shrink-0 bg-white/65 backdrop-blur-[16px] rounded-[32px] border border-white/70 shadow-sm mr-4">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 mb-6"><div className="w-11 h-11 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-md"><Truck className="w-5 h-5" /></div><div><p className="font-display text-base font-bold text-slate-900">TransitOps</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Command center</p></div></Link>
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Operations</p>
        <nav className="flex-1 space-y-1 overflow-y-auto">{visibleNavItems.map(item => { const active = location.pathname.startsWith(item.path); return <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors', active ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:bg-white hover:text-slate-900')}><item.icon className="w-[18px] h-[18px]" />{item.label}</Link>; })}</nav>
        <div className="mt-4 border-t border-slate-200/70 pt-3"><button onClick={() => setIsSignoutConfirmOpen(true)} className="w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 cursor-pointer"><LogOut className="w-[18px] h-[18px]" />Sign out</button></div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-white/40 backdrop-blur-[24px] rounded-[40px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white/60 overflow-hidden relative">
        
        {/* Top Navigation Bar */}
        <header className="min-h-24 px-5 py-4 sm:px-10 flex items-center justify-between gap-3 shrink-0 relative z-20">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white/70 border border-white flex items-center justify-center text-slate-700 hover:bg-white cursor-pointer"
              aria-label="Toggle navigation"
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="min-w-0">
              <p className="hidden sm:block text-[11px] uppercase tracking-[0.16em] text-slate-400 font-bold">{state.workspacePreferences.workspaceName}</p>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight truncate">
                {navItems.find(i => location.pathname.startsWith(i.path))?.label || (location.pathname === '/profile-settings' ? 'Profile settings' : location.pathname === '/workspace-preferences' ? 'Workspace preferences' : 'Overview')}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             <button
               type="button"
               onClick={() => {
                 dispatch({
                   type: 'UPDATE_WORKSPACE_PREFERENCES',
                   payload: {
                     ...state.workspacePreferences,
                     darkMode: !state.workspacePreferences.darkMode
                   }
                 });
               }}
               className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-[12px] flex items-center justify-center text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/70 hover:bg-white transition-colors cursor-pointer"
               aria-label="Toggle theme mode"
             >
               {state.workspacePreferences.darkMode ? (
                 <Sun className="w-[18px] h-[18px] text-amber-500" />
               ) : (
                 <Moon className="w-[18px] h-[18px] text-indigo-600" />
               )}
             </button>

             <div className="relative">
               <button
                 type="button"
                 onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                 className="relative w-10 h-10 rounded-full bg-white/70 backdrop-blur-[12px] flex items-center justify-center text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/70 hover:bg-white transition-colors cursor-pointer"
                 aria-label={`Notifications, ${unreadCount} unread`}
                 aria-expanded={isNotificationsOpen}
               >
                 <Bell className="w-[18px] h-[18px]" />
                 {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-rose-500 text-[9px] leading-4 text-white font-bold rounded-full border-2 border-[#eef1f5]">{unreadCount}</span>}
               </button>
               {isNotificationsOpen && (
                 <div className="absolute right-0 mt-3 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-3xl border border-white/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
                   <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                     <div><p className="font-display font-bold text-slate-900">Notifications</p><p className="text-xs text-slate-500">Your operations inbox</p></div>
                     <button type="button" onClick={() => setNotificationsRead(true)} className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 cursor-pointer"><CheckCheck className="w-4 h-4" /> Mark read</button>
                   </div>
                   <div className="p-2 max-h-80 overflow-auto">
                     {notifications.map(item => <div key={item.id} className="flex gap-3 rounded-2xl p-3 hover:bg-slate-50 transition-colors"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.tone}`} /><div><p className="text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{item.detail}</p></div></div>)}
                   </div>
                   <Link to="/reports" onClick={() => setIsNotificationsOpen(false)} className="block px-5 py-3.5 text-center text-xs font-bold text-slate-700 border-t border-slate-100 hover:bg-slate-50">Open operations report</Link>
                 </div>
               )}
             </div>
             <div className="relative">
               <button type="button" onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }} className="flex items-center gap-2 rounded-full p-1 pr-1.5 sm:pr-3 bg-white/70 border border-white/70 hover:bg-white transition-colors cursor-pointer" aria-label="Open profile menu" aria-expanded={isProfileOpen}>
                 <div className="w-9 h-9 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold font-display shadow-sm">{state.currentUser.name.charAt(0).toUpperCase()}</div>
                 <div className="hidden sm:block text-left max-w-28"><p className="text-xs font-bold text-slate-900 truncate">{state.currentUser.name}</p><p className="text-[10px] text-slate-500 truncate">{state.currentUser.role}</p></div>
                 <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
               </button>
               {isProfileOpen && (
                 <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-white/80 bg-white/95 p-2 backdrop-blur-xl shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
                   <div className="p-3.5 border-b border-slate-100"><p className="font-bold text-slate-900">{state.currentUser.name}</p><p className="text-xs text-slate-500 truncate mt-0.5">{state.currentUser.email}</p><span className="inline-block mt-3 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{state.currentUser.role}</span></div>
                   <Link to="/profile-settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><CircleUserRound className="w-4 h-4" /> Profile settings</Link>
                   <Link to="/workspace-preferences" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Settings className="w-4 h-4" /> Workspace preferences</Link>
                 </div>
               )}
             </div>
          </div>
        </header>

        {isMobileNavOpen && (
          <nav className="lg:hidden mx-5 mb-4 rounded-3xl bg-white/80 border border-white p-2 grid grid-cols-2 sm:grid-cols-3 gap-1 shadow-sm">
            {visibleNavItems.map(item => (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileNavOpen(false)} className={cn('flex items-center gap-2 rounded-2xl px-3 py-3 text-xs font-bold', location.pathname.startsWith(item.path) ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white')}><item.icon className="w-4 h-4" />{item.label}</Link>
            ))}
            <button onClick={() => { setIsMobileNavOpen(false); setIsSignoutConfirmOpen(true); }} className="col-span-full flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 cursor-pointer border border-rose-100 mt-1"><LogOut className="w-4 h-4" />Sign out</button>
          </nav>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-10 pt-0">
           <Outlet />
        </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      {isSignoutConfirmOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="soft-card w-full max-w-sm backdrop-blur-[20px] bg-white/60 overflow-hidden shadow-2xl p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4 border border-rose-100">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Confirm Sign Out</h3>
            <p className="text-xs text-slate-500 font-semibold mt-2">Are you sure you want to log out of your TransitOps Command session?</p>
            
            <div className="mt-6 flex justify-center gap-3">
              <button 
                type="button" 
                onClick={() => setIsSignoutConfirmOpen(false)} 
                className="px-4 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsSignoutConfirmOpen(false);
                  dispatch({ type: 'LOGOUT' });
                }} 
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs uppercase tracking-wider rounded-full shadow-md cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

