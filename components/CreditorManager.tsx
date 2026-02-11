
import React, { useState } from 'react';
import { Plus, Trash2, Search, UserPlus, X } from 'lucide-react';
import { Creditor } from '../types';

interface CreditorManagerProps {
  creditors: Creditor[];
  addCreditor: (c: Omit<Creditor, 'id'>) => void;
  deleteCreditor: (id: string) => void;
}

const CreditorManager: React.FC<CreditorManagerProps> = ({ creditors, addCreditor, deleteCreditor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    address: '',
    notes: ''
  });

  const filtered = creditors.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactNumber.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.contactNumber) return;
    addCreditor(formData);
    setFormData({ fullName: '', contactNumber: '', address: '', notes: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Creditors</h2>
          <p className="text-slate-500">Manage people you owe money to.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          <span>New Creditor</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search creditors..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Address</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No creditors found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{c.fullName}</td>
                  <td className="px-6 py-4 text-slate-600 text-center">{c.contactNumber}</td>
                  <td className="px-6 py-4 text-slate-500 hidden md:table-cell truncate max-w-xs">{c.address || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        if (confirm('Deleting this creditor will remove all associated debts. Continue?')) {
                          deleteCreditor(c.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add Creditor</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                <input required type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">Create Creditor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditorManager;
