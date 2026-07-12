import React, { useState } from 'react';
import { useStore } from '../store';
import { User } from '../types';
import { Plus, Search, ShieldCheck, Mail, UserCheck, Edit, Trash2, X, Check, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Badge } from '../components/Badge';

export function Users() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = state.users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search accounts by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm soft-input font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer text-white"
          >
            <Plus className="w-4.5 h-4.5" />
            Create Account
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="soft-card p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f4f6f9] border border-white/60 flex items-center justify-center text-slate-900 group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 leading-tight">{user.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{user.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingUser(user)} 
                  className="p-1.5 hover:bg-[#f4f6f9] rounded-lg text-slate-500 hover:text-black cursor-pointer"
                  title="Update Credentials"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => dispatch({ type: 'DELETE_USER_ACCOUNT', payload: user.id })} 
                  className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 flex-1 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/50 p-2 rounded-2xl border border-white/40">
                <Mail className="w-4 h-4 text-slate-400" />
                {user.email}
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-white/50 p-2 rounded-2xl border border-white/40">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Password:</span>
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{user.password || '••••••••'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Status</span>
              <Badge variant={user.status === 'Active' ? 'success' : 'destructive'}>
                {user.status || 'Active'}
              </Badge>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm font-semibold text-slate-400">
            No registered staff accounts match your search.
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateUserModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {editingUser && (
        <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </div>
  );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Driver' as User['role'],
    password: '',
    status: 'Active' as const
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_USER_ACCOUNT',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-md backdrop-blur-[20px] bg-white/60 overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Create Staff Account</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" placeholder="e.g. David Miller" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" placeholder="e.g. david@transitops.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">System Role</label>
              <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as User['role']})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Driver">Driver</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Account Password</label>
              <div className="relative">
                <input required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-3.5 pr-10 py-2.5 soft-input font-medium" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/60 mt-4">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer text-white">
              <Check className="w-4 h-4" /> Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUserModal({ user, onClose }: { user: User; onClose: () => void }) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: user.password || 'password123',
    status: user.status || 'Active'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_USER_ACCOUNT',
      payload: {
        id: user.id,
        ...formData
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-md backdrop-blur-[20px] bg-white/60 overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Manage Access Control</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">System Role</label>
              <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as User['role']})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Driver">Driver</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Password</label>
              <div className="relative">
                <input required type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-3.5 pr-10 py-2.5 soft-input font-medium" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Access Status</label>
            <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Suspended'})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
              <option value="Active">Active (Full system permissions)</option>
              <option value="Suspended">Suspended (Access blocked)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/60 mt-4">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer text-white">
              <Check className="w-4 h-4" /> Update Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
