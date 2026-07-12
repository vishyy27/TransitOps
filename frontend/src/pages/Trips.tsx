import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useStore } from '../store';
import { Plus, X, ArrowRight, CheckCircle, XCircle, MapPin, Gauge, ShieldAlert, Calendar, Download, Edit } from 'lucide-react';
import { TripStatus, Trip } from '../types';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';
import { exportToCSV } from '../lib/export';

export function Trips() {
  const { state, dispatch } = useStore();
  React.useEffect(() => { api.get('/trips?limit=100').then(res => { const mapped = (res.data || []).map((t: any) => ({...t, vehicleId: t.vehicle_id, driverId: t.driver_id, cargoWeight: t.cargo_weight, plannedDistance: t.planned_distance})); dispatch({ type: 'SET_TRIPS', payload: mapped }); }).catch(console.error); }, [dispatch]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [completeModalTrip, setCompleteModalTrip] = useState<string | null>(null);

  const columns: { id: TripStatus; label: string; color: string; bg: string }[] = [
    { id: 'Draft', label: 'Draft / Planned', color: 'text-slate-500 bg-rust/10 border-rust/20', bg: 'bg-transparent/40' },
    { id: 'Dispatched', label: 'Active Dispatch', color: 'text-slate-900 bg-ink/10 border-ink/20', bg: 'bg-sage/10' },
    { id: 'Completed', label: 'Completed', color: 'text-slate-400 bg-sage/10 border-sage/20', bg: 'bg-sage/5' },
    { id: 'Cancelled', label: 'Cancelled', color: 'text-accent bg-accent/10 border-accent/20', bg: 'bg-accent/5' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col selection:bg-accent/20">
      <div className="flex justify-between items-center gap-4 shrink-0 bg-white rounded-[32px] p-5 border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display leading-tight">Trip Dispatch Center</h2>
          <p className="text-xs text-slate-500 font-medium">Manage and monitor driver routes & cargo shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => exportToCSV(state.trips, 'trips')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Create Trip
          </button>
        </div>
      </div>

      
      {/* Active Pipeline Flow Visualizer */}
      {(() => {
        const draftCount = state.trips.filter(t => t.status === 'Draft').length;
        const dispatchedCount = state.trips.filter(t => t.status === 'Dispatched').length;
        const completedCount = state.trips.filter(t => t.status === 'Completed').length;
        
        const isDraftActive = draftCount > 0;
        const isDispatchedActive = dispatchedCount > 0;
        const isCompletedActive = completedCount > 0;

        return (
          <div className="soft-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            
            <div className="flex-1 w-full flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200/60 z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm", isDraftActive ? "bg-black border-2 border-black" : "bg-white border-2 border-slate-200")}>
                   <span className={cn("w-3 h-3 rounded-full transition-colors", isDraftActive ? "bg-white" : "bg-slate-300")}></span>
                </div>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors", isDraftActive ? "text-slate-900 bg-white border-slate-200 shadow-sm" : "text-slate-500 bg-[#f8fafc] border-slate-100")}>Draft ({draftCount})</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm", isDispatchedActive ? "bg-black border-2 border-black" : "bg-white border-2 border-slate-200")}>
                   <Gauge className={cn("w-4 h-4 transition-colors", isDispatchedActive ? "text-white" : "text-slate-400")} />
                </div>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors", isDispatchedActive ? "text-slate-900 bg-white border-slate-200 shadow-sm" : "text-slate-500 bg-[#f8fafc] border-slate-100")}>Dispatching ({dispatchedCount})</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm", isDispatchedActive ? "bg-black border-2 border-black" : "bg-white border-2 border-slate-200")}>
                   <MapPin className={cn("w-4 h-4 transition-colors", isDispatchedActive ? "text-white" : "text-slate-400")} />
                </div>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors", isDispatchedActive ? "text-slate-900 bg-white border-slate-200 shadow-sm" : "text-slate-500 bg-[#f8fafc] border-slate-100")}>In Transit ({dispatchedCount})</span>
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm", isCompletedActive ? "bg-black border-2 border-black" : "bg-white border-2 border-slate-200")}>
                   <CheckCircle className={cn("w-4 h-4 transition-colors", isCompletedActive ? "text-white" : "text-slate-400")} />
                </div>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors", isCompletedActive ? "text-slate-900 bg-white border-slate-200 shadow-sm" : "text-slate-500 bg-[#f8fafc] border-slate-100")}>Completed ({completedCount})</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-stretch min-h-[450px]">
        {columns.map(col => {
          const columnTrips = state.trips.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={cn("flex-shrink-0 w-[340px] flex flex-col rounded-[32px] border border-white/60 shadow-sm bg-[#f4f6f9] overflow-hidden", col.bg)}>
              <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-white">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", col.color)}>
                  {col.label}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-transparent px-2 py-0.5 rounded-md border border-slate-200">
                  {columnTrips.length}
                </span>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px]">
                {columnTrips.map(trip => {
                  const vehicle = state.vehicles.find(v => v.id === trip.vehicleId);
                  const driver = state.drivers.find(d => d.id === trip.driverId);
                  
                  return (
                    <div key={trip.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-200 space-y-3.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
                      {/* Destination flow row */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span className="truncate">{trip.source}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{trip.destination}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                          <span>{trip.plannedDistance} km</span>
                          <span className="text-slate-900">•</span>
                          <span>{trip.cargoWeight} kg payload</span>
                        </p>
                      </div>
                      
                      {/* Assets row */}
                      <div className="pt-3 border-t border-slate-200/5 flex justify-between items-center text-xs font-semibold text-slate-900">
                        <span className="font-mono text-slate-500 bg-transparent border border-slate-200 px-2 py-0.5 rounded-md">{vehicle?.registrationNumber || 'Unknown'}</span>
                        <span className="text-slate-900/80">{driver?.name || 'Unassigned'}</span>
                      </div>
                      <div className="pt-3 flex justify-end">
                        <button onClick={() => { setEditingTrip(trip); setIsEditModalOpen(true); }} className="px-3 py-2 text-slate-500 hover:text-slate-900 rounded-3xl transition-colors border border-slate-200 cursor-pointer text-xs font-bold uppercase tracking-wider">
                          <Edit className="w-3.5 h-3.5 inline-block mr-1" /> Edit
                        </button>
                      </div>

                      {/* Dispatched Actions */}
                      {trip.status === 'Draft' && (
                        <div className="pt-2.5 flex gap-2">
                          <button 
                            onClick={() => dispatch({ type: 'DISPATCH_TRIP', payload: trip.id })}
                            className="flex-1 py-2 bg-ink hover:bg-ink/90 text-slate-900 text-xs font-bold rounded-3xl transition-colors cursor-pointer text-center"
                          >
                            Dispatch
                          </button>
                          <button 
                            onClick={() => dispatch({ type: 'CANCEL_TRIP', payload: trip.id })}
                            className="px-3 py-2 text-slate-500 hover:bg-white hover:text-slate-900 rounded-3xl transition-colors border border-slate-200 cursor-pointer"
                            title="Cancel Trip"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {trip.status === 'Dispatched' && (
                        <div className="pt-2.5 flex gap-2">
                          <button 
                            onClick={() => setCompleteModalTrip(trip.id)}
                            className="flex-1 py-2 bg-sage hover:bg-sage/95 text-slate-900 text-xs font-bold rounded-3xl transition-colors cursor-pointer text-center"
                          >
                            Mark Completed
                          </button>
                          <button 
                            onClick={() => dispatch({ type: 'CANCEL_TRIP', payload: trip.id })}
                            className="px-3 py-2 text-accent hover:bg-red-50 hover:text-accent rounded-3xl transition-colors border border-slate-200 cursor-pointer"
                            title="Abort/Cancel Dispatch"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {columnTrips.length === 0 && (
                  <div className="text-center py-10 text-xs font-bold text-slate-500/70 border-2 border-dashed border-slate-200/70 rounded-full flex flex-col items-center gap-1.5 bg-slate-100">
                    <span>No trips in this stage</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && <CreateTripModal onClose={() => setIsModalOpen(false)} />}
      {isEditModalOpen && editingTrip && <EditTripModal trip={editingTrip} onClose={() => { setIsEditModalOpen(false); setEditingTrip(null); }} />}
      {completeModalTrip && <CompleteTripModal tripId={completeModalTrip} onClose={() => setCompleteModalTrip(null)} />}
    </div>
  );
}

function EditTripModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState<Trip>({ ...trip });
  const [error, setError] = useState('');

  const availableVehicles = state.vehicles.filter(v => v.status !== 'Retired' || v.id === trip.vehicleId);
  const availableDrivers = state.drivers.filter(d => d.status !== 'Suspended' || d.id === trip.driverId);
  const selectedVehicle = state.vehicles.find(v => v.id === formData.vehicleId);
  const isWeightExceeded = selectedVehicle ? formData.cargoWeight > selectedVehicle.maxLoadCapacity : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWeightExceeded) {
      setError(`Cargo weight exceeds vehicle capacity (${selectedVehicle?.maxLoadCapacity}kg).`);
      return;
    }
    dispatch({ type: 'UPDATE_TRIP', payload: { ...trip, ...formData } });
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
            <h2 className="text-lg font-bold font-display text-slate-900">Edit Trip</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Source</label>
              <input required type="text" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Destination</label>
              <input required type="text" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({ ...formData, vehicleId: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
              <option value="" disabled>Select vehicle</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Driver</label>
            <select required value={formData.driverId} onChange={e => setFormData({ ...formData, driverId: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
              <option value="" disabled>Select driver</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Cargo Weight (kg)</label>
              <input required type="number" min="0" value={formData.cargoWeight} onChange={e => setFormData({ ...formData, cargoWeight: parseInt(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Planned Distance (km)</label>
              <input required type="number" min="0" value={formData.plannedDistance} onChange={e => setFormData({ ...formData, plannedDistance: parseInt(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Trip['status'] })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
              <option value="Draft">Draft</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" disabled={isWeightExceeded} className="px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Trip</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateTripModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicleId: '',
    driverId: '',
    cargoWeight: 0,
    plannedDistance: 0,
  });
  const [error, setError] = useState('');

  // Filtering rules based on business parameters
  const availableVehicles = state.vehicles.filter(v => v.status === 'Available');
  const availableDrivers = state.drivers.filter(d => {
    const isExpired = new Date(d.licenseExpiryDate) < new Date();
    return d.status === 'Available' && d.status !== 'Suspended' && !isExpired;
  });

  const selectedVehicle = state.vehicles.find(v => v.id === formData.vehicleId);
  const isWeightExceeded = selectedVehicle ? formData.cargoWeight > selectedVehicle.maxLoadCapacity : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isWeightExceeded && selectedVehicle) {
      setError(`Overload Error: Cargo weight exceeds maximum load capacity of selected vehicle (${selectedVehicle.maxLoadCapacity}kg).`);
      return;
    }

    dispatch({
      type: 'CREATE_TRIP',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'Draft',
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
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Plan Route & Dispatch</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-full text-xs font-semibold border border-red-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Source Hub</label>
              <input required type="text" placeholder="Origin" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Destination Hub</label>
              <input required type="text" placeholder="Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Assign Fleet Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
              <option value="" disabled>Select available vehicle</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name} (Max: {v.maxLoadCapacity}kg)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Assign Driver (Active/Licensed)</label>
            <select required value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
              <option value="" disabled>Select available driver</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} (License: {d.licenseNumber})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">Cargo Weight (kg)</label>
                {selectedVehicle && (
                  <span className={cn("text-[10px] font-bold uppercase", isWeightExceeded ? "text-accent" : "text-slate-400")}>
                    Limit: {selectedVehicle.maxLoadCapacity}kg
                  </span>
                )}
              </div>
              <input 
                required 
                type="number" 
                min="1" 
                value={formData.cargoWeight} 
                onChange={e => setFormData({...formData, cargoWeight: parseInt(e.target.value) || 0})} 
                className={cn(
                  "w-full px-3.5 py-2.5 border rounded-full focus:outline-none focus:ring-2 bg-white text-slate-900 font-medium",
                  isWeightExceeded ? "border-red-500 focus:ring-red-500" : "border-sage/35 focus:ring-accent"
                )} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Planned Distance (km)</label>
              <input required type="number" min="1" value={formData.plannedDistance} onChange={e => setFormData({...formData, plannedDistance: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" disabled={isWeightExceeded} className="px-5 py-2.5 bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Route</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CompleteTripModal({ tripId, onClose }: { tripId: string, onClose: () => void }) {
  const { state, dispatch } = useStore();
  const trip = state.trips.find(t => t.id === tripId);
  const vehicle = state.vehicles.find(v => v.id === trip?.vehicleId);
  
  const [formData, setFormData] = useState({
    finalOdometer: vehicle?.odometer || 0,
    fuelConsumed: 0,
    fuelCost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    dispatch({
      type: 'COMPLETE_TRIP',
      payload: {
        tripId,
        finalOdometer: formData.finalOdometer,
        fuelConsumed: formData.fuelConsumed,
        fuelCost: formData.fuelCost,
        date: new Date().toISOString()
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-slate-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Complete Dispatch</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Final Odometer Reading (km)</label>
            <input required type="number" min={vehicle?.odometer || 0} value={formData.finalOdometer} onChange={e => setFormData({...formData, finalOdometer: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            <p className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Previous: {vehicle?.odometer.toLocaleString()} km
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Fuel Consumed (L)</label>
              <input required type="number" min="0" step="0.1" value={formData.fuelConsumed} onChange={e => setFormData({...formData, fuelConsumed: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Fuel Cost ($)</label>
              <input required type="number" min="0" step="0.01" value={formData.fuelCost} onChange={e => setFormData({...formData, fuelCost: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-sage text-slate-900 rounded-full hover:bg-sage/95 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Complete Dispatch</button>
          </div>
        </form>
      </div>
    </div>
  );
}

