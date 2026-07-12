import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useStore } from '../store';
import { Plus, X, Fuel as FuelIcon, Receipt, Calendar, CreditCard, DollarSign, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { FuelLog, Expense } from '../types';

export function Fuel() {
  const { state, dispatch } = useStore();
  React.useEffect(() => { api.get('/fuel-logs?limit=100').then(res => { dispatch({ type: 'SET_FUEL_LOGS', payload: res.data || [] }); }).catch(console.error); api.get('/expenses?limit=100').then(res => { dispatch({ type: 'SET_EXPENSES', payload: res.data || [] }); }).catch(console.error); }, [dispatch]);
  const [tab, setTab] = useState<'fuel' | 'expenses'>('fuel');
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFuelEditModalOpen, setIsFuelEditModalOpen] = useState(false);
  const [isExpenseEditModalOpen, setIsExpenseEditModalOpen] = useState(false);
  const [editingFuelLog, setEditingFuelLog] = useState<FuelLog | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Tab Switcher & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5">
        <div className="flex bg-transparent p-1.5 rounded-full border border-slate-200/70 w-full sm:w-auto">
          <button 
            onClick={() => setTab('fuel')}
            className={cn(
              "flex-1 sm:flex-initial py-2 px-5 font-bold text-xs uppercase tracking-wider rounded-3xl transition-all flex items-center justify-center gap-2 cursor-pointer",
              tab === 'fuel' ? "bg-ink text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <FuelIcon className="w-4 h-4 shrink-0" /> Fuel Logs
          </button>
          <button 
            onClick={() => setTab('expenses')}
            className={cn(
              "flex-1 sm:flex-initial py-2 px-5 font-bold text-xs uppercase tracking-wider rounded-3xl transition-all flex items-center justify-center gap-2 cursor-pointer",
              tab === 'expenses' ? "bg-ink text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Receipt className="w-4 h-4 shrink-0" /> Expenses
          </button>
        </div>

        {tab === 'fuel' ? (
          <button onClick={() => setIsFuelModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4.5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-lg shadow-accent/15 font-semibold text-xs uppercase tracking-wider cursor-pointer">
            <Plus className="w-4.5 h-4.5" /> Add Fuel Log
          </button>
        ) : (
          <button onClick={() => setIsExpenseModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4.5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-lg shadow-accent/15 font-semibold text-xs uppercase tracking-wider cursor-pointer">
            <Plus className="w-4.5 h-4.5" /> Add Expense
          </button>
        )}
      </div>

      {/* Datatable Containers */}
      <div className="soft-card overflow-hidden">
        {tab === 'fuel' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="soft-table-header text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Refuel Date</th>
                  <th className="py-4 px-5">Fleet Vehicle</th>
                  <th className="py-4 px-5">Fuel Liters</th>
                  <th className="py-4 px-5">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-light/90 text-sm">
                {state.fuelLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => {
                  const vehicle = state.vehicles.find(v => v.id === log.vehicleId);
                  return (
                    <tr key={log.id} className="soft-table-row/35 transition-colors">
                      <td className="py-4 px-5 text-slate-900 font-medium">{format(new Date(log.date), 'MMM d, yyyy')}</td>
                      <td className="py-4 px-5 font-semibold text-slate-900 font-mono">{vehicle?.registrationNumber || 'Unknown'}</td>
                      <td className="py-4 px-5 text-slate-900 font-semibold font-mono">{log.liters.toFixed(1)} L</td>
                      <td className="py-4 px-5 font-bold text-slate-900 font-mono flex items-center justify-between gap-3">
                        <span>${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <button onClick={() => { setEditingFuelLog(log); setIsFuelEditModalOpen(true); }} className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {state.fuelLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm font-semibold text-slate-500/80">No fuel records logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="soft-table-header text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Expense Date</th>
                  <th className="py-4 px-5">Fleet Vehicle</th>
                  <th className="py-4 px-5">Type</th>
                  <th className="py-4 px-5">Description</th>
                  <th className="py-4 px-5">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-light/90 text-sm">
                {state.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => {
                  const vehicle = state.vehicles.find(v => v.id === expense.vehicleId);
                  return (
                    <tr key={expense.id} className="soft-table-row/35 transition-colors">
                      <td className="py-4 px-5 text-slate-900 font-medium">{format(new Date(expense.date), 'MMM d, yyyy')}</td>
                      <td className="py-4 px-5 font-semibold text-slate-900 font-mono">{vehicle?.registrationNumber || 'Unknown'}</td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-white text-slate-500 border border-slate-200/65">
                          {expense.type}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-900 font-medium">{expense.description}</td>
                      <td className="py-4 px-5 font-bold text-slate-900 font-mono flex items-center justify-between gap-3">
                        <span>${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <button onClick={() => { setEditingExpense(expense); setIsExpenseEditModalOpen(true); }} className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {state.expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm font-semibold text-slate-500/80">No general expenses recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFuelModalOpen && <AddFuelModal onClose={() => setIsFuelModalOpen(false)} />}
      {isExpenseModalOpen && <AddExpenseModal onClose={() => setIsExpenseModalOpen(false)} />}
      {isFuelEditModalOpen && editingFuelLog && <EditFuelModal fuelLog={editingFuelLog} onClose={() => { setIsFuelEditModalOpen(false); setEditingFuelLog(null); }} />}
      {isExpenseEditModalOpen && editingExpense && <EditExpenseModal expense={editingExpense} onClose={() => { setIsExpenseEditModalOpen(false); setEditingExpense(null); }} />}
    </div>
  );
}

function EditFuelModal({ fuelLog, onClose }: { fuelLog: FuelLog; onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState<FuelLog>({ ...fuelLog });

  const availableVehicles = state.vehicles.filter(v => v.status !== 'Retired' || v.id === fuelLog.vehicleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_FUEL_LOG', payload: { ...fuelLog, ...formData } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 bg-white">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <FuelIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Edit Fuel Log</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
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
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Refuel Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Liters</label>
              <input required type="number" min="0" step="0.1" value={formData.liters} onChange={e => setFormData({ ...formData, liters: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Total Cost</label>
              <input required type="number" min="0" step="0.01" value={formData.cost} onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider">Save Fuel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditExpenseModal({ expense, onClose }: { expense: Expense; onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState<Expense>({ ...expense });

  const availableVehicles = state.vehicles.filter(v => v.status !== 'Retired' || v.id === expense.vehicleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_EXPENSE', payload: { ...expense, ...formData } });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 bg-white">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Edit Expense</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
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
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Expense Type</label>
            <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
              <option>Toll</option>
              <option>Parking</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Expense Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Description</label>
            <input required type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Amount</label>
            <input required type="number" min="0" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 soft-input font-medium" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider">Save Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddFuelModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    liters: 0,
    cost: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_FUEL_LOG',
      payload: { id: Math.random().toString(36).substr(2, 9), ...formData }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <FuelIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Add Fuel Log</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Select Fleet Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
              <option value="" disabled>Select vehicle</option>
              {state.vehicles.filter(v => v.status !== 'Retired').map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Refuel Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Liters (L)</label>
              <input required type="number" min="0.1" step="0.1" value={formData.liters} onChange={e => setFormData({...formData, liters: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Total Cost ($)</label>
              <input required type="number" min="0.01" step="0.01" value={formData.cost} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Log</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: 'Toll',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_EXPENSE',
      payload: { id: Math.random().toString(36).substr(2, 9), ...formData }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Add Expense</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Select Fleet Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
              <option value="" disabled>Select vehicle</option>
              {state.vehicles.filter(v => v.status !== 'Retired').map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Expense Type</label>
              <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer">
                <option>Toll</option>
                <option>Parking</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Amount ($)</label>
              <input required type="number" min="0.01" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Expense Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Description / Memo</label>
            <input required type="text" placeholder="e.g. Highway Toll Route 66" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-full focus:outline-none focus:ring-2 focus:ring-accent bg-white text-slate-900 font-medium" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/5">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-slate-500 soft-table-row rounded-full transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}

