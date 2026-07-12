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
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [email, setEmail] = useState(DEMO_USERS['Fleet Manager'].email);
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    // Find the user in our state with this role to prefill email
    const matchedUser = state.users.find(u => u.role === selectedRole);
    setEmail(matchedUser ? matchedUser.email : DEMO_USERS[selectedRole].email);
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
      const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        setError('No staff account found with this email.');
        setLoading(false);
        return;
      }

      if (user.password !== password) {
        setError('Entered password is incorrect.');
        setLoading(false);
        return;
      }

      if (user.status === 'Suspended') {
        setError('This account is suspended. Contact administration.');
        setLoading(false);
        return;
      }

      dispatch({
        type: 'LOGIN',
        payload: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
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

            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="soft-button w-full flex justify-center py-4 px-4 text-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                  <span className="bg-white px-3 text-slate-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    dispatch({
                      type: 'LOGIN',
                      payload: {
                        id: 'google-user',
                        name: 'Marcus (Manager)',
                        email: 'marcus.manager@gmail.com',
                        role: 'Fleet Manager'
                      }
                    });
                    navigate('/dashboard');
                  }, 1200);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
