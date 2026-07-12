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
    <div className="min-h-screen bg-cream-light font-sans text-ink flex flex-col selection:bg-accent/20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full border-b border-cream/50 bg-white/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ink text-cream rounded-xl flex items-center justify-center shadow-md">
            <Truck className="w-6 h-6 text-accent" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-ink">TransitOps</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="font-semibold text-rust hover:text-accent transition-colors tracking-wide text-sm uppercase">Sign in</Link>
          <Link to="/login" className="px-5 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-all duration-200 shadow-lg shadow-accent/15 text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cream/40 rounded-full blur-3xl opacity-60 -z-10 animate-pulse" />
        
        <div className="max-w-4xl mx-auto space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/10 border border-sage/20 text-xs font-semibold uppercase tracking-wider text-ink/80 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            Next-Gen Logistics Intelligence
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-ink leading-[1.08] tracking-tight">
            Seamless Transport <br/>
            <span className="text-accent bg-clip-text">Operations Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-rust max-w-2xl mx-auto leading-relaxed font-medium">
            Digitize your vehicle fleet, manage dispatching operations, monitor safety, and extract real-time financial ROI in one unified, sleek dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/login" className="px-8 py-4 bg-ink text-cream rounded-xl font-bold text-lg hover:bg-ink/95 hover:shadow-lg transition-all duration-250 flex items-center gap-2 group shadow-md cursor-pointer">
              Explore Demo Platform 
              <ArrowRight className="w-5 h-5 text-accent transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-28 px-4 z-10 w-full">
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
      <footer className="border-t border-cream/40 py-8 text-center text-sage/80 mt-auto bg-white/70 backdrop-blur-md">
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
    <div className="bg-white p-8 rounded-2xl border border-cream/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 text-left group flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 bg-cream-light text-accent border border-cream rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold font-display text-ink mb-3 group-hover:text-accent transition-colors duration-200">{title}</h3>
        <p className="text-rust/90 text-sm leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

