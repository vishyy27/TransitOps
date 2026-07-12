import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, FileText, Download, CheckCircle, AlertCircle, Clock, X, Check, Printer } from 'lucide-react';
import { Badge } from '../components/Badge';
import { format } from 'date-fns';
import { exportToCSV } from '../lib/export';
import { Invoice } from '../types';

export function Invoices() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePrintInvoice, setActivePrintInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = state.invoices.filter(inv => {
    const customer = state.customers.find(c => c.id === inv.customerId);
    return (
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      (customer && customer.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const totalPending = state.invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = state.invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = state.invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);

  const handlePrintPDF = (invoice: Invoice) => {
    setActivePrintInvoice(invoice);
    document.body.classList.add('printing-invoice');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-invoice');
    }, 150);
  };

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="soft-card p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Revenue</p>
            <p className="text-3xl font-extrabold font-mono text-slate-900 mt-2">${totalPending.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-full bg-slate-100 text-slate-600 transition-transform group-hover:scale-105 border border-slate-200">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="soft-card p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Bills</p>
            <p className="text-3xl font-extrabold font-mono text-red-600 mt-2">${totalOverdue.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-full bg-red-50 text-red-500 transition-transform group-hover:scale-105 border border-red-100">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="soft-card p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid (30 Days)</p>
            <p className="text-3xl font-extrabold font-mono text-emerald-600 mt-2">${totalPaid.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-full bg-emerald-50 text-emerald-500 transition-transform group-hover:scale-105 border border-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search invoice # or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm soft-input font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => exportToCSV(filteredInvoices, 'invoices')}
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
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Datatable Container */}
      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="soft-table-header uppercase tracking-wider">
                <th className="py-4 px-5">Invoice ID</th>
                <th className="py-4 px-5">Client Name</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Issue Date</th>
                <th className="py-4 px-5">Due Date</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredInvoices.map(inv => {
                const customer = state.customers.find(c => c.id === inv.customerId);
                return (
                  <tr key={inv.id} className="soft-table-row font-medium group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-mono font-bold">{inv.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">{customer?.name || 'Unknown'}</td>
                    <td className="py-4 px-5 font-mono font-bold">${inv.amount.toLocaleString()}</td>
                    <td className="py-4 px-5 text-slate-500">{format(new Date(inv.issueDate), 'MMM dd, yyyy')}</td>
                    <td className="py-4 px-5 text-slate-500">{format(new Date(inv.dueDate), 'MMM dd, yyyy')}</td>
                    <td className="py-4 px-5">
                      <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'destructive' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handlePrintPDF(inv)}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-800 rounded-full text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer inline-flex ml-auto"
                        title="Print / Download PDF"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <GenerateInvoiceModal onClose={() => setIsModalOpen(false)} onGenerate={handlePrintPDF} />
      )}

      {/* Printable template container, only visible when window.print() is active */}
      {activePrintInvoice && (
        <div id="invoice-print-section" className="p-16 font-sans text-slate-800 bg-white">
          <div className="flex justify-between items-start border-b pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">TRANSITOPS</h1>
              <p className="text-sm text-slate-500 mt-1">Enterprise Fleet Operations & Logistics</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-slate-900">INVOICE</h2>
              <p className="font-mono text-sm font-semibold mt-1">{activePrintInvoice.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
              <p className="font-bold text-slate-900 text-base">{state.customers.find(c => c.id === activePrintInvoice.customerId)?.name || 'Valued Client'}</p>
              <p className="text-sm text-slate-600 mt-1">{state.customers.find(c => c.id === activePrintInvoice.customerId)?.email}</p>
              <p className="text-sm text-slate-600">{state.customers.find(c => c.id === activePrintInvoice.customerId)?.phone}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Invoice Details</h3>
              <p className="text-sm"><span className="text-slate-500">Date Issued:</span> <span className="font-semibold">{format(new Date(activePrintInvoice.issueDate), 'MMMM dd, yyyy')}</span></p>
              <p className="text-sm"><span className="text-slate-500">Due Date:</span> <span className="font-semibold">{format(new Date(activePrintInvoice.dueDate), 'MMMM dd, yyyy')}</span></p>
              <p className="text-sm"><span className="text-slate-500">Status:</span> <span className="font-bold uppercase text-amber-600">{activePrintInvoice.status}</span></p>
            </div>
          </div>

          {activePrintInvoice.tripId && (() => {
            const trip = state.trips.find(t => t.id === activePrintInvoice.tripId);
            return trip ? (
              <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Linked Transit Run</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 block">Route</span>
                    <span className="font-bold text-slate-900">{trip.source} ➔ {trip.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Planned Distance</span>
                    <span className="font-mono font-bold text-slate-900">{trip.plannedDistance} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cargo Weight</span>
                    <span className="font-mono font-bold text-slate-900">{trip.cargoWeight} kg</span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          <div className="border-t pt-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Description</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-4">
                    <p className="font-bold text-slate-950">Logistics & Transit Services</p>
                    <p className="text-slate-500 text-xs mt-0.5">Fixed freight dispatch billing run.</p>
                  </td>
                  <td className="py-4 text-right font-mono font-bold text-slate-900">${activePrintInvoice.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold text-slate-900 text-right">Total Due</td>
                  <td className="py-4 text-right font-mono font-extrabold text-slate-900 text-lg">${activePrintInvoice.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-20 border-t pt-8 text-center text-xs text-slate-400">
            <p>Thank you for partnering with TransitOps. Terms: Due within 14 days of issue.</p>
            <p className="mt-1">For support, please contact billing@transitops.com.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function GenerateInvoiceModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: (invoice: Invoice) => void }) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    customerId: '',
    tripId: '',
    amount: 0,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Pending' as const,
  });

  const handleTripChange = (tripId: string) => {
    const selectedTrip = state.trips.find(t => t.id === tripId);
    // Auto-calculate an amount if trip has a planned distance (e.g. $5/km)
    const amount = selectedTrip ? (selectedTrip.plannedDistance || 100) * 5 : 0;
    setFormData({
      ...formData,
      tripId,
      amount,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData
    };
    dispatch({
      type: 'ADD_INVOICE',
      payload: newInvoice
    });
    onGenerate(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="soft-card w-full max-w-md backdrop-blur-[20px] bg-white/60 overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-transparent/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white rounded-3xl text-accent">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Generate Invoice</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Select Client</label>
            <select required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
              <option value="" disabled>Select client</option>
              {state.customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Link to Transit Run (Trip)</label>
            <select value={formData.tripId} onChange={e => handleTripChange(e.target.value)} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
              <option value="">Manual Entry (No linked trip)</option>
              {state.trips.map(t => (
                <option key={t.id} value={t.id}>{t.source} ➔ {t.destination} ({t.status})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Issue Date</label>
              <input required type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Due Date</label>
              <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Billing Amount ($)</label>
            <input required type="number" min="1" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/60 mt-4">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer text-white">
              <Check className="w-4 h-4" /> Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

