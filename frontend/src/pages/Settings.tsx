import React, { useState } from 'react';
import { BellRing, Building2, Check, Globe2, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../lib/utils';

export function ProfileSettings() {
  const { state, dispatch } = useStore();
  const user = state.currentUser!;
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'UPDATE_USER', payload: { ...user, name: name.trim() || user.name, email: email.trim() || user.email } });
  };

  return <div className="max-w-4xl space-y-6">
    <section className="soft-card p-6 sm:p-8">
      <div className="flex items-start gap-4"><div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center"><UserRound className="w-6 h-6" /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Account</p><h2 className="mt-1 font-display text-2xl font-bold text-slate-900">Profile settings</h2><p className="mt-1 text-sm text-slate-500">Manage the personal details shown across your workspace.</p></div></div>
    </section>
    <form onSubmit={save} className="soft-card p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100"><div className="w-14 h-14 rounded-full bg-slate-950 text-white flex items-center justify-center text-xl font-display font-bold">{name.charAt(0).toUpperCase()}</div><div><p className="font-bold text-slate-900">{name || user.name}</p><p className="text-sm text-slate-500">{user.role}</p></div></div>
      <div className="grid md:grid-cols-2 gap-5"><label className="block text-sm font-semibold text-slate-700">Display name<input value={name} onChange={e => setName(e.target.value)} className="soft-input mt-2 w-full px-4 py-3" /></label><label className="block text-sm font-semibold text-slate-700">Email address<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="soft-input w-full py-3 pl-10 pr-4" /></div></label></div>
      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex gap-3"><ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" /><p className="text-sm text-slate-600"><span className="font-bold text-slate-900">Your role is {user.role}.</span> Permissions are managed by your workspace administrator.</p></div>
      <div className="flex justify-end"><button className="soft-button px-5 py-3 text-sm flex items-center gap-2"><Check className="w-4 h-4" /> Save profile</button></div>
    </form>
  </div>;
}

export function WorkspacePreferences() {
  const { state, dispatch } = useStore();
  const [preferences, setPreferences] = useState(state.workspacePreferences);
  const toggle = (key: 'dailyDigest' | 'dispatchAlerts' | 'expiringLicenseReminders') => setPreferences(current => ({ ...current, [key]: !current[key] }));
  const save = (event: React.FormEvent) => { event.preventDefault(); dispatch({ type: 'UPDATE_WORKSPACE_PREFERENCES', payload: preferences }); };
  const Toggle = ({ enabled, onClick }: { enabled: boolean; onClick: () => void }) => (
    <button 
      type="button" 
      onClick={onClick} 
      aria-pressed={enabled} 
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors cursor-pointer focus:outline-none", 
        enabled ? 'bg-slate-950' : 'bg-slate-300'
      )}
    >
      <span className={cn(
        "absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200", 
        enabled ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  );

  return <div className="max-w-4xl space-y-6">
    <section className="soft-card p-6 sm:p-8"><div className="flex items-start gap-4"><div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center"><Building2 className="w-6 h-6" /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p><h2 className="mt-1 font-display text-2xl font-bold text-slate-900">Workspace preferences</h2><p className="mt-1 text-sm text-slate-500">Set how your operations workspace communicates with your team.</p></div></div></section>
    <form onSubmit={save} className="soft-card p-6 sm:p-8 space-y-7">
      <div className="grid md:grid-cols-2 gap-5"><label className="block text-sm font-semibold text-slate-700">Workspace name<input value={preferences.workspaceName} onChange={e => setPreferences(current => ({ ...current, workspaceName: e.target.value }))} className="soft-input mt-2 w-full px-4 py-3" /></label><label className="block text-sm font-semibold text-slate-700">Timezone<div className="relative mt-2"><Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><select value={preferences.timezone} onChange={e => setPreferences(current => ({ ...current, timezone: e.target.value }))} className="soft-input w-full py-3 pl-10 pr-4 appearance-none"><option value="Asia/Kolkata">Asia/Kolkata (IST)</option><option value="America/New_York">America/New York (ET)</option><option value="Europe/London">Europe/London (GMT)</option></select></div></label></div>
      <div className="border-t border-slate-100 pt-6"><h3 className="font-display font-bold text-slate-900">Notifications & appearance</h3><div className="mt-4 space-y-3"><div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><div className="flex gap-3"><BellRing className="w-5 h-5 text-indigo-600 mt-0.5" /><div><p className="text-sm font-bold text-slate-900">Dispatch alerts</p><p className="text-xs text-slate-500 mt-0.5">Notify the team when trips are dispatched or delayed.</p></div></div><Toggle enabled={preferences.dispatchAlerts} onClick={() => toggle('dispatchAlerts')} /></div><div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><div className="flex gap-3"><Mail className="w-5 h-5 text-indigo-600 mt-0.5" /><div><p className="text-sm font-bold text-slate-900">Daily operations digest</p><p className="text-xs text-slate-500 mt-0.5">Send a summary of fleet activity each morning.</p></div></div><Toggle enabled={preferences.dailyDigest} onClick={() => toggle('dailyDigest')} /></div><div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><div className="flex gap-3"><Mail className="w-5 h-5 text-indigo-600 mt-0.5" /><div><p className="text-sm font-bold text-slate-900">Expiring License Reminders</p><p className="text-xs text-slate-500 mt-0.5">Dispatch automated email notifications when driver licenses are expiring soon.</p></div></div><Toggle enabled={preferences.expiringLicenseReminders} onClick={() => toggle('expiringLicenseReminders')} /></div><div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4"><div className="flex gap-3"><Globe2 className="w-5 h-5 text-indigo-600 mt-0.5" /><div><p className="text-sm font-bold text-slate-900">Dark command view</p><p className="text-xs text-slate-500 mt-0.5">Use a low-light interface for long operations shifts.</p></div></div><Toggle enabled={preferences.darkMode} onClick={() => setPreferences(current => ({ ...current, darkMode: !current.darkMode }))} /></div></div></div>
      <div className="flex justify-end"><button className="soft-button px-5 py-3 text-sm flex items-center gap-2"><Check className="w-4 h-4" /> Save preferences</button></div>
    </form>
  </div>;
}
