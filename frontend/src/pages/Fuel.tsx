import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, X, Fuel as FuelIcon, Receipt, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export function Fuel() {
  const { state } = useStore();
  const [tab, setTab] = useState<'fuel' | 'expenses'>('fuel');
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Tab Switcher & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-cream/50">
        <div className="flex bg-cream-light p-1.5 rounded-xl border border-cream/70 w-full sm:w-auto">
          <button 
            onClick={() => setTab('fuel')}
            className={cn(
              "flex-1 sm:flex-initial py-2 px-5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer",
              tab === 'fuel' ? "bg-ink text-cream shadow-sm" : "text-rust hover:text-ink"
            )}
          >
            <FuelIcon className="w-4 h-4 shrink-0" /> Fuel Logs
          </button>
          <button 
            onClick={() => setTab('expenses')}
            className={cn(
              "flex-1 sm:flex-initial py-2 px-5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer",
              tab === 'expenses' ? "bg-ink text-cream shadow-sm" : "text-rust hover:text-ink"
            )}
          >
            <Receipt className="w-4 h-4 shrink-0" /> Expenses
          </button>
        </div>

        {tab === 'fuel' ? (
          <button onClick={() => setIsFuelModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4.5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 shadow-lg shadow-accent/15 font-semibold text-xs uppercase tracking-wider cursor-pointer">
            <Plus className="w-4.5 h-4.5" /> Add Fuel Log
          </button>
        ) : (
          <button onClick={() => setIsExpenseModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4.5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 shadow-lg shadow-accent/15 font-semibold text-xs uppercase tracking-wider cursor-pointer">
            <Plus className="w-4.5 h-4.5" /> Add Expense
          </button>
        )}
      </div>

      {/* Datatable Containers */}
      <div className="bg-white rounded-2xl shadow-sm border border-cream/50 overflow-hidden">
        {tab === 'fuel' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-light/75 border-b border-cream/60 text-xs font-bold text-rust uppercase tracking-wider">
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
                    <tr key={log.id} className="hover:bg-cream-light/35 transition-colors">
                      <td className="py-4 px-5 text-ink font-medium">{format(new Date(log.date), 'MMM d, yyyy')}</td>
                      <td className="py-4 px-5 font-semibold text-ink font-mono">{vehicle?.registrationNumber || 'Unknown'}</td>
                      <td className="py-4 px-5 text-ink font-semibold font-mono">{log.liters.toFixed(1)} L</td>
                      <td className="py-4 px-5 font-bold text-ink font-mono">${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )
                })}
                {state.fuelLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm font-semibold text-rust/80">No fuel records logged.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-light/75 border-b border-cream/60 text-xs font-bold text-rust uppercase tracking-wider">
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
                    <tr key={expense.id} className="hover:bg-cream-light/35 transition-colors">
                      <td className="py-4 px-5 text-ink font-medium">{format(new Date(expense.date), 'MMM d, yyyy')}</td>
                      <td className="py-4 px-5 font-semibold text-ink font-mono">{vehicle?.registrationNumber || 'Unknown'}</td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-cream text-rust border border-cream/65">
                          {expense.type}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-ink font-medium">{expense.description}</td>
                      <td className="py-4 px-5 font-bold text-ink font-mono">${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  )
                })}
                {state.expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm font-semibold text-rust/80">No general expenses recorded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFuelModalOpen && <AddFuelModal onClose={() => setIsFuelModalOpen(false)} />}
      {isExpenseModalOpen && <AddExpenseModal onClose={() => setIsExpenseModalOpen(false)} />}
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-cream">
        <div className="flex justify-between items-center p-5 border-b border-cream/50 bg-cream-light/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cream rounded-lg text-accent">
              <FuelIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-ink">Add Fuel Log</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg text-rust transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Select Fleet Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer">
              <option value="" disabled>Select vehicle</option>
              {state.vehicles.filter(v => v.status !== 'Retired').map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Refuel Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Liters (L)</label>
              <input required type="number" min="0.1" step="0.1" value={formData.liters} onChange={e => setFormData({...formData, liters: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Total Cost ($)</label>
              <input required type="number" min="0.01" step="0.01" value={formData.cost} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-cream-light">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-rust hover:bg-cream-light rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Log</button>
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-cream">
        <div className="flex justify-between items-center p-5 border-b border-cream/50 bg-cream-light/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cream rounded-lg text-accent">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-ink">Add Expense</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-lg text-rust transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Select Fleet Vehicle</label>
            <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer">
              <option value="" disabled>Select vehicle</option>
              {state.vehicles.filter(v => v.status !== 'Retired').map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Expense Type</label>
              <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer">
                <option>Toll</option>
                <option>Parking</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Amount ($)</label>
              <input required type="number" min="0.01" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Expense Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wide mb-1">Description / Memo</label>
            <input required type="text" placeholder="e.g. Highway Toll Route 66" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3.5 py-2.5 border border-sage/35 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white text-ink font-medium" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-cream-light">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 text-rust hover:bg-cream-light rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent/90 shadow-md transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer">Save Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}

