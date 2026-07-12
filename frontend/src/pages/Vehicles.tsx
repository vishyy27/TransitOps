import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, X, Download, Shield, CheckSquare, Edit } from 'lucide-react';
import { Vehicle } from '../types';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { exportToCSV } from '../lib/export';

export function Vehicles() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('registrationNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };
  
  const toggleAll = () => {
    if (selectedRows.length === filteredVehicles.length && filteredVehicles.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredVehicles.map(v => v.id));
    }
  };

  const handleBatchStatus = (status: Vehicle['status']) => {
    selectedRows.forEach(id => {
      const vehicle = state.vehicles.find(v => v.id === id);
      if (vehicle) {
        dispatch({ type: 'UPDATE_VEHICLE', payload: { ...vehicle, status } });
      }
    });
    setSelectedRows([]);
  };

  const handleBatchExport = () => {
    const toExport = state.vehicles.filter(v => selectedRows.includes(v.id));
    exportToCSV(toExport, 'vehicles_export');
  };


  const filteredVehicles = state.vehicles
    .filter(v => {
      const matchesSearch = v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
                            v.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'All' || v.type === filterType;
      const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
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
              <button onClick={() => handleBatchStatus('In Shop')} className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Set In Shop</button>
              <button onClick={() => handleBatchStatus('Retired')} className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Retire</button>
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
              placeholder="Search registration or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm soft-input font-medium"
            />
          </div>
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)} 
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <option value="All">All Types</option>
            <option value="Van">Vans</option>
            <option value="Truck">Trucks</option>
            <option value="Car">Cars</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
          >
            <option value="registrationNumber">Sort: Reg No</option>
            <option value="name">Sort: Model</option>
            <option value="maxLoadCapacity">Sort: Capacity</option>
            <option value="odometer">Sort: Odometer</option>
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
                <th className="py-4 px-5 w-12">
                  <input type="checkbox" className="rounded border-slate-300 text-accent focus:ring-accent w-4 h-4 cursor-pointer" 
                    checked={selectedRows.length === filteredVehicles.length && filteredVehicles.length > 0} 
                    onChange={toggleAll} 
                  />
                </th>
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
                  <td className="py-4 px-5">
                    <input type="checkbox" className="rounded border-slate-300 text-accent focus:ring-accent w-4 h-4 cursor-pointer" 
                      checked={selectedRows.includes(vehicle.id)} 
                      onChange={() => toggleRow(vehicle.id)} 
                    />
                  </td>
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
                  <td className="py-4 px-5 text-right flex justify-end gap-2">
                    <button onClick={() => setSelectedVehicleId(vehicle.id)} className="text-xs font-bold text-slate-500 hover:text-slate-950 uppercase tracking-wider">Details</button>
                    <button onClick={() => { setEditingVehicle(vehicle); setIsEditModalOpen(true); }} className="text-xs font-bold text-accent hover:text-accent/80 uppercase tracking-wider">Edit</button>
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
                  <td colSpan={8} className="py-10 text-center text-sm font-semibold text-slate-500/80">No registered vehicles match the criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddVehicleModal onClose={() => setIsModalOpen(false)} />
      )}
      {isEditModalOpen && editingVehicle && (
        <EditVehicleModal vehicle={editingVehicle} onClose={() => { setEditingVehicle(null); setIsEditModalOpen(false); }} />
      )}
      {selectedVehicleId && <VehicleDrawer vehicleId={selectedVehicleId} onClose={() => setSelectedVehicleId(null)} />}
    </div>
  );
}

function EditVehicleModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    registrationNumber: vehicle.registrationNumber,
    name: vehicle.name,
    type: vehicle.type,
    maxLoadCapacity: vehicle.maxLoadCapacity,
    odometer: vehicle.odometer,
    acquisitionCost: vehicle.acquisitionCost,
    status: vehicle.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_VEHICLE',
      payload: {
        ...vehicle,
        ...formData,
        registrationNumber: formData.registrationNumber.toUpperCase().trim(),
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
            <h2 className="text-lg font-bold font-display text-slate-900">Edit Vehicle</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Registration Number</label>
              <input required type="text" value={formData.registrationNumber} onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Name / Model</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Vehicle Type</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                <option>Van</option>
                <option>Truck</option>
                <option>Car</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="In Shop">In Shop</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Odometer Reading (km)</label>
              <input required type="number" min="0" value={formData.odometer} onChange={e => setFormData({ ...formData, odometer: parseInt(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Acquisition Cost ($)</label>
              <input required type="number" min="0" value={formData.acquisitionCost} onChange={e => setFormData({ ...formData, acquisitionCost: parseInt(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
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
}function VehicleDrawer({ vehicleId, onClose }: { vehicleId: string; onClose: () => void }) {
  const { state } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents'>('overview');
  const [documents, setDocuments] = useState<{ id: string; name: string; uploadedAt: string; status: 'Active' | 'Expiring' | 'Expired'; fileName: string }[]>([
    { id: 'd1', name: 'Commercial Insurance Policy', uploadedAt: 'Uploaded 10 days ago', status: 'Active', fileName: 'commercial_insurance_policy_2026.pdf' },
    { id: 'd2', name: 'State Vehicle Registration Certificate', uploadedAt: 'Uploaded 5 months ago', status: 'Active', fileName: 'state_vehicle_registration.pdf' },
    { id: 'd3', name: 'Safety Inspection Certificate', uploadedAt: 'Expires in 15 days', status: 'Expiring', fileName: 'safety_inspection_cert.pdf' }
  ]);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [docFilter, setDocFilter] = useState('All');
  const [docSort, setDocSort] = useState('name');
  const [previewingDoc, setPreviewingDoc] = useState<{ name: string; fileName: string; status: string } | null>(null);

  const vehicle = state.vehicles.find(item => item.id === vehicleId);
  if (!vehicle) return null;
  const relatedTrips = state.trips.filter(trip => trip.vehicleId === vehicleId);
  const maintenanceCost = state.maintenanceRecords.filter(record => record.vehicleId === vehicleId).reduce((sum, record) => sum + record.cost, 0);
  const fuelCost = state.fuelLogs.filter(log => log.vehicleId === vehicleId).reduce((sum, log) => sum + log.cost, 0);
  
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const finalFileName = uploadedFileName || `${newDocName.toLowerCase().replace(/\s+/g, '_')}_document.pdf`;
    setDocuments([
      ...documents,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newDocName.trim(),
        uploadedAt: 'Uploaded just now',
        status: 'Active',
        fileName: finalFileName
      }
    ]);
    setNewDocName('');
    setUploadedFileName('');
    setIsAddingDoc(false);
  };

  const filteredDocs = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(docSearch.toLowerCase()) || doc.fileName.toLowerCase().includes(docSearch.toLowerCase());
      const matchesStatus = docFilter === 'All' || doc.status === docFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (docSort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (docSort === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  const isDark = state.workspacePreferences.darkMode;

  return <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" onClick={onClose}><aside onClick={event => event.stopPropagation()} className={cn("absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl sm:p-8 border-l transition-colors duration-200", isDark ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-900 border-slate-100")}><div className="flex items-start justify-between"><div><p className={cn("text-xs font-bold uppercase tracking-[0.16em]", isDark ? "text-slate-500" : "text-slate-400")}>Fleet asset</p><h2 className={cn("mt-1 font-display text-2xl font-bold", isDark ? "text-slate-100" : "text-slate-905")}>{vehicle.registrationNumber}</h2><p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-550")}>{vehicle.name}</p></div><button onClick={onClose} className={cn("rounded-full p-2 transition-colors cursor-pointer", isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")}><X className="w-5 h-5" /></button></div><div className="mt-5"><Badge status={vehicle.status} /></div>
  
  <div className={cn("mt-8 flex gap-4 border-b", isDark ? "border-slate-800" : "border-slate-100")}>
    <button 
      onClick={() => setActiveTab('overview')} 
      className={cn(
        "pb-2 text-sm font-bold border-b-2 transition-colors cursor-pointer", 
        activeTab === 'overview' ? 'border-accent' : 'border-transparent',
        isDark 
          ? (activeTab === 'overview' ? 'text-white' : 'text-slate-500 hover:text-slate-300') 
          : (activeTab === 'overview' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-650')
      )}
    >
      Overview
    </button>
    <button 
      onClick={() => setActiveTab('documents')} 
      className={cn(
        "pb-2 text-sm font-bold border-b-2 transition-colors cursor-pointer", 
        activeTab === 'documents' ? 'border-accent' : 'border-transparent',
        isDark 
          ? (activeTab === 'documents' ? 'text-white' : 'text-slate-500 hover:text-slate-300') 
          : (activeTab === 'documents' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-650')
      )}
    >
      Document Management
    </button>
  </div>

  {activeTab === 'overview' ? (
    <>
      <div className="mt-7 grid grid-cols-2 gap-3"><Metric label="Capacity" value={`${vehicle.maxLoadCapacity.toLocaleString()} kg`} isDark={isDark} /><Metric label="Odometer" value={`${vehicle.odometer.toLocaleString()} km`} isDark={isDark} /><Metric label="Fuel cost" value={`${fuelCost.toLocaleString()}`} isDark={isDark} /><Metric label="Maintenance" value={`${maintenanceCost.toLocaleString()}`} isDark={isDark} /></div><section className="mt-8"><h3 className={cn("font-display font-bold", isDark ? "text-slate-100" : "text-slate-900")}>Operational timeline</h3><div className="mt-4 space-y-3">{relatedTrips.length ? relatedTrips.map(trip => <div key={trip.id} className={cn("rounded-2xl border p-4 transition-colors", isDark ? "border-slate-800 bg-slate-800/40" : "border-slate-100 bg-slate-50")}><div className="flex justify-between gap-3"><p className={cn("text-sm font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{trip.source} → {trip.destination}</p><Badge status={trip.status} /></div><p className={cn("mt-1 text-xs", isDark ? "text-slate-400" : "text-slate-550")}>{trip.plannedDistance} km · {trip.cargoWeight} kg cargo</p></div>) : <p className={cn("rounded-2xl border border-dashed p-5 text-sm transition-colors", isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500")}>No trips have been recorded for this vehicle yet.</p>}</div></section>
    </>
  ) : (
    <section className="mt-8 space-y-4">
      {/* Document Search and Filters */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={docSearch}
            onChange={e => setDocSearch(e.target.value)}
            className={cn("w-full pl-9 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-accent text-xs transition-colors", isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900")}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={docFilter} 
            onChange={e => setDocFilter(e.target.value)}
            className={cn("flex-1 px-3 py-1.5 text-[11px] font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-accent transition-colors", isDark ? "bg-slate-950 border border-slate-800 text-slate-300" : "bg-white border border-slate-200 text-slate-600")}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring">Expiring</option>
          </select>
          <select 
            value={docSort} 
            onChange={e => setDocSort(e.target.value)}
            className={cn("flex-1 px-3 py-1.5 text-[11px] font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-accent transition-colors", isDark ? "bg-slate-950 border border-slate-800 text-slate-300" : "bg-white border border-slate-200 text-slate-600")}
          >
            <option value="name">Sort: Name</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredDocs.map(doc => (
          <div key={doc.id} className={cn("rounded-2xl border p-4 flex items-center justify-between group transition-colors", isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-100")}>
            <div className="flex-1 min-w-0 pr-4">
              <p className={cn("text-sm font-bold truncate", isDark ? "text-slate-100" : "text-slate-900")}>{doc.name}</p>
              <p className={cn("text-[11px] truncate font-mono mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>{doc.fileName}</p>
              <p className={cn("text-[10px] mt-1", isDark ? "text-slate-400" : "text-slate-505")}>{doc.uploadedAt}</p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                onClick={() => setPreviewingDoc(doc)}
                className="text-accent hover:text-accent/85 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                View
              </button>
              <button 
                onClick={() => setDocuments(docs => docs.filter(d => d.id !== doc.id))}
                className="text-rose-500 hover:text-rose-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {filteredDocs.length === 0 && (
          <p className={cn("text-center py-6 text-xs font-semibold transition-colors", isDark ? "text-slate-500" : "text-slate-400")}>No matching documents found.</p>
        )}
      </div>
      
      {isAddingDoc ? (
        <form onSubmit={handleAddDocument} className={cn("border rounded-2xl p-4 space-y-3 transition-colors", isDark ? "border-slate-800 bg-slate-850/30" : "border-slate-100 bg-slate-50")}>
          <div>
            <label className={cn("block text-[10px] font-bold uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Document Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Emission Permit" 
              value={newDocName}
              onChange={e => setNewDocName(e.target.value)}
              className={cn("w-full px-3.5 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-accent text-xs transition-colors", isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900")}
            />
          </div>

          <div>
            <label className={cn("block text-[10px] font-bold uppercase tracking-wider mb-1", isDark ? "text-slate-400" : "text-slate-500")}>Attach File</label>
            <input 
              type="file" 
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setUploadedFileName(file.name);
              }}
              className="hidden"
              id="file-upload-input"
            />
            <label 
              htmlFor="file-upload-input" 
              className={cn("flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed rounded-full text-xs font-semibold cursor-pointer transition-colors", isDark ? "border-slate-800 text-slate-400 bg-slate-950 hover:text-white" : "border-slate-200 text-slate-500 bg-white hover:text-slate-900")}
            >
              {uploadedFileName ? `✓ ${uploadedFileName}` : "Choose PDF / Image File"}
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => { setIsAddingDoc(false); setUploadedFileName(''); }} className={cn("px-3 py-1.5 text-[10px] font-bold uppercase border rounded-full cursor-pointer transition-colors", isDark ? "text-slate-400 border-slate-800 hover:text-slate-250" : "text-slate-500 border-slate-200 hover:text-slate-900")}>Cancel</button>
            <button type="submit" className="px-3 py-1.5 text-[10px] font-bold uppercase text-white bg-accent rounded-full cursor-pointer">Add Document</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setIsAddingDoc(true)} className={cn("w-full mt-4 py-3 border-2 border-dashed rounded-xl text-sm font-bold transition-colors cursor-pointer", isDark ? "border-slate-800 text-slate-400 hover:border-accent hover:text-accent" : "border-slate-200 text-slate-500 hover:border-accent hover:text-accent")}>
          + Upload New Document
        </button>
      )}
    </section>
  )}
  </aside>

  {/* Document Preview Modal */}
  {previewingDoc && (
    <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewingDoc(null)}>
      <div className={cn("w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 relative border transition-colors", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")} onClick={e => e.stopPropagation()}>
        <div className={cn("flex justify-between items-center pb-4 border-b", isDark ? "border-slate-800" : "border-slate-100")}>
          <h4 className={cn("text-sm font-bold font-display", isDark ? "text-slate-100" : "text-slate-900")}>{previewingDoc.name}</h4>
          <button onClick={() => setPreviewingDoc(null)} className={cn("p-1.5 rounded-full transition-colors cursor-pointer", isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}><X className="w-4 h-4" /></button>
        </div>
        <div className={cn("my-6 p-10 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center transition-colors", isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200")}>
          <div className="w-14 h-14 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-3">
            <Shield className="w-7 h-7" />
          </div>
          <p className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>Secure Vault Document Preview</p>
          <p className={cn("text-sm font-semibold mt-1 font-mono", isDark ? "text-white" : "text-slate-900")}>{previewingDoc.fileName}</p>
          <p className="text-[10px] text-slate-400 mt-2">TransitOps Cryptographic Registry Verification Successful</p>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setPreviewingDoc(null)} className={cn("px-4 py-2 border text-xs font-bold uppercase rounded-full cursor-pointer transition-colors", isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-500 hover:text-slate-900")}>Close</button>
          <a href="#" onClick={(e) => { e.preventDefault(); import('react-hot-toast').then(({ toast: hotToast }) => hotToast.success(`Downloading "${previewingDoc.fileName}"...`)); }} className="px-5 py-2 bg-accent text-white text-xs font-bold uppercase rounded-full cursor-pointer shadow-md hover:bg-accent/90">Download File</a>
        </div>
      </div>
    </div>
  )}
  </div>;
}
function Metric({ label, value, isDark }: { label: string; value: string; isDark: boolean }) { return <div className={cn("rounded-2xl p-4 transition-colors", isDark ? "bg-slate-800" : "bg-slate-50")}><p className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-slate-500" : "text-slate-400")}>{label}</p><p className={cn("mt-1 font-mono text-sm font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{value}</p></div>; }

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
      <div className="soft-card w-full max-w-md backdrop-blur-[20px] bg-white/60 overflow-hidden shadow-2xl border border-white/40">
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
