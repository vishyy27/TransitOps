import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Truck, 
  BarChart3, 
  Users, 
  Map, 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  Shield, 
  FileText, 
  Bell, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  ChevronRight,
  Workflow
} from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../lib/utils';

export function Landing() {
  const { state } = useStore();
  const [fleetSize, setFleetSize] = useState(25);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'fleet' | 'compliance' | 'dispatch'>('fleet');
  
  if (state.currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Savings calculation logic for the interactive ROI Calculator
  const estimatedSavings = Math.round(fleetSize * 180 * 12);
  const hoursSaved = fleetSize * 4 * 12;

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Glassmorphic Header */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto w-[92%] sm:w-full mt-4">
        <div className="backdrop-blur-md bg-slate-950/70 border border-slate-800 rounded-full px-6 py-3.5 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white">TransitOps</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-450">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roi" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#compliance" className="hover:text-white transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="font-semibold text-slate-350 hover:text-white transition-colors text-sm px-3 py-1.5">Sign in</Link>
            <Link to="/login" className="px-5 py-2.5 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 text-sm flex items-center gap-1.5">
              Launch Console
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full relative z-10 pt-16 sm:pt-24">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-slate-950/80 border border-slate-850 shadow-inner text-xs font-bold text-accent mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            TransitOps Enterprise Suite 2.0
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold font-display text-white leading-[1.05] tracking-tight">
            The Intelligent Command Center <br className="hidden sm:inline"/>
            for <span className="bg-gradient-to-r from-accent via-indigo-400 to-accent bg-clip-text text-transparent">Transit Operations</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Digitize fleet logistics, verify driver compliance in real-time, automate expiring license reminders, and safeguard operational assets through a single premium dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/login" className="px-8 py-4 bg-accent text-white rounded-full font-bold text-base hover:bg-accent/90 transition-all flex items-center gap-2 group shadow-lg shadow-accent/20">
              Start Enterprise Trial
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#features" className="px-8 py-4 bg-slate-950/80 border border-slate-850 hover:border-slate-800 text-slate-350 hover:text-white rounded-full font-bold text-base transition-all">
              Learn More
            </a>
          </div>
        </div>

        {/* Live System Preview (Sleek Glassmorphic Dashboard Showcase) */}
        <div className="mt-16 sm:mt-24 p-4 sm:p-6 rounded-3xl bg-slate-950/80 border border-slate-850 shadow-2xl relative">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="flex items-center gap-2 pb-4 border-b border-slate-850 text-xs font-semibold text-slate-500">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-800" />
              <span className="w-3 h-3 rounded-full bg-slate-800" />
              <span className="w-3 h-3 rounded-full bg-slate-800" />
            </div>
            <span className="ml-4 font-mono">ops.transitops.internal/dashboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-850 flex items-center gap-4">
              <div className="p-3.5 bg-accent/10 text-accent rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Operations</p>
                <p className="text-xl font-bold font-mono text-white mt-0.5">99.8%</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-850 flex items-center gap-4">
              <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Annual Fleet Savings</p>
                <p className="text-xl font-bold font-mono text-white mt-0.5">$84,200+</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-850 flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-450 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance Status</p>
                <p className="text-xl font-bold font-mono text-white mt-0.5">Compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Interactive Feature Deep-Dive */}
        <section id="features" className="pt-32 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
              Built for Scale. Engineered for Safety.
            </h2>
            <p className="text-slate-450 text-base sm:text-lg">
              Explore how TransitOps handles complex operational constraints and digitizes fleet management.
            </p>
          </div>

          <div className="flex justify-center gap-3 p-1.5 bg-slate-950/80 border border-slate-850 rounded-full max-w-md mx-auto">
            <button 
              onClick={() => setActiveFeatureTab('fleet')}
              className={cn("flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer", activeFeatureTab === 'fleet' ? "bg-accent text-white shadow" : "text-slate-400 hover:text-slate-200")}
            >
              Fleet Logs
            </button>
            <button 
              onClick={() => setActiveFeatureTab('compliance')}
              className={cn("flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer", activeFeatureTab === 'compliance' ? "bg-accent text-white shadow" : "text-slate-400 hover:text-slate-200")}
            >
              Compliance
            </button>
            <button 
              onClick={() => setActiveFeatureTab('dispatch')}
              className={cn("flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer", activeFeatureTab === 'dispatch' ? "bg-accent text-white shadow" : "text-slate-400 hover:text-slate-200")}
            >
              Auto Dispatch
            </button>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-850 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[400px]">
            <div className="lg:col-span-5 space-y-6">
              {activeFeatureTab === 'fleet' && (
                <>
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Truck className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-bold text-white">Full-Lifecycle Fleet Asset Control</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Track odometer readings, fuel consumption records, and maintenance logs in real-time. Instantly flag assets as 'In Shop' or 'Retired' to dynamically sync with route scheduling.
                  </p>
                  <ul className="space-y-3.5">
                    <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300"><CheckCircle className="w-4 h-4 text-accent" /> Custom capacity & load threshold enforcement</li>
                    <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300"><CheckCircle className="w-4 h-4 text-accent" /> Auto maintenance logs and cost integration</li>
                  </ul>
                </>
              )}

              {activeFeatureTab === 'compliance' && (
                <>
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-bold text-white">Secure Document Registry Vault</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Upload licensing documents, verify validation details in the secure vault, and trigger automated license expiration emails before compliance gaps occurs.
                  </p>
                  <ul className="space-y-3.5">
                    <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300"><CheckCircle className="w-4 h-4 text-accent" /> Secure file attachments & document viewers</li>
                    <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300"><CheckCircle className="w-4 h-4 text-accent" /> Real-time licensing compliance email triggers</li>
                  </ul>
                </>
              )}

              {activeFeatureTab === 'dispatch' && (
                <>
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Workflow className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-bold text-white">Capacity-Aware Routing & Dispatch</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Create trips with source, destination, and cargo weights. The intelligent dispatcher automatically checks for vehicle load capacity and restricts drivers with compliance violations.
                  </p>
                  <ul className="space-y-3.5">
                    <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300"><CheckCircle className="w-4 h-4 text-accent" /> Safety-score driver prioritization</li>
                    <li className="flex items-center gap-2.5 text-xs font-semibold text-slate-300"><CheckCircle className="w-4 h-4 text-accent" /> Automatic trip execution tracking</li>
                  </ul>
                </>
              )}
            </div>

            <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col justify-center min-h-[250px]">
              {activeFeatureTab === 'fleet' && (
                <div className="space-y-3 font-mono text-[11px] text-slate-400">
                  <div className="flex justify-between border-b border-slate-850 pb-2"><span className="text-white font-bold">TRK-84 · Volvo VNL</span><span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">In Shop</span></div>
                  <div className="flex justify-between"><span>Max Load Capacity</span><span className="text-white">5,000 kg</span></div>
                  <div className="flex justify-between"><span>Current Odometer</span><span className="text-white">128,000 km</span></div>
                  <div className="flex justify-between"><span>Total Maintenance Cost</span><span className="text-rose-400">$2,450.00</span></div>
                  <div className="flex justify-between"><span>Active Route Assignment</span><span className="text-slate-500">None (Auto-restricted)</span></div>
                </div>
              )}

              {activeFeatureTab === 'compliance' && (
                <div className="space-y-3 font-mono text-[11px] text-slate-400">
                  <div className="flex justify-between border-b border-slate-850 pb-2"><span className="text-white font-bold">commercial_insurance_policy.pdf</span><span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Verified Safe</span></div>
                  <div className="flex justify-between"><span>Registry ID</span><span>REG-882194</span></div>
                  <div className="flex justify-between"><span>Uploader Node</span><span>TransitOps Vault Alpha</span></div>
                  <div className="flex justify-between"><span>Expiration Reminder Email</span><span className="text-emerald-450">Active Toggle</span></div>
                  <div className="flex justify-between"><span>Verification Status</span><span className="text-accent">Passed Cryptographic Registry</span></div>
                </div>
              )}

              {activeFeatureTab === 'dispatch' && (
                <div className="space-y-3 font-mono text-[11px] text-slate-400">
                  <div className="flex justify-between border-b border-slate-850 pb-2"><span className="text-white font-bold">Trip Routing Engine</span><span className="text-accent bg-accent/10 px-2 py-0.5 rounded">Ready</span></div>
                  <div className="flex justify-between"><span>Cargo Weight</span><span className="text-white">4,200 kg</span></div>
                  <div className="flex justify-between"><span>Eligible Fleet Vehicles</span><span>12 (Load Capacity {'>'}= Cargo Weight)</span></div>
                  <div className="flex justify-between"><span>Available Active Drivers</span><span>8 (Safety Score Avg: 94)</span></div>
                  <div className="flex justify-between"><span>Compliance Filter Pass</span><span className="text-emerald-450">Yes (Excluded Expired / Suspended Nodes)</span></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-24 w-full">
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
        </section>

        {/* Interactive ROI Calculator */}
        <section id="roi" className="pt-32">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950/80 border border-slate-850 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Calculate Your Fleet's <br/>
                TransitOps Efficiency ROI
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Logistics compliance issues and manual routing errors eat up thousands of dollars yearly. Adjust the slider to see how much time and money you save with TransitOps.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-450">
                  <span>Current Fleet Size</span>
                  <span className="text-accent font-mono text-sm">{fleetSize} Vehicles</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="150" 
                  value={fleetSize}
                  onChange={e => setFleetSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Est. Annual Savings</p>
                <p className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">${estimatedSavings.toLocaleString()}</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                <Users className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Hours Restored</p>
                <p className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">{hoursSaved.toLocaleString()} hrs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Call To Action */}
        <section className="pt-32 pb-24">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-accent/90 to-indigo-950 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              Ready to Upgrade Your Logistics Strategy?
            </h2>
            <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Join transit operational hubs deploying TransitOps to secure compliance audit scores and manage their fleets dynamically.
            </p>
            <div className="pt-6">
              <Link to="/login" className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-50 transition-all font-bold rounded-full inline-flex items-center gap-2 shadow-xl shadow-slate-950/20">
                Launch Console Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-slate-950/40 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white font-display">TransitOps</span>
          </div>
          <p className="text-slate-500 text-xs font-semibold">© {new Date().getFullYear()} TransitOps. Engineered for modern transport hubs.</p>
        </div>
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
    <div className="p-8 rounded-3xl bg-slate-900 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col h-full group shadow-md">
      <div className="w-12 h-12 bg-slate-950 text-accent group-hover:bg-accent group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold font-display text-white mb-2.5">{title}</h3>
      <p className="text-slate-450 text-xs sm:text-sm leading-relaxed font-semibold flex-1">{description}</p>
    </div>
  );
}
