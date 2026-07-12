import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, FileText, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '../components/Badge';
import { format } from 'date-fns';

export function Invoices() {
  const { state } = useStore();
  const [search, setSearch] = useState('');

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
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer">
            <Download className="w-4 h-4 text-slate-400" />
            Export CSV
          </button>
          <button className="flex items-center justify-center gap-2 px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer">
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
                      <button className="text-slate-400 hover:text-black font-semibold text-xs transition-colors cursor-pointer">
                        View
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
    </div>
  );
}
