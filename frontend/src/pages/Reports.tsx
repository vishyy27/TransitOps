import { useEffect } from 'react';
import { api } from '../lib/api';
import React, { useMemo } from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Printer, BarChart2, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

export function Reports() {
  const { state, dispatch } = useStore();
  useEffect(() => { api.get('/vehicles?limit=100').then(res => dispatch({ type: 'SET_VEHICLES', payload: res.data || [] })).catch(console.error); api.get('/trips?limit=100').then(res => dispatch({ type: 'SET_TRIPS', payload: res.data || [] })).catch(console.error); api.get('/fuel-logs?limit=100').then(res => dispatch({ type: 'SET_FUEL_LOGS', payload: res.data || [] })).catch(console.error); api.get('/expenses?limit=100').then(res => dispatch({ type: 'SET_EXPENSES', payload: res.data || [] })).catch(console.error); }, [dispatch]);

  const vehicleStats = useMemo(() => {
    return state.vehicles.map(v => {
      // Calculate costs
      const maintenanceCost = state.maintenanceRecords.filter(m => m.vehicleId === v.id).reduce((sum, m) => sum + m.cost, 0);
      const fuelCost = state.fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.cost, 0);
      const expensesCost = state.expenses.filter(e => e.vehicleId === v.id).reduce((sum, e) => sum + e.amount, 0);
      const totalOpCost = maintenanceCost + fuelCost + expensesCost;

      // Fuel efficiency (km/L)
      const completedTrips = state.trips.filter(t => t.vehicleId === v.id && t.status === 'Completed');
      const totalDistance = completedTrips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0); 
      const totalFuelLiters = state.fuelLogs.filter(f => f.vehicleId === v.id).reduce((sum, f) => sum + f.liters, 0);
      const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters).toFixed(2) : 0;

      // Mock Revenue calculation (e.g. $5 per km)
      const revenue = totalDistance * 5;
      
      // ROI = (Revenue - Total Op Cost) / Acquisition Cost
      const roi = v.acquisitionCost > 0 ? ((revenue - totalOpCost) / v.acquisitionCost) * 100 : 0;

      return {
        id: v.id,
        name: v.registrationNumber,
        model: v.name,
        totalOpCost,
        maintenanceCost,
        fuelCost,
        fuelEfficiency: Number(fuelEfficiency),
        revenue,
        acquisitionCost: v.acquisitionCost,
        roi: Number(roi.toFixed(2))
      };
    });
  }, [state]);

  const handleExportCSV = () => {
    const headers = ['Registration', 'Model', 'Total Op Cost', 'Fuel Efficiency (km/L)', 'Revenue', 'ROI (%)'];
    const csvContent = [
      headers.join(','),
      ...vehicleStats.map(s => 
        `"${s.name}","${s.model}",${s.totalOpCost},${s.fuelEfficiency},${s.revenue},${s.roi}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transitops_vehicle_roi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDark = state.workspacePreferences.darkMode;
  const barColor1 = isDark ? '#818cf8' : '#000000';
  const barColor2 = isDark ? '#34d399' : '#64748b';
  const axisColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';

  return (
    <div className="space-y-6 selection:bg-black/20">
      {/* Reports Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-full text-black">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900 leading-none">Reports & Analytics</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Operational cost analyses, fuel indexes, and ROI auditing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" /> Print
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider cursor-pointer flex-1 sm:flex-initial"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Costs Chart */}
        <div className="soft-card p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6">Operational Cost per Vehicle ($)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleStats} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold" />
                <YAxis dataKey="name" type="category" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold font-mono" />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="totalOpCost" fill={barColor1} radius={[0, 6, 6, 0]} name="Total Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Efficiency Chart */}
        <div className="soft-card p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6">Average Fuel Efficiency (km/L)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleStats} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold" />
                <YAxis dataKey="name" type="category" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold font-mono" />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="fuelEfficiency" fill={barColor2} radius={[0, 6, 6, 0]} name="km / L" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROI Breakdown Registry Table */}
      <div className="soft-card overflow-hidden">
        <div className="p-4 bg-transparent/60 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Vehicle ROI Audit Analysis</h3>
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-black" /> ROI computed based on average revenue ($5/km) vs operational costs
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-transparent/35 border-b border-slate-200/60 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Fleet Vehicle</th>
                <th className="py-4 px-5">Acquisition Cost</th>
                <th className="py-4 px-5">Total Op Cost</th>
                <th className="py-4 px-5">Est. Revenue</th>
                <th className="py-4 px-5">Return On Investment (ROI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-light/90 text-sm">
              {vehicleStats.map(stat => (
                <tr key={stat.id} className="soft-table-row/35 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-semibold text-slate-900 font-mono">{stat.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{stat.model}</p>
                  </td>
                  <td className="py-4 px-5 text-slate-900 font-semibold font-mono">${stat.acquisitionCost.toLocaleString()}</td>
                  <td className="py-4 px-5 text-slate-900 font-medium font-mono">${stat.totalOpCost.toLocaleString()}</td>
                  <td className="py-4 px-5 text-slate-900 font-medium font-mono">${stat.revenue.toLocaleString()}</td>
                  <td className="py-4 px-5">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
                      stat.roi > 0 
                        ? "bg-slate-50 text-slate-900 border-sage/35" 
                        : stat.roi < 0 
                          ? "bg-black/15 text-black border-black/30" 
                          : "bg-transparent text-slate-900 border-slate-200"
                    )}>
                      {stat.roi > 0 ? '+' : ''}{stat.roi}%
                    </span>
                  </td>
                </tr>
              ))}
              {vehicleStats.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm font-semibold text-slate-500/80">No data available for analysis.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



