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

  const filteredVehicles = state.vehicles.filter(v => 
    v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-cream/50">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sage" />
          <input 
            type="text"
            placeholder="Search registration or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-cream-light/30 text-ink font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => exportToCSV(filteredVehicles, 'vehicles')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-ink border border-cream/80 rounded-xl hover:bg-cream-light transition-colors shadow-sm font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer"
          >
            <Download className="w-4 h-4 text-sage" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/15 font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Datatable Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-cream/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-light/75 border-b border-cream/60 text-xs font-bold text-rust uppercase tracking-wider">
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
                <tr key={vehicle.id} className="hover:bg-cream-light/35 transition-colors text-sm">
                  <td className="py-4 px-5 font-semibold text-ink font-mono tracking-tight">{vehicle.registrationNumber}</td>
                  <td className="py-4 px-5 text-ink font-medium">{vehicle.name}</td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-cream text-rust border border-cream/65">
                      {vehicle.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-ink font-semibold font-mono">{vehicle.maxLoadCapacity.toLocaleString()} kg</td>
                  <td className="py-4 px-5 text-ink font-medium font-mono">{vehicle.odometer.toLocaleString()} km</td>
                  <td className="py-4 px-5">
                    <Badge status={vehicle.status} />
                  </td>
                  <td className="py-4 px-5 text-right">
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
                  <td colSpan={7} className="py-10 text-center text-sm font-semibold text-rust/80">No registered vehicles match the criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddVehicleModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

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
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-cream">
        <div className="flex justify-between items-center p-5 border-b border-cream/50 bg-cream-light/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cream rounded-lg text-accent">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-ink">Register Vehicle</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg text-rust transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Registration Number</label>
              <input required type="text" placeholder="e.g. VAN-05" value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Name / Model</label>
              <input required type="text" placeholder="e.g. Ford Transit Cargo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Vehicle Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer">
                <option>Van</option>
                <option>Truck</option>
                <option>Car</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Max Load Capacity (kg)</label>
              <input required type="number" min="1" value={formData.maxLoadCapacity} onChange={e => setFormData({...formData, maxLoadCapacity: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Odometer Reading (km)</label>
              <input required type="number" min="0" value={formData.odometer} onChange={e => setFormData({...formData, odometer: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Acquisition Cost ($)</label>
              <input required type="number" min="1" value={formData.acquisitionCost} onChange={e => setFormData({...formData, acquisitionCost: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-cream-light">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-rust hover:bg-cream-light rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Registry</button>
          </div>
        </form>
      </div>
    </div>
  );
}

