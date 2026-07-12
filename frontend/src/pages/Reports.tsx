import React, { useMemo } from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Printer, BarChart2, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

export function Reports() {
  const { state } = useStore();

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

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Reports Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-cream/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cream rounded-xl text-accent">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-ink leading-none">Reports & Analytics</h2>
            <p className="text-xs text-rust font-medium mt-1">Operational cost analyses, fuel indexes, and ROI auditing</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-ink border border-cream/80 hover:bg-cream-light font-semibold text-xs uppercase tracking-wider shadow-sm rounded-xl transition-colors cursor-pointer flex-1 sm:flex-initial"
          >
            <Printer className="w-4 h-4 text-sage" /> Export PDF
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 shadow-lg shadow-accent/15 font-semibold text-xs uppercase tracking-wider cursor-pointer flex-1 sm:flex-initial"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Costs Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream/50">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-6">Operational Cost per Vehicle ($)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleStats} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold" />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold font-mono" />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="totalOpCost" fill="#6366F1" radius={[0, 6, 6, 0]} name="Total Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Efficiency Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream/50">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wide mb-6">Average Fuel Efficiency (km/L)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleStats} layout="vertical" margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold" />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} fontClassName="font-semibold font-mono" />
                <Tooltip contentStyle={{ background: '#0F172A', color: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.15)' }} />
                <Bar dataKey="fuelEfficiency" fill="#0EA5E9" radius={[0, 6, 6, 0]} name="km / L" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROI Breakdown Registry Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-cream/50 overflow-hidden">
        <div className="p-4 bg-cream-light/60 border-b border-cream/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wide">Vehicle ROI Audit Analysis</h3>
          <span className="text-xs text-rust font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-accent" /> ROI computed based on average revenue ($5/km) vs operational costs
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-light/35 border-b border-cream/60 text-xs font-bold text-rust uppercase tracking-wider">
                <th className="py-4 px-5">Fleet Vehicle</th>
                <th className="py-4 px-5">Acquisition Cost</th>
                <th className="py-4 px-5">Total Op Cost</th>
                <th className="py-4 px-5">Est. Revenue</th>
                <th className="py-4 px-5">Return On Investment (ROI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-light/90 text-sm">
              {vehicleStats.map(stat => (
                <tr key={stat.id} className="hover:bg-cream-light/35 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-semibold text-ink font-mono">{stat.name}</p>
                    <p className="text-xs text-rust font-medium">{stat.model}</p>
                  </td>
                  <td className="py-4 px-5 text-ink font-semibold font-mono">${stat.acquisitionCost.toLocaleString()}</td>
                  <td className="py-4 px-5 text-ink font-medium font-mono">${stat.totalOpCost.toLocaleString()}</td>
                  <td className="py-4 px-5 text-ink font-medium font-mono">${stat.revenue.toLocaleString()}</td>
                  <td className="py-4 px-5">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
                      stat.roi > 0 
                        ? "bg-sage/15 text-ink border-sage/35" 
                        : stat.roi < 0 
                          ? "bg-accent/15 text-accent border-accent/30" 
                          : "bg-cream-light text-ink border-cream/50"
                    )}>
                      {stat.roi > 0 ? '+' : ''}{stat.roi}%
                    </span>
                  </td>
                </tr>
              ))}
              {vehicleStats.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm font-semibold text-rust/80">No data available for analysis.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

