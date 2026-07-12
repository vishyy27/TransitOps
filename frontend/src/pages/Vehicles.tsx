import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, X, Download, Shield } from 'lucide-react';
import { Vehicle } from '../types';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { exportToCSV } from '../lib/export';

export function Vehicles() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const filteredVehicles = state.vehicles.filter(v => 
    v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search registration or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm soft-input font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => exportToCSV(filteredVehicles, 'vehicles')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Datatable Container */}
      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="soft-table-header text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Registration</th>
                <th className="py-4 px-5">Name/Model</th>
                <th className="py-4 px-5">Type</th>
                <th className="py-4 px-5">Load Capacity</th>
                <th className="py-4 px-5">Odometer</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-light/90">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="soft-table-row/35 transition-colors text-sm">
                  <td className="py-4 px-5 font-semibold text-slate-900 font-mono tracking-tight">{vehicle.registrationNumber}</td>
                  <td className="py-4 px-5 text-slate-900 font-medium">{vehicle.name}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white text-slate-500 border border-slate-200/65">
                      {vehicle.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-900 font-semibold font-mono">{vehicle.maxLoadCapacity.toLocaleString()} kg</td>
                  <td className="py-4 px-5 text-slate-900 font-medium font-mono">{vehicle.odometer.toLocaleString()} km</td>
                  <td className="py-4 px-5">
                    <Badge status={vehicle.status} />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button onClick={() => setSelectedVehicleId(vehicle.id)} className="mr-4 text-xs font-bold text-slate-500 hover:text-slate-950 uppercase tracking-wider">Details</button>
                    <button 
                      onClick={() => {
                        if (vehicle.status !== 'Retired') {
                          dispatch({ type: 'RETIRE_VEHICLE', payload: vehicle.id });
                        }
                      }}
                      disabled={vehicle.status === 'Retired' || vehicle.status === 'On Trip'}
                      className="text-xs font-bold text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {vehicle.status === 'Retired' ? 'Retired' : 'Retire'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-500/80">No registered vehicles match the criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddVehicleModal onClose={() => setIsModalOpen(false)} />
      )}
      {selectedVehicleId && <VehicleDrawer vehicleId={selectedVehicleId} onClose={() => setSelectedVehicleId(null)} />}
    </div>
  );
}

function VehicleDrawer({ vehicleId, onClose }: { vehicleId: string; onClose: () => void }) {
  const { state } = useStore();
  const vehicle = state.vehicles.find(item => item.id === vehicleId);
  if (!vehicle) return null;
  const relatedTrips = state.trips.filter(trip => trip.vehicleId === vehicleId);
  const maintenanceCost = state.maintenanceRecords.filter(record => record.vehicleId === vehicleId).reduce((sum, record) => sum + record.cost, 0);
  const fuelCost = state.fuelLogs.filter(log => log.vehicleId === vehicleId).reduce((sum, log) => sum + log.cost, 0);
  return <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" onClick={onClose}><aside onClick={event => event.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Fleet asset</p><h2 className="mt-1 font-display text-2xl font-bold text-slate-900">{vehicle.registrationNumber}</h2><p className="text-sm text-slate-500">{vehicle.name}</p></div><button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="w-5 h-5" /></button></div><div className="mt-5"><Badge status={vehicle.status} /></div><div className="mt-7 grid grid-cols-2 gap-3"><Metric label="Capacity" value={`${vehicle.maxLoadCapacity.toLocaleString()} kg`} /><Metric label="Odometer" value={`${vehicle.odometer.toLocaleString()} km`} /><Metric label="Fuel cost" value={`$${fuelCost.toLocaleString()}`} /><Metric label="Maintenance" value={`$${maintenanceCost.toLocaleString()}`} /></div><section className="mt-8"><h3 className="font-display font-bold text-slate-900">Operational timeline</h3><div className="mt-4 space-y-3">{relatedTrips.length ? relatedTrips.map(trip => <div key={trip.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex justify-between gap-3"><p className="text-sm font-bold text-slate-900">{trip.source} → {trip.destination}</p><Badge status={trip.status} /></div><p className="mt-1 text-xs text-slate-500">{trip.plannedDistance} km · {trip.cargoWeight} kg cargo</p></div>) : <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">No trips have been recorded for this vehicle yet.</p>}</div></section></aside></div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-bold text-slate-900">{value}</p></div>; }

function AddVehicleModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    registrationNumber: '',
    name: '',
    type: 'Van',
    maxLoadCapacity: 500,
    odometer: 0,
    acquisitionCost: 0,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rule 1: Registration number must be unique
    const isDuplicate = state.vehicles.some(
      v => v.registrationNumber.toLowerCase().trim() === formData.registrationNumber.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError('Registration number is already registered in the system.');
      return;
    }

    dispatch({
      type: 'ADD_VEHICLE',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        registrationNumber: formData.registrationNumber.toUpperCase().trim(),
        status: 'Available',
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-md backdrop-blur-[20px] bg-white/60 overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Register Vehicle</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Registration Number</label>
              <input required type="text" placeholder="e.g. VAN-05" value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Name / Model</label>
              <input required type="text" placeholder="e.g. Ford Transit Cargo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Vehicle Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
                <option>Van</option>
                <option>Truck</option>
                <option>Car</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Max Load Capacity (kg)</label>
              <input required type="number" min="1" value={formData.maxLoadCapacity} onChange={e => setFormData({...formData, maxLoadCapacity: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Odometer Reading (km)</label>
              <input required type="number" min="0" value={formData.odometer} onChange={e => setFormData({...formData, odometer: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Acquisition Cost ($)</label>
              <input required type="number" min="1" value={formData.acquisitionCost} onChange={e => setFormData({...formData, acquisitionCost: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Registry</button>
          </div>
        </form>
      </div>
    </div>
  );
}
