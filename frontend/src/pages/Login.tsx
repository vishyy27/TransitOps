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
    <div className="min-h-screen bg-ink flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-accent/20">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-rust/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-sage/20 rounded-full blur-3xl opacity-50" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="mx-auto w-12 h-12 bg-cream text-ink border border-cream/50 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Truck className="w-7 h-7 text-accent" />
        </div>
        <h2 className="text-4xl font-extrabold text-cream font-display tracking-tight leading-none">
          TransitOps
        </h2>
        <p className="mt-2.5 text-sm text-sage font-medium tracking-wide">
          Enterprise Transport Management Suite
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-cream-light py-8 px-6 shadow-2xl rounded-2xl border border-cream/40">
          {/* Role selection tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-ink/75 uppercase tracking-wider mb-2 text-center">
              Choose Persona (Demo Login)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 border cursor-pointer ${
                    role === r 
                      ? 'bg-ink text-cream border-ink shadow-sm' 
                      : 'bg-white text-rust border-cream hover:bg-white/80 hover:text-ink'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-xs font-semibold border border-red-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-ink">Email address</label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-sage/30 rounded-xl shadow-sm placeholder-sage/70 text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm bg-white font-medium transition-all"
                  placeholder="name@transitops.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink">Password</label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-sage/30 rounded-xl shadow-sm placeholder-sage/70 text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm bg-white font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-all duration-200 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

