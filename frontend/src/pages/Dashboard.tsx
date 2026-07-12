import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Truck, Map, Users, Wrench, Filter, Activity, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { motion } from 'motion/react';

const COLORS = ['#6366F1', '#0EA5E9', '#F43F5E', '#10B981'];

export function Dashboard() {
  const { state } = useStore();
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredVehicles = state.vehicles.filter(v => {
    if (filterType !== 'All' && v.type !== filterType) return false;
    if (filterStatus !== 'All' && v.status !== filterStatus) return false;
    return true;
  });

  const activeVehicles = filteredVehicles.filter(v => v.status === 'On Trip').length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'Available').length;
  const maintenanceVehicles = filteredVehicles.filter(v => v.status === 'In Shop').length;
  const totalVehicles = filteredVehicles.filter(v => v.status !== 'Retired').length;
  const fleetUtilization = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

  const activeTrips = state.trips.filter(t => t.status === 'Dispatched').length;
  const pendingTrips = state.trips.filter(t => t.status === 'Draft').length;
  const completedTrips = state.trips.filter(t => t.status === 'Completed').length;
  
  const driversOnDuty = state.drivers.filter(d => d.status === 'On Trip').length;

  const tripStats = [
    { name: 'Dispatched', value: activeTrips },
    { name: 'Draft', value: pendingTrips },
    { name: 'Completed', value: completedTrips },
    { name: 'Cancelled', value: state.trips.filter(t => t.status === 'Cancelled').length },
  ].filter(s => s.value > 0);

  // Mock utilization data for chart with cleaner trend curve
  const utilizationData = [
    { day: 'Mon', utilization: 65 },
    { day: 'Tue', utilization: 72 },
    { day: 'Wed', utilization: 68 },
    { day: 'Thu', utilization: 84 },
    { day: 'Fri', utilization: fleetUtilization || 78 },
    { day: 'Sat', utilization: Math.max(20, (fleetUtilization || 78) - 15) },
    { day: 'Sun', utilization: Math.max(10, (fleetUtilization || 78) - 30) },
  ];

  const statCards = [
    { title: 'Available Vehicles', value: availableVehicles, icon: Truck, color: 'text-slate-400', bg: 'bg-sage/10 border-sage/20', trend: 'Fleet ready' },
    { title: 'Active Trips', value: activeTrips, icon: Map, color: 'text-accent', bg: 'bg-accent/10 border-accent/20', trend: `${pendingTrips} pending draft` },
    { title: 'In Maintenance', value: maintenanceVehicles, icon: Wrench, color: 'text-slate-500', bg: 'bg-rust/10 border-rust/20', trend: 'Requires attention' },
    { title: 'Drivers On Duty', value: driversOnDuty, icon: Users, color: 'text-slate-900', bg: 'bg-ink/5 border-ink/20', trend: 'Active shifts' },
  ];

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Top Filter Bar */}
      <div className="soft-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 text-slate-900 font-semibold font-display">
          <div className="p-2 bg-white rounded-full">
            <Filter className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight">Dashboard Overview</h2>
            <p className="text-xs text-slate-500 font-medium">Real-time logistics analytics & metrics</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)} 
            className="px-3.5 py-2 bg-transparent border border-slate-200/85 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent text-slate-900 cursor-pointer flex-1 sm:flex-initial"
          >
            <option value="All">All Types</option>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
            <option value="Car">Car</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)} 
            className="px-3.5 py-2 bg-transparent border border-slate-200/85 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent text-slate-900 cursor-pointer flex-1 sm:flex-initial"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="soft-card p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-extrabold font-mono text-slate-900 mt-2 leading-none">{stat.value}</p>
              </div>
              <div className={cn("p-3 rounded-full border transition-all group-hover:scale-105", stat.bg, stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/5/85 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
        
        {/* Fleet Utilization Progress Banner */}
        <div className="soft-card p-6 col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fleet Utilization Index</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-extrabold font-mono text-slate-900">{fleetUtilization}%</p>
              <p className="text-xs text-slate-400 font-semibold">capacity in active rotation</p>
            </div>
          </div>
          <div className="flex-1 max-w-md w-full">
            <div className="w-full h-3.5 bg-transparent rounded-full overflow-hidden relative shadow-inner border border-slate-200/60">
              <div 
                className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 rounded-full" 
                style={{ width: `${fleetUtilization}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-500 font-semibold">
              <span>0% (Idle)</span>
              <span>100% (Maximum Load)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="soft-card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 leading-none">Utilization Curve</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Weekly active fleet load trend</p>
            </div>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-72 flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="utilizationColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold" />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} fontClassName="font-semibold" />
                <Tooltip 
                  contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="utilization" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#utilizationColor)" dot={{ r: 4, strokeWidth: 2, stroke: '#6366F1', fill: '#FFF' }} name="Utilization" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="soft-card p-6 flex flex-col">
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 leading-none">Active Trips Status</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Trip cycle stage distribution</p>
          </div>
          <div className="h-72 flex-1 flex flex-col items-center justify-center min-h-[280px]">
            {tripStats.length > 0 ? (
              <div className="relative w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tripStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {tripStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-3xl font-extrabold font-mono text-slate-900 leading-none">{state.trips.length}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Total Trips</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-slate-500 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-slate-400" />
                <p>No trips recorded in this cycle.</p>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-3.5 mt-2">
              {tripStats.map((stat, i) => (
                <div key={stat.name} className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-900/80">{stat.name} ({stat.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Simulation Map Section */}
      <FleetSimulationMap />


      {/* Activity Logs Timeline */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-accent" />
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 leading-none">System Activity Feed</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Live updates from transit coordinators</p>
          </div>
        </div>
        <div className="relative pl-6 border-l-2 border-slate-200/70 space-y-6">
          {state.activityLogs.slice(0, 5).map(log => (
            <div key={log.id} className="relative group">
              {/* Timeline marker */}
              <span className={cn(
                "absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-200 shadow-sm transition-all duration-300 group-hover:scale-110",
                log.type === 'Trip' ? "bg-accent" : log.type === 'Maintenance' ? "bg-rust" : "bg-ink"
              )} />
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">{log.message}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{format(new Date(log.date), 'MMM d, yyyy • h:mm a')}</p>
              </div>
            </div>
          ))}
          {state.activityLogs.length === 0 && (
            <div className="text-center py-6 text-sm text-slate-500 font-medium pl-0">
              No recent logs available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CITY_COORDS: Record<string, { x: number; y: number }> = {
  'New York': { x: 700, y: 100 },
  'Chicago': { x: 530, y: 130 },
  'Los Angeles': { x: 120, y: 260 },
  'Houston': { x: 420, y: 340 },
  'Miami': { x: 710, y: 350 },
  'Atlanta': { x: 610, y: 230 },
  'Dallas': { x: 380, y: 280 },
  'Seattle': { x: 100, y: 60 },
  'Denver': { x: 320, y: 180 },
};

function FleetSimulationMap() {
  const { state } = useStore();
  const [simulate, setSimulate] = useState(true);

  // Collect actual dispatched trips
  const activeTrips = state.trips.filter(t => t.status === 'Dispatched');

  // Simulated active trips for demo purposes if database has no dispatched trips or if simulation is enabled
  const demoTrips = [
    { id: 'sim-1', source: 'Seattle', destination: 'Denver', vehicle: 'Van-90', driver: 'Alex Rivera', distance: 1300 },
    { id: 'sim-2', source: 'Dallas', destination: 'Atlanta', vehicle: 'Truck-04', driver: 'Marcus Miller', distance: 780 },
    { id: 'sim-3', source: 'Chicago', destination: 'New York', vehicle: 'Truck-12', driver: 'Sarah Connor', distance: 800 },
    { id: 'sim-4', source: 'Los Angeles', destination: 'Houston', vehicle: 'Car-19', driver: 'David Kim', distance: 1550 },
  ];

  const currentTrips = (activeTrips.length > 0 && !simulate) 
    ? activeTrips.map(t => ({
        id: t.id,
        source: t.source,
        destination: t.destination,
        vehicle: state.vehicles.find(v => v.id === t.vehicleId)?.registrationNumber || 'Vehicle',
        driver: state.drivers.find(d => d.id === t.driverId)?.name || 'Driver',
        distance: t.plannedDistance || 500,
      }))
    : demoTrips;

  return (
    <div className="soft-card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold font-display text-slate-900 leading-none">Live Dispatch Control Map</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Geographic routes tracking active transit runs</p>
        </div>
        <div className="flex items-center gap-2 bg-transparent p-1 rounded-3xl border border-slate-200 text-xs font-semibold text-slate-900">
          <span className="pl-2">Demo Simulation:</span>
          <button 
            onClick={() => setSimulate(!simulate)}
            className={cn(
              "px-2.5 py-1 rounded-md transition-all cursor-pointer font-bold",
              simulate ? "bg-accent text-slate-900" : "bg-white text-slate-500"
            )}
          >
            {simulate ? 'Active' : 'Disabled'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Route Visualization map */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-full relative overflow-hidden h-[380px] flex items-center justify-center">
          <svg className="w-full h-full max-h-[380px]" viewBox="0 0 800 400" fill="none">
            {/* Grid Pattern Background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Render Connection Lines / Paths */}
            {currentTrips.map((trip) => {
              const start = CITY_COORDS[trip.source];
              const end = CITY_COORDS[trip.destination];
              if (!start || !end) return null;
              return (
                <g key={`route-${trip.id}`}>
                  {/* Static Route Path */}
                  <line 
                    x1={start.x} 
                    y1={start.y} 
                    x2={end.x} 
                    y2={end.y} 
                    stroke="#cbd5e1" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                  {/* Glowing Animated Dash Route Line */}
                  <line 
                    x1={start.x} 
                    y1={start.y} 
                    x2={end.x} 
                    y2={end.y} 
                    stroke="#000000" 
                    strokeWidth="2" 
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </g>
              );
            })}

            {/* City Hub Nodes */}
            {Object.entries(CITY_COORDS).map(([name, pos]) => (
              <g key={name} className="group cursor-pointer">
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r={5} 
                  fill="#64748b" 
                  className="transition-all duration-300 group-hover:fill-accent group-hover:r-7" 
                />
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r={10} 
                  stroke="#94a3b8" 
                  strokeWidth="1.5"
                  className="opacity-0 group-hover:opacity-40 transition-opacity" 
                />
                <text 
                  x={pos.x} 
                  y={pos.y - 12} 
                  textAnchor="middle" 
                  fill="#64748b" 
                  className="text-[10px] font-bold tracking-tight select-none pointer-events-none font-mono"
                >
                  {name}
                </text>
              </g>
            ))}

            {/* Animated Active Vehicles on Map */}
            {currentTrips.map((trip) => {
              const start = CITY_COORDS[trip.source];
              const end = CITY_COORDS[trip.destination];
              if (!start || !end) return null;

              // Calculate transition speed based on distance
              const duration = Math.max(8, trip.distance / 120);

              return (
                <g key={`marker-${trip.id}`}>
                  {/* Outer pulsing indicator */}
                  <motion.circle
                    r={12}
                    fill="#000000"
                    className="opacity-25"
                    animate={{
                      cx: [start.x, end.x],
                      cy: [start.y, end.y],
                      scale: [1, 1.4, 1]
                    }}
                    transition={{
                      cx: { duration, repeat: Infinity, ease: "linear" },
                      cy: { duration, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity }
                    }}
                  />
                  {/* Core Vehicle Dot */}
                  <motion.circle
                    r={6}
                    fill="#000000"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                    animate={{
                      cx: [start.x, end.x],
                      cy: [start.y, end.y]
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dispatch Tracker Sidebar panel */}
        <div className="border border-slate-200 rounded-full bg-white p-4 space-y-4 max-h-[380px] overflow-y-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Dispatches</p>
          <div className="space-y-3">
            {currentTrips.map(trip => (
              <div key={trip.id} className="p-3 bg-white border border-slate-200 rounded-full space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="font-mono">{trip.vehicle}</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    En Route
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span>{trip.source}</span>
                  <span className="text-[10px] text-slate-500 font-normal">➔</span>
                  <span>{trip.destination}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Assigned: {trip.driver}</p>
              </div>
            ))}
            {currentTrips.length === 0 && (
              <p className="text-center py-6 text-xs font-medium text-slate-500/80">No active dispatches currently tracked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


