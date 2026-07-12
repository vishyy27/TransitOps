import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useStore } from '../store';
import { Plus, Search, AlertTriangle, X, Download, UserCheck, Edit } from 'lucide-react';
import { Driver } from '../types';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { exportToCSV } from '../lib/export';
import { toast } from 'react-hot-toast';

export function Drivers() {
  const { state, dispatch } = useStore();
  React.useEffect(() => { api.get('/drivers?limit=100').then(res => { const mapped = (res.data || []).map((d: any) => ({...d, licenseNumber: d.license_number, licenseCategory: d.license_category, licenseExpiryDate: d.license_expiry_date, contactNumber: d.contact_number, safetyScore: d.safety_score})); dispatch({ type: 'SET_DRIVERS', payload: mapped }); }).catch(console.error); }, [dispatch]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };
  
  const toggleAll = () => {
    if (selectedRows.length === filteredDrivers.length && filteredDrivers.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredDrivers.map(d => d.id));
    }
  };

  const handleBatchStatus = (status: string) => {
    selectedRows.forEach(id => {
      const driver = state.drivers.find(d => d.id === id);
      if (driver) {
        dispatch({ type: 'UPDATE_DRIVER', payload: { ...driver, status } });
      }
    });
    setSelectedRows([]);
  };

  const handleBatchExport = () => {
    const toExport = state.drivers.filter(d => selectedRows.includes(d.id));
    exportToCSV(toExport, 'drivers_export');
  };


  const filteredDrivers = state.drivers
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                            d.licenseNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || d.licenseCategory === filterCategory;
      const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const valA = a[sortBy as keyof typeof a];
      const valB = b[sortBy as keyof typeof b];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5 relative">
        {selectedRows.length > 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-slate-900 z-10 rounded-2xl flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold text-sm">{selectedRows.length} selected</span>
              <div className="h-4 w-px bg-slate-700"></div>
              <button onClick={() => handleBatchStatus('Available')} className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Set Available</button>
              <button onClick={() => handleBatchStatus('On Leave')} className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Set On Leave</button>
              <button onClick={() => handleBatchStatus('Off Duty')} className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Set Off Duty</button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleBatchExport} className="text-xs flex items-center gap-1.5 font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors"><Download className="w-4 h-4"/> Export CSV</button>
              <button onClick={() => setSelectedRows([])} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1 max-w-3xl">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search name or license..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm soft-input font-medium"
            />
          </div>

          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)} 
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <option value="All">All Categories</option>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
            <option value="D">Class D</option>
            <option value="E">Class E</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <option value="name">Sort: Name</option>
            <option value="licenseExpiryDate">Sort: Expiry Date</option>
            <option value="safetyScore">Sort: Safety Score</option>
          </select>

          <button 
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            className="p-1.5 border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 bg-white cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 transition-colors"
            title="Toggle Sort Order"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => exportToCSV(filteredDrivers, 'drivers')}
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
            Add Driver
          </button>
        </div>
      </div>

      {/* Datatable Container */}
      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="soft-table-header text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-accent focus:ring-accent w-4 h-4 cursor-pointer" 
                    checked={selectedRows.length === filteredDrivers.length && filteredDrivers.length > 0} 
                    onChange={toggleAll} 
                  />
                </th>
                <th className="py-4 px-5">Driver Name</th>
                <th className="py-4 px-5">License Number</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">License Status</th>
                <th className="py-4 px-5">Safety Score</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-light/90">
              {filteredDrivers.map((driver) => {
                const isExpired = new Date(driver.licenseExpiryDate) < new Date();
                
                // Color scale for safety scores
                let safetyColor = "text-slate-400 bg-sage/10 border-sage/20";
                if (driver.safetyScore < 75) safetyColor = "text-accent bg-accent/10 border-accent/20";
                else if (driver.safetyScore < 90) safetyColor = "text-slate-500 bg-rust/10 border-rust/20";

                return (
                  <tr key={driver.id} className="soft-table-row/35 transition-colors text-sm">
                    <td className="py-4 px-5">
                      <input type="checkbox" className="rounded border-slate-300 text-accent focus:ring-accent w-4 h-4 cursor-pointer" 
                        checked={selectedRows.includes(driver.id)} 
                        onChange={() => toggleRow(driver.id)} 
                      />
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-900">{driver.name}</td>
                    <td className="py-4 px-5 text-slate-900 font-medium font-mono">{driver.licenseNumber}</td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-white text-slate-500 border border-slate-200/65">
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
                          <span className="text-slate-900 font-medium font-mono">
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
                    <td className="py-4 px-5 text-right flex justify-end gap-2">
                      <button onClick={() => setSelectedDriverId(driver.id)} className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950">Details</button>
                      <button onClick={() => { setEditingDriver(driver); setIsEditModalOpen(true); }} className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent/80">Edit</button>
                    </td>
                  </tr>
                );
              })}
              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-500/80">No registered drivers match the search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddDriverModal onClose={() => setIsModalOpen(false)} />
      )}
      {isEditModalOpen && editingDriver && (
        <EditDriverModal driver={editingDriver} onClose={() => { setEditingDriver(null); setIsEditModalOpen(false); }} />
      )}
      {selectedDriverId && <DriverDrawer driverId={selectedDriverId} onClose={() => setSelectedDriverId(null)} />}
    </div>
  );
}

