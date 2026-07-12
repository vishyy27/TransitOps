import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, X, ArrowRight, CheckCircle, XCircle, MapPin, Gauge, ShieldAlert, Calendar } from 'lucide-react';
import { TripStatus } from '../types';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';

export function Trips() {
  const { state, dispatch } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completeModalTrip, setCompleteModalTrip] = useState<string | null>(null);

  const columns: { id: TripStatus; label: string; color: string; bg: string }[] = [
    { id: 'Draft', label: 'Draft / Planned', color: 'text-rust bg-rust/10 border-rust/20', bg: 'bg-cream-light/40' },
    { id: 'Dispatched', label: 'Active Dispatch', color: 'text-ink bg-ink/10 border-ink/20', bg: 'bg-sage/10' },
    { id: 'Completed', label: 'Completed', color: 'text-sage bg-sage/10 border-sage/20', bg: 'bg-sage/5' },
    { id: 'Cancelled', label: 'Cancelled', color: 'text-accent bg-accent/10 border-accent/20', bg: 'bg-accent/5' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col selection:bg-accent/20">
      <div className="flex justify-between items-center gap-4 shrink-0 bg-white rounded-2xl p-5 border border-cream/50 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-ink font-display leading-tight">Trip Dispatch Center</h2>
          <p className="text-xs text-rust font-medium">Manage and monitor driver routes & cargo shipments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/15 font-semibold text-xs uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Trip
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-stretch min-h-[450px]">
        {columns.map(col => {
          const columnTrips = state.trips.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={cn("flex-shrink-0 w-80 flex flex-col rounded-2xl border border-cream/60 shadow-sm overflow-hidden", col.bg)}>
              <div className="p-4 flex items-center justify-between border-b border-cream bg-white">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border", col.color)}>
                  {col.label}
                </span>
                <span className="font-mono text-xs font-bold text-rust bg-cream-light px-2 py-0.5 rounded-md border border-cream/40">
                  {columnTrips.length}
                </span>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px]">
                {columnTrips.map(trip => {
                  const vehicle = state.vehicles.find(v => v.id === trip.vehicleId);
                  const driver = state.drivers.find(d => d.id === trip.driverId);
                  
                  return (
                    <div key={trip.id} className="bg-white p-4 rounded-xl shadow-sm border border-cream/65 space-y-3.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
                      {/* Destination flow row */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span className="truncate">{trip.source}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-sage shrink-0" />
                          <span className="truncate">{trip.destination}</span>
                        </div>
                        <p className="text-xs text-rust font-semibold flex items-center gap-1.5">
                          <span>{trip.plannedDistance} km</span>
                          <span className="text-cream">•</span>
                          <span>{trip.cargoWeight} kg payload</span>
                        </p>
                      </div>
                      
                      {/* Assets row */}
                      <div className="pt-3 border-t border-cream-light flex justify-between items-center text-xs font-semibold text-ink">
                        <span className="font-mono text-rust bg-cream-light border border-cream/50 px-2 py-0.5 rounded-md">{vehicle?.registrationNumber || 'Unknown'}</span>
                        <span className="text-ink/80">{driver?.name || 'Unassigned'}</span>
                      </div>

                      {/* Dispatched Actions */}
                      {trip.status === 'Draft' && (
                        <div className="pt-2.5 flex gap-2">
                          <button 
                            onClick={() => dispatch({ type: 'DISPATCH_TRIP', payload: trip.id })}
                            className="flex-1 py-2 bg-ink hover:bg-ink/90 text-cream text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                          >
                            Dispatch
                          </button>
                          <button 
                            onClick={() => dispatch({ type: 'CANCEL_TRIP', payload: trip.id })}
                            className="px-3 py-2 text-rust hover:bg-cream hover:text-ink rounded-lg transition-colors border border-cream cursor-pointer"
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
                            className="flex-1 py-2 bg-sage hover:bg-sage/95 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                          >
                            Mark Completed
                          </button>
                          <button 
                            onClick={() => dispatch({ type: 'CANCEL_TRIP', payload: trip.id })}
                            className="px-3 py-2 text-accent hover:bg-red-50 hover:text-accent rounded-lg transition-colors border border-cream cursor-pointer"
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
                  <div className="text-center py-10 text-xs font-bold text-rust/70 border-2 border-dashed border-cream/70 rounded-xl flex flex-col items-center gap-1.5 bg-white/20">
                    <span>No trips in this stage</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && <CreateTripModal onClose={() => setIsModalOpen(false)} />}
      {completeModalTrip && <CompleteTripModal tripId={completeModalTrip} onClose={() => setCompleteModalTrip(null)} />}
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
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-cream">
        <div className="flex justify-between items-center p-5 border-b border-cream/50 bg-cream-light/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cream rounded-lg text-accent">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-ink">Plan Route & Dispatch</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg text-rust transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Source Hub</label>
              <input required type="text" placeholder="Origin" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Destination Hub</label>
              <input required type="text" placeholder="Destination" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Assign Fleet Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer">
              <option value="" disabled>Select available vehicle</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name} (Max: {v.maxLoadCapacity}kg)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Assign Driver (Active/Licensed)</label>
            <select required value={formData.driverId} onChange={e => setFormData({...formData, driverId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer">
              <option value="" disabled>Select available driver</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} (License: {d.licenseNumber})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wide">Cargo Weight (kg)</label>
                {selectedVehicle && (
                  <span className={cn("text-[10px] font-bold uppercase", isWeightExceeded ? "text-accent" : "text-sage")}>
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
                  "w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white text-ink font-medium",
                  isWeightExceeded ? "border-red-500 focus:ring-red-500" : "border-sage/35 focus:ring-accent"
                )} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Planned Distance (km)</label>
              <input required type="number" min="1" value={formData.plannedDistance} onChange={e => setFormData({...formData, plannedDistance: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-cream-light">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-rust hover:bg-cream-light rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" disabled={isWeightExceeded} className="px-5 py-2.5 bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Route</button>
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
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-cream">
        <div className="flex justify-between items-center p-5 border-b border-cream/50 bg-cream-light/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cream rounded-lg text-sage">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-ink">Complete Dispatch</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg text-rust transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Final Odometer Reading (km)</label>
            <input required type="number" min={vehicle?.odometer || 0} value={formData.finalOdometer} onChange={e => setFormData({...formData, finalOdometer: parseInt(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            <p className="text-[10px] text-rust font-semibold mt-1 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-sage shrink-0" /> Previous: {vehicle?.odometer.toLocaleString()} km
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Fuel Consumed (L)</label>
              <input required type="number" min="0" step="0.1" value={formData.fuelConsumed} onChange={e => setFormData({...formData, fuelConsumed: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Fuel Cost ($)</label>
              <input required type="number" min="0" step="0.01" value={formData.fuelCost} onChange={e => setFormData({...formData, fuelCost: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-cream-light">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-rust hover:bg-cream-light rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-sage text-white rounded-xl hover:bg-sage/95 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Complete Dispatch</button>
          </div>
        </form>
      </div>
    </div>
  );
}

