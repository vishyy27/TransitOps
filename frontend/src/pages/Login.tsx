import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { Truck, ShieldCheck, Mail, Lock } from 'lucide-react';

const ROLES: Role[] = ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];

const DEMO_USERS: Record<Role, { email: string; name: string }> = {
  'Fleet Manager': { email: 'manager@transitops.com', name: 'Marcus (Manager)' },
  'Driver': { email: 'driver@transitops.com', name: 'Alex (Driver)' },
  'Safety Officer': { email: 'safety@transitops.com', name: 'Sarah (Officer)' },
  'Financial Analyst': { email: 'finance@transitops.com', name: 'Elena (Analyst)' }
};

export function Login() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [email, setEmail] = useState(DEMO_USERS['Fleet Manager'].email);
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setEmail(DEMO_USERS[selectedRole].email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'LOGIN',
        payload: {
          id: Math.random().toString(36).substr(2, 9),
          name: DEMO_USERS[role].name,
          email,
          role
        }
      });
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#e5e9f0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="mx-auto w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center shadow-lg mb-6">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-bold text-slate-900 font-display tracking-tight leading-none mb-2">
          TransitOps
        </h2>
        <p className="text-slate-500 font-medium">
          Enterprise Transport Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="soft-card p-8">
          {/* Role selection tabs */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Select Demo Persona
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`py-3 px-3 text-xs font-bold rounded-2xl transition-all duration-200 cursor-pointer ${
                    role === r 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-[#f4f6f9] text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 ml-1 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="soft-input w-full pl-12 pr-4 py-3.5 font-medium"
                    placeholder="name@transitops.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 ml-1 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="soft-input w-full pl-12 pr-4 py-3.5 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="soft-button w-full flex justify-center py-4 px-4 text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