function EditDriverModal({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: driver.name,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiryDate: driver.licenseExpiryDate,
    contactNumber: driver.contactNumber,
    status: driver.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_DRIVER',
      payload: {
        id: driver.id,
        ...formData,
        licenseNumber: formData.licenseNumber.toUpperCase().trim(),
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
              <Edit className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Edit Driver</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">License Number</label>
              <input required type="text" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">License Category</label>
                <select value={formData.licenseCategory} onChange={e => setFormData({ ...formData, licenseCategory: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                  <option>B</option>
                  <option>C</option>
                  <option>C+E</option>
                  <option>D</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Expiry Date</label>
                <input required type="date" value={formData.licenseExpiryDate} onChange={e => setFormData({ ...formData, licenseExpiryDate: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Contact Number</label>
              <input required type="tel" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Driver['status'] })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DriverDrawer({ driverId, onClose }: { driverId: string; onClose: () => void }) {
  const { state } = useStore();
  const driver = state.drivers.find(item => item.id === driverId);
  if (!driver) return null;
  const trips = state.trips.filter(trip => trip.driverId === driverId);
  const expired = new Date(driver.licenseExpiryDate) < new Date();
  const isDark = state.workspacePreferences.darkMode;

  return <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" onClick={onClose}><aside onClick={event => event.stopPropagation()} className={cn("absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl sm:p-8 border-l transition-colors duration-200", isDark ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-900 border-slate-100")}><div className="flex justify-between"><div><p className={cn("text-xs font-bold uppercase tracking-[0.16em]", isDark ? "text-slate-500" : "text-slate-400")}>Driver profile</p><h2 className={cn("mt-1 font-display text-2xl font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{driver.name}</h2><p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{driver.contactNumber}</p></div><button onClick={onClose} className={cn("rounded-full p-2 transition-colors cursor-pointer", isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")}><X className="w-5 h-5" /></button></div><div className="mt-5 flex gap-2 items-center"><Badge status={driver.status} /><span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', expired ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-450' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450')}>{expired ? 'License expired' : 'License valid'}</span>{expired && <button onClick={() => toast.success(`License renewal email reminder dispatched to ${driver.name} successfully!`)} className="ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-850 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 px-3 py-1 rounded-full cursor-pointer transition-colors">Send Email Alert</button>}</div><div className="mt-7 grid grid-cols-2 gap-3"><div className={cn("rounded-2xl p-4 transition-colors", isDark ? "bg-slate-800" : "bg-slate-50")}><p className={cn("text-[10px] font-bold uppercase", isDark ? "text-slate-500" : "text-slate-400")}>Safety score</p><p className={cn("mt-1 font-mono text-xl font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{driver.safetyScore}</p></div><div className={cn("rounded-2xl p-4 transition-colors", isDark ? "bg-slate-800" : "bg-slate-50")}><p className={cn("text-[10px] font-bold uppercase", isDark ? "text-slate-500" : "text-slate-400")}>License</p><p className={cn("mt-1 text-sm font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{driver.licenseCategory} · {driver.licenseNumber}</p><p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>Expires {new Date(driver.licenseExpiryDate).toLocaleDateString()}</p></div></div><section className="mt-8"><h3 className={cn("font-display font-bold", isDark ? "text-slate-100" : "text-slate-900")}>Trip history</h3><div className="mt-4 space-y-3">{trips.length ? trips.map(trip => <div key={trip.id} className={cn("rounded-2xl border p-4 transition-colors", isDark ? "border-slate-800 bg-slate-800/40" : "border-slate-100 bg-slate-50")}><div className="flex justify-between gap-2"><p className={cn("text-sm font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{trip.source} → {trip.destination}</p><Badge status={trip.status} /></div><p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>{trip.plannedDistance} km · {trip.cargoWeight} kg cargo</p></div>) : <p className={cn("rounded-2xl border border-dashed p-5 text-sm transition-colors", isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500")}>No trip activity recorded yet.</p>}</div></section></aside></div>;
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-md backdrop-blur-[20px] bg-white/60 overflow-hidden shadow-2xl border border-white/40">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Register Driver</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Full Name</label>
            <input required type="text" placeholder="e.g. Alex Mercer" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">License Number</label>
            <input required type="text" placeholder="e.g. DL-9834720" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">License Category</label>
              <select value={formData.licenseCategory} onChange={e => setFormData({...formData, licenseCategory: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
                <option>B</option>
                <option>C</option>
                <option>C+E</option>
                <option>D</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Expiry Date</label>
              <input required type="date" value={formData.licenseExpiryDate} onChange={e => setFormData({...formData, licenseExpiryDate: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Contact Number</label>
            <input required type="tel" placeholder="e.g. +1 (555) 019-2834" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
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
