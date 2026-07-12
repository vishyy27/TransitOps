import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Truck, BarChart3, Users, Map, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';
import { useStore } from '../store';

export function Landing() {
  const { state } = useStore();
  
  if (state.currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#e5e9f0] font-sans text-slate-900 flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Truck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight">TransitOps</span>
        </div>
        <div className="flex items-center gap-6 bg-white rounded-full p-2 pr-2 pl-6 shadow-sm border border-slate-200/60">
          <Link to="/login" className="font-semibold text-slate-500 hover:text-black transition-colors text-sm">Sign in</Link>
          <Link to="/login" className="px-6 py-2.5 bg-black text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-md text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 relative z-10">
        
        <div className="soft-card p-10 sm:p-16 max-w-4xl mx-auto space-y-8 z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 mb-2">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            Next-Gen Logistics Intelligence
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold font-display text-slate-900 leading-[1.05] tracking-tight">
            Seamless Transport <br/>
            Operations Platform
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Digitize your vehicle fleet, manage dispatching operations, monitor safety, and extract real-time financial ROI in one unified, sleek dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/login" className="px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all flex items-center gap-2 group shadow-xl shadow-black/10">
              Explore Demo 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-32 px-4 w-full">
          <FeatureCard 
            icon={Map}
            title="Intelligent Dispatch"
            description="Dynamically select available drivers and vehicles. Enforce capacity bounds and license expiration checks automatically."
          />
          <FeatureCard 
            icon={Wrench}
            title="Maintenance Logs"
            description="Manage vehicle repairs. Setting a vehicle to maintenance instantly rotates it out of the dispatch select options."
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Compliance Guard"
            description="Mitigate risks with strict active checks: flag expired licenses and filter suspended drivers from trip selection."
          />
          <FeatureCard 
            icon={BarChart3}
            title="Real-Time Analytics"
            description="Track precise operational costs, measure average fuel efficiency, and monitor net ROI per vehicle automatically."
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-10 text-center text-slate-400 mt-auto relative z-10">
        <p className="text-sm font-medium">© {new Date().getFullYear()} TransitOps. Engineered for modern transport hubs.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="soft-card p-8 hover:-translate-y-2 transition-transform duration-300 text-left flex flex-col h-full">
      <div className="w-14 h-14 bg-[#f4f6f9] text-black rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold font-display text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium flex-1">{description}</p>
    </div>
  );
}
