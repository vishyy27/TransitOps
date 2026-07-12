import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, AlertTriangle, X, Download, UserCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { exportToCSV } from '../lib/export';

export function Drivers() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDrivers = state.drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.licenseNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-cream/50">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sage" />
          <input 
            type="text"
            placeholder="Search name or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-cream-light/30 text-ink font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => exportToCSV(filteredDrivers, 'drivers')}
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
            Add Driver
          </button>
        </div>
      </div>

      {/* Datatable Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-cream/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-light/75 border-b border-cream/60 text-xs font-bold text-rust uppercase tracking-wider">
                <th className="py-4 px-5">Driver Name</th>
                <th className="py-4 px-5">License Number</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">License Status</th>
                <th className="py-4 px-5">Safety Score</th>
                <th className="py-4 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-light/90">
              {filteredDrivers.map((driver) => {
                const isExpired = new Date(driver.licenseExpiryDate) < new Date();
                
                // Color scale for safety scores
                let safetyColor = "text-sage bg-sage/10 border-sage/20";
                if (driver.safetyScore < 75) safetyColor = "text-accent bg-accent/10 border-accent/20";
                else if (driver.safetyScore < 90) safetyColor = "text-rust bg-rust/10 border-rust/20";

                return (
                  <tr key={driver.id} className="hover:bg-cream-light/35 transition-colors text-sm">
                    <td className="py-4 px-5 font-semibold text-ink">{driver.name}</td>
                    <td className="py-4 px-5 text-ink font-medium font-mono">{driver.licenseNumber}</td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-cream text-rust border border-cream/65">
                        {driver.licenseCategory}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" /> Expired
                          </span>
                        ) : (
                          <span className="text-ink font-medium font-mono">
                            {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono", safetyColor)}>
                        {driver.safetyScore} pts
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <Badge status={driver.status} />
                    </td>
                  </tr>
                );
              })}
              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm font-semibold text-rust/80">No registered drivers match the search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddDriverModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

function AddDriverModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: 'C',
    licenseExpiryDate: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isDuplicate = state.drivers.some(
      d => d.licenseNumber.toLowerCase().trim() === formData.licenseNumber.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError('License number is already registered in the system.');
      return;
    }

    dispatch({
      type: 'ADD_DRIVER',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        name: formData.name.trim(),
        licenseNumber: formData.licenseNumber.toUpperCase().trim(),
        safetyScore: 100, // default new driver score
        status: 'Available',
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-cream">
        <div className="flex justify-between items-center p-5 border-b border-cream/50 bg-cream-light/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cream rounded-lg text-accent">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-ink">Register Driver</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg text-rust transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Full Name</label>
            <input required type="text" placeholder="e.g. Alex Mercer" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">License Number</label>
            <input required type="text" placeholder="e.g. DL-9834720" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">License Category</label>
              <select value={formData.licenseCategory} onChange={e => setFormData({...formData, licenseCategory: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer">
                <option>B</option>
                <option>C</option>
                <option>C+E</option>
                <option>D</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Expiry Date</label>
              <input required type="date" value={formData.licenseExpiryDate} onChange={e => setFormData({...formData, licenseExpiryDate: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Contact Number</label>
            <input required type="tel" placeholder="e.g. +1 (555) 019-2834" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
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

