import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, X, Check, Search, Download, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../components/Badge';
import { exportToCSV } from '../lib/export';

export function Maintenance() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define filteredRecords to fix the crash and add a search functionality
  const filteredRecords = state.maintenanceRecords.filter(record => {
    const vehicle = state.vehicles.find(v => v.id === record.vehicleId);
    return (
      record.type.toLowerCase().includes(search.toLowerCase()) ||
      record.description.toLowerCase().includes(search.toLowerCase()) ||
      (vehicle && vehicle.registrationNumber.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search vehicle, type, or desc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm soft-input font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => exportToCSV(filteredRecords, 'maintenance_records')}
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
            New Record
          </button>
        </div>
      </div>

      {/* Datatable Container */}
      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="soft-table-header text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Logged Date</th>
                <th className="py-4 px-5">Fleet Vehicle</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Work Description</th>
                <th className="py-4 px-5">Est. Cost</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-light/90 text-sm">
              {filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => {
                const vehicle = state.vehicles.find(v => v.id === record.vehicleId);
                return (
                  <tr key={record.id} className="soft-table-row/35 transition-colors">
                    <td className="py-4 px-5 whitespace-nowrap text-slate-900 font-medium">{format(new Date(record.date), 'MMM d, yyyy')}</td>
                    <td className="py-4 px-5 font-semibold text-slate-900 font-mono">{vehicle?.registrationNumber || 'Unknown'}</td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-white text-slate-500 border border-slate-200/65">
                        {record.type}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-900/90 max-w-xs truncate font-medium">{record.description}</td>
                    <td className="py-4 px-5 font-semibold text-slate-900 font-mono">${record.cost.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <Badge status={record.status} />
                    </td>
                    <td className="py-4 px-5 text-right">
                      {record.status === 'Active' && (
                        <button 
                          onClick={() => dispatch({ type: 'CLOSE_MAINTENANCE', payload: record.id })}
                          className="text-xs font-bold text-teal-600 hover:text-teal-800 uppercase tracking-wider flex items-center justify-end gap-1 ml-auto cursor-pointer"
                        >
                          <Check className="w-4 h-4 shrink-0" /> Close Log
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-500/80">No maintenance logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateMaintenanceModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function CreateMaintenanceModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'Oil Change',
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
  });

  // Only allow maintenance on vehicles that aren't retired or on trip
  const availableVehicles = state.vehicles.filter(v => v.status !== 'Retired' && v.status !== 'On Trip');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({
      type: 'CREATE_MAINTENANCE',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'Active',
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <Wrench className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">New Maintenance Log</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Select Fleet Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
              <option value="" disabled>Select vehicle</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Service Type</label>
              <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
                <option>Oil Change</option>
                <option>Tire Replacement</option>
                <option>Inspection</option>
                <option>Engine Repair</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Logged Date</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Service Details & Notes</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium placeholder-sage/60" placeholder="Describe the repairs, issues, or details..."></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Estimated Cost ($)</label>
            <input required type="number" min="0" step="0.01" value={formData.cost} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-slate-900 rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Log</button>
          </div>
        </form>
      </div>
    </div>
  );
}

