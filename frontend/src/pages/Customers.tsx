import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, Mail, Phone, TrendingUp, Building2, User, Check, X, Edit, Trash2 } from 'lucide-react';
import { Customer } from '../types';
import { cn } from '../lib/utils';
import { Badge } from '../components/Badge';

export function Customers() {
  const { state, dispatch } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = state.customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 selection:bg-accent/20">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 soft-card p-5">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search clients or contact person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm soft-input font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex-1 sm:flex-initial cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="soft-card p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f4f6f9] border border-white/60 flex items-center justify-center text-slate-900 group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">{customer.name}</h3>
                  <Badge variant={customer.status === 'Active' ? 'success' : customer.status === 'Lead' ? 'warning' : 'default'} className="mt-1">
                    {customer.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingCustomer(customer)} 
                  className="p-1 hover:bg-[#f4f6f9] rounded-lg text-slate-500 hover:text-black cursor-pointer"
                  title="Edit Client"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => dispatch({ type: 'DELETE_CUSTOMER', payload: customer.id })} 
                  className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Client"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white/50 p-2 rounded-2xl border border-white/40">
                <User className="w-4 h-4 text-slate-400" />
                {customer.contactPerson}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white/50 p-2 rounded-2xl border border-white/40">
                <Mail className="w-4 h-4 text-slate-400" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white/50 p-2 rounded-2xl border border-white/40">
                <Phone className="w-4 h-4 text-slate-400" />
                {customer.phone}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
              <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                ${customer.totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm font-semibold text-slate-400">
            No registered clients found.
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddCustomerModal onClose={() => setIsModalOpen(false)} />
      )}

      {editingCustomer && (
        <EditCustomerModal customer={editingCustomer} onClose={() => setEditingCustomer(null)} />
      )}
    </div>
  );
}

function AddCustomerModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'Active' as Customer['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_CUSTOMER',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        totalRevenue: 0,
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
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold font-display text-slate-900">Add New Client</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Company Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Contact Person</label>
              <input required type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Phone</label>
                <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Customer['status']})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/60 mt-4">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer">
              <Check className="w-4 h-4" /> Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditCustomerModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: customer.name,
    contactPerson: customer.contactPerson,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    totalRevenue: customer.totalRevenue,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_CUSTOMER',
      payload: {
        id: customer.id,
        ...formData
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
            <h2 className="text-lg font-bold font-display text-slate-900">Update Client Details</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white rounded-3xl text-slate-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm font-medium">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Company Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Contact Person</label>
              <input required type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Phone</label>
                <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Customer['status']})} className="w-full px-3.5 py-2.5 soft-input font-medium cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">Total Revenue ($)</label>
                <input required type="number" min="0" value={formData.totalRevenue} onChange={e => setFormData({...formData, totalRevenue: parseFloat(e.target.value) || 0})} className="w-full px-3.5 py-2.5 soft-input font-medium" />
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/60 mt-4">
            <button type="button" onClick={onClose} className="px-4.5 py-2.5 soft-button-secondary font-semibold text-xs uppercase tracking-wider cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4.5 py-2.5 soft-button font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer">
              <Check className="w-4 h-4" /> Update Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
