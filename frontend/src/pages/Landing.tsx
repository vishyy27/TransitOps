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
  const isDark = state.workspacePreferences.darkMode;

  return (
    <div className={cn(
      "min-h-screen font-sans flex flex-col relative overflow-x-hidden transition-colors duration-250 selection:bg-accent selection:text-white", 
      isDark ? "bg-slate-900 text-slate-100" : "bg-[#e5e9f0] text-slate-900"
    )}>
      {/* Decorative Background Elements */}
      <div className={cn("absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none", isDark ? "bg-accent/10" : "bg-accent/5")} />
      <div className={cn("absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none", isDark ? "bg-indigo-500/10" : "bg-indigo-500/5")} />

      {/* Floating Glassmorphic Header */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto w-[92%] sm:w-full mt-4">
        <div className={cn(
          "backdrop-blur-md border px-6 py-3.5 flex items-center justify-between shadow-2xl rounded-full transition-colors duration-200",
          isDark ? "bg-slate-950/70 border-slate-800" : "bg-white/80 border-slate-200/60"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20">
              <Truck className="w-5 h-5" />
            </div>
            <span className={cn("text-xl font-bold font-display tracking-tight", isDark ? "text-white" : "text-slate-900")}>TransitOps</span>
          </div>
          
          <div className={cn("hidden md:flex items-center gap-8 text-sm font-semibold transition-colors", isDark ? "text-slate-400" : "text-slate-650")}>
            <a href="#features" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>Features</a>
            <a href="#roi" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>ROI Calculator</a>
            <a href="#compliance" className={cn("transition-colors", isDark ? "hover:text-white" : "hover:text-black")}>Security</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className={cn("font-semibold transition-colors text-sm px-3 py-1.5", isDark ? "text-slate-350 hover:text-white" : "text-slate-500 hover:text-black")}>Sign in</Link>
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
          <div className={cn(
            "inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full border shadow-inner text-xs font-bold text-accent mb-2 transition-colors",
            isDark ? "bg-slate-950/85 border-slate-850" : "bg-white border-slate-200"
          )}>
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            TransitOps Enterprise Suite 2.0
          </div>
          
          <h1 className={cn(
            "text-5xl sm:text-7xl font-extrabold font-display leading-[1.05] tracking-tight transition-colors",
            isDark ? "text-white" : "text-slate-900"
          )}>
            The Intelligent Command Center <br className="hidden sm:inline"/>
            for <span className="bg-gradient-to-r from-accent via-indigo-400 to-accent bg-clip-text text-transparent">Transit Operations</span>
          </h1>
          
          <p className={cn(
            "text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium transition-colors",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            Digitize fleet logistics, verify driver compliance in real-time, automate expiring license reminders, and safeguard operational assets through a single premium dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/login" className="px-8 py-4 bg-accent text-white rounded-full font-bold text-base hover:bg-accent/90 transition-all flex items-center gap-2 group shadow-lg shadow-accent/20">
              Start Enterprise Trial
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#features" className={cn(
              "px-8 py-4 border rounded-full font-bold text-base transition-all",
              isDark 
                ? "bg-slate-950/80 border-slate-850 text-slate-350 hover:text-white" 
                : "bg-white border-slate-200 text-slate-650 hover:text-slate-900 shadow-sm"
            )}>
              Learn More
            </a>
          </div>
        </div>

        {/* Live System Preview (Sleek Glassmorphic Dashboard Showcase) */}
        <div className={cn(
          "mt-16 sm:mt-24 p-4 sm:p-6 rounded-3xl border shadow-2xl relative transition-colors duration-200",
          isDark ? "bg-slate-950/80 border-slate-850" : "bg-white border-slate-200"
        )}>
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className={cn(
            "flex items-center gap-2 pb-4 border-b text-xs font-semibold transition-colors",
            isDark ? "border-slate-850 text-slate-500" : "border-slate-100 text-slate-400"
          )}>
            <div className="flex gap-1.5">
              <span className={cn("w-3 h-3 rounded-full", isDark ? "bg-slate-800" : "bg-slate-200")} />
              <span className={cn("w-3 h-3 rounded-full", isDark ? "bg-slate-800" : "bg-slate-200")} />
              <span className={cn("w-3 h-3 rounded-full", isDark ? "bg-slate-800" : "bg-slate-200")} />
            </div>
            <span className="ml-4 font-mono">ops.transitops.internal/dashboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className={cn("p-5 rounded-2xl border flex items-center gap-4 transition-colors", isDark ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-150")}>
              <div className="p-3.5 bg-accent/10 text-accent rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Operations</p>
                <p className={cn("text-xl font-bold font-mono mt-0.5", isDark ? "text-white" : "text-slate-900")}>99.8%</p>
              </div>
            </div>
            <div className={cn("p-5 rounded-2xl border flex items-center gap-4 transition-colors", isDark ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-150")}>
              <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Annual Fleet Savings</p>
                <p className={cn("text-xl font-bold font-mono mt-0.5", isDark ? "text-white" : "text-slate-900")}>$84,200+</p>
              </div>
            </div>
            <div className={cn("p-5 rounded-2xl border flex items-center gap-4 transition-colors", isDark ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-150")}>
              <div className="p-3.5 bg-emerald-500/10 text-emerald-450 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance Status</p>
                <p className={cn("text-xl font-bold font-mono mt-0.5", isDark ? "text-white" : "text-slate-900")}>Compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Interactive Feature Deep-Dive */}
        <section id="features" className="pt-32 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className={cn("text-3xl sm:text-5xl font-bold font-display tracking-tight transition-colors", isDark ? "text-white" : "text-slate-900")}>
              Built for Scale. Engineered for Safety.
            </h2>
            <p className={cn("text-base sm:text-lg transition-colors", isDark ? "text-slate-450" : "text-slate-500")}>
              Explore how TransitOps handles complex operational constraints and digitizes fleet management.
            </p>
          </div>

          <div className={cn(
            "flex justify-center gap-3 p-1.5 border rounded-full max-w-md mx-auto transition-colors duration-200",
            isDark ? "bg-slate-950/80 border-slate-850" : "bg-white border-slate-200 shadow-sm"
          )}>
            <button 
              onClick={() => setActiveFeatureTab('fleet')}
              className={cn(
                "flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer", 
                activeFeatureTab === 'fleet' 
                  ? "bg-accent text-white shadow" 
                  : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800")
              )}
            >
              Fleet Logs
            </button>
            <button 
              onClick={() => setActiveFeatureTab('compliance')}
              className={cn(
                "flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer", 
                activeFeatureTab === 'compliance' 
                  ? "bg-accent text-white shadow" 
                  : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800")
              )}
            >
              Compliance
            </button>
            <button 
              onClick={() => setActiveFeatureTab('dispatch')}
              className={cn(
                "flex-1 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer", 
                activeFeatureTab === 'dispatch' 
                  ? "bg-accent text-white shadow" 
                  : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800")
              )}
            >
              Auto Dispatch
            </button>
          </div>

          <div className={cn(
            "p-8 sm:p-12 rounded-3xl border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[400px] transition-colors duration-250",
            isDark ? "bg-slate-900 border-slate-850" : "bg-white border-slate-200 shadow-md"
          )}>
            <div className="lg:col-span-5 space-y-6">
              {activeFeatureTab === 'fleet' && (
                <>
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Truck className="w-6 h-6" /></div>
                  <h3 className={cn("text-2xl font-bold transition-colors", isDark ? "text-white" : "text-slate-900")}>Full-Lifecycle Fleet Asset Control</h3>
                  <p className={cn("text-sm leading-relaxed transition-colors", isDark ? "text-slate-400" : "text-slate-500")}>
                    Track odometer readings, fuel consumption records, and maintenance logs in real-time. Instantly flag assets as 'In Shop' or 'Retired' to dynamically sync with route scheduling.
                  </p>
                  <ul className="space-y-3.5">
                    <li className={cn("flex items-center gap-2.5 text-xs font-semibold transition-colors", isDark ? "text-slate-300" : "text-slate-700")}><CheckCircle className="w-4 h-4 text-accent" /> Custom capacity & load threshold enforcement</li>
                    <li className={cn("flex items-center gap-2.5 text-xs font-semibold transition-colors", isDark ? "text-slate-300" : "text-slate-700")}><CheckCircle className="w-4 h-4 text-accent" /> Auto maintenance logs and cost integration</li>
                  </ul>
                </>
              )}

              {activeFeatureTab === 'compliance' && (
                <>
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                  <h3 className={cn("text-2xl font-bold transition-colors", isDark ? "text-white" : "text-slate-900")}>Secure Document Registry Vault</h3>
                  <p className={cn("text-sm leading-relaxed transition-colors", isDark ? "text-slate-400" : "text-slate-500")}>
                    Upload licensing documents, verify validation details in the secure vault, and trigger automated license expiration emails before compliance gaps occurs.
                  </p>
                  <ul className="space-y-3.5">
                    <li className={cn("flex items-center gap-2.5 text-xs font-semibold transition-colors", isDark ? "text-slate-300" : "text-slate-700")}><CheckCircle className="w-4 h-4 text-accent" /> Secure file attachments & document viewers</li>
                    <li className={cn("flex items-center gap-2.5 text-xs font-semibold transition-colors", isDark ? "text-slate-300" : "text-slate-700")}><CheckCircle className="w-4 h-4 text-accent" /> Real-time licensing compliance email triggers</li>
                  </ul>
                </>
              )}

              {activeFeatureTab === 'dispatch' && (
                <>
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center"><Workflow className="w-6 h-6" /></div>
                  <h3 className={cn("text-2xl font-bold transition-colors", isDark ? "text-white" : "text-slate-900")}>Capacity-Aware Routing & Dispatch</h3>
                  <p className={cn("text-sm leading-relaxed transition-colors", isDark ? "text-slate-400" : "text-slate-500")}>
                    Create trips with source, destination, and cargo weights. The intelligent dispatcher automatically checks for vehicle load capacity and restricts drivers with compliance violations.
                  </p>
                  <ul className="space-y-3.5">
                    <li className={cn("flex items-center gap-2.5 text-xs font-semibold transition-colors", isDark ? "text-slate-300" : "text-slate-700")}><CheckCircle className="w-4 h-4 text-accent" /> Safety-score driver prioritization</li>
                    <li className={cn("flex items-center gap-2.5 text-xs font-semibold transition-colors", isDark ? "text-slate-300" : "text-slate-700")}><CheckCircle className="w-4 h-4 text-accent" /> Automatic trip execution tracking</li>
                  </ul>
                </>
              )}
            </div>

            <div className={cn(
              "lg:col-span-7 p-6 rounded-2xl border flex flex-col justify-center min-h-[250px] transition-colors duration-200",
              isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"
            )}>
              {activeFeatureTab === 'fleet' && (
                <div className="space-y-3 font-mono text-[11px] text-slate-400">
                  <div className={cn("flex justify-between border-b pb-2", isDark ? "border-slate-850" : "border-slate-200")}><span className={isDark ? "text-white" : "text-slate-900"}>TRK-84 · Volvo VNL</span><span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">In Shop</span></div>
                  <div className="flex justify-between"><span>Max Load Capacity</span><span className={isDark ? "text-white" : "text-slate-900"}>5,000 kg</span></div>
                  <div className="flex justify-between"><span>Current Odometer</span><span className={isDark ? "text-white" : "text-slate-900"}>128,000 km</span></div>
                  <div className="flex justify-between"><span>Total Maintenance Cost</span><span className="text-rose-450">$2,450.00</span></div>
                  <div className="flex justify-between"><span>Active Route Assignment</span><span className="text-slate-500">None (Auto-restricted)</span></div>
                </div>
              )}

              {activeFeatureTab === 'compliance' && (
                <div className="space-y-3 font-mono text-[11px] text-slate-400">
                  <div className={cn("flex justify-between border-b pb-2", isDark ? "border-slate-850" : "border-slate-200")}><span className={isDark ? "text-white" : "text-slate-900"}>commercial_insurance_policy.pdf</span><span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Verified Safe</span></div>
                  <div className="flex justify-between"><span>Registry ID</span><span>REG-882194</span></div>
                  <div className="flex justify-between"><span>Uploader Node</span><span>TransitOps Vault Alpha</span></div>
                  <div className="flex justify-between"><span>Expiration Reminder Email</span><span className="text-emerald-450">Active Toggle</span></div>
                  <div className="flex justify-between"><span>Verification Status</span><span className="text-accent">Passed Cryptographic Registry</span></div>
                </div>
              )}

              {activeFeatureTab === 'dispatch' && (
                <div className="space-y-3 font-mono text-[11px] text-slate-400">
                  <div className={cn("flex justify-between border-b pb-2", isDark ? "border-slate-850" : "border-slate-200")}><span className={isDark ? "text-white" : "text-slate-900"}>Trip Routing Engine</span><span className="text-accent bg-accent/10 px-2 py-0.5 rounded">Ready</span></div>
                  <div className="flex justify-between"><span>Cargo Weight</span><span className={isDark ? "text-white" : "text-slate-900"}>4,200 kg</span></div>
                  <div className="flex justify-between"><span>Eligible Fleet Vehicles</span><span>12 (Load Capacity {'>'}= Cargo Weight)</span></div>
                  <div className="flex justify-between"><span>Available Active Drivers</span><span>8 (Safety Score Avg: 94)</span></div>
                  <div className="flex justify-between"><span>Compliance Filter Pass</span><span className="text-emerald-455">Yes (Excluded Expired / Suspended Nodes)</span></div>
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
            isDark={isDark}
          />
          <FeatureCard 
            icon={Wrench}
            title="Maintenance Logs"
            description="Manage vehicle repairs. Setting a vehicle to maintenance instantly rotates it out of the dispatch select options."
            isDark={isDark}
          />
          <FeatureCard 
            icon={ShieldCheck}
            title="Compliance Guard"
            description="Mitigate risks with strict active checks: flag expired licenses and filter suspended drivers from trip selection."
            isDark={isDark}
          />
          <FeatureCard 
            icon={BarChart3}
            title="Real-Time Analytics"
            description="Track precise operational costs, measure average fuel efficiency, and monitor net ROI per vehicle automatically."
            isDark={isDark}
          />
        </section>

        {/* Interactive ROI Calculator */}
        <section id="roi" className="pt-32">
          <div className={cn(
            "p-8 sm:p-12 rounded-3xl border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-colors duration-200",
            isDark ? "bg-slate-950/80 border-slate-850" : "bg-white border-slate-200 shadow-md"
          )}>
            <div className="lg:col-span-6 space-y-6">
              <h2 className={cn("text-3xl sm:text-4xl font-bold font-display tracking-tight transition-colors", isDark ? "text-white" : "text-slate-900")}>
                Calculate Your Fleet's <br/>
                TransitOps Efficiency ROI
              </h2>
              <p className={cn("text-sm leading-relaxed transition-colors", isDark ? "text-slate-400" : "text-slate-500")}>
                Logistics compliance issues and manual routing errors eat up thousands of dollars yearly. Adjust the slider to see how much time and money you save with TransitOps.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className={cn("flex justify-between text-xs font-bold uppercase tracking-wider transition-colors", isDark ? "text-slate-450" : "text-slate-500")}>
                  <span>Current Fleet Size</span>
                  <span className="text-accent font-mono text-sm">{fleetSize} Vehicles</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="150" 
                  value={fleetSize}
                  onChange={e => setFleetSize(parseInt(e.target.value))}
                  className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-accent", isDark ? "bg-slate-800" : "bg-slate-200")}
                />
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className={cn("p-6 rounded-2xl border text-center transition-colors", isDark ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-150")}>
                <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Est. Annual Savings</p>
                <p className={cn("text-2xl sm:text-3xl font-bold font-mono mt-1", isDark ? "text-white" : "text-slate-900")}>${estimatedSavings.toLocaleString()}</p>
              </div>
              <div className={cn("p-6 rounded-2xl border text-center transition-colors", isDark ? "bg-slate-900 border-slate-850" : "bg-slate-50 border-slate-150")}>
                <Users className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Hours Restored</p>
                <p className={cn("text-2xl sm:text-3xl font-bold font-mono mt-1", isDark ? "text-white" : "text-slate-900")}>{hoursSaved.toLocaleString()} hrs</p>
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
      <footer className={cn("border-t py-12 relative z-10 transition-colors duration-200", isDark ? "border-slate-850 bg-slate-950" : "border-slate-200 bg-white")}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <span className={cn("font-bold font-display", isDark ? "text-white" : "text-slate-900")}>TransitOps</span>
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
  isDark?: boolean;
}

function FeatureCard({ icon: Icon, title, description, isDark }: FeatureCardProps) {
  return (
    <div className={cn(
      "p-8 rounded-3xl border hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col h-full group shadow-md",
      isDark 
        ? "bg-slate-900 hover:bg-slate-950 border-slate-850 hover:border-slate-800" 
        : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-250"
    )}>
      <div className={cn(
        "w-12 h-12 text-accent rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:text-white group-hover:bg-accent",
        isDark ? "bg-slate-950" : "bg-[#f4f6f9]"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className={cn("text-lg font-bold font-display mb-2.5 transition-colors", isDark ? "text-white" : "text-slate-900")}>{title}</h3>
      <p className={cn("text-xs sm:text-sm leading-relaxed font-semibold flex-1 transition-colors", isDark ? "text-slate-450" : "text-slate-500")}>{description}</p>
    </div>
  );
}
