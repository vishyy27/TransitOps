import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { api } from '../lib/api';
import { Loader2 } from 'lucide-react';
import { Role } from '../types';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { dispatch } = useStore();

  useEffect(() => {
    const processOAuth = async () => {
      if (!token) {
        console.error('No token found in URL');
        navigate('/login');
        return;
      }

      try {
        // Save the token
        localStorage.setItem('transitops-auth-token', token);
        
        // Fetch current user via /auth/me
        const response = await api.get('/auth/me');
        
        dispatch({
          type: 'LOGIN',
          payload: {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role as Role,
            authProvider: response.auth_provider,
          }
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to fetch user data during OAuth callback:', error);
        localStorage.removeItem('transitops-auth-token');
        navigate('/login');
      }
    };

    processOAuth();
  }, [token, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-[#e5e9f0] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
      <h2 className="text-xl font-bold text-slate-900 font-display">Authenticating...</h2>
      <p className="text-slate-500 mt-2 text-sm">Please wait while we complete your sign in.</p>
    </div>
  );
}
