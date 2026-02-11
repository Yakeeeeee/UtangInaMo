
import React, { useState } from 'react';
import { Plus, Search, CreditCard, Calendar, X, ChevronRight, UserPlus } from 'lucide-react';
import { Debt, Creditor, DebtPayment, InterestType, InterestFrequency, LoanStatus } from '../types';
import { computeObligationMetrics, formatCurrency, formatDate } from '../utils/calculations';

interface DebtManagerProps {
  debts: Debt[];
  creditors: Creditor[];
  debtPayments: DebtPayment[];
  addDebt: (d: Omit<Debt, 'id'>) => void;
  addCreditor: (c: Omit<Creditor, 'id'>) => void;
  deleteDebt: (id: string) => void;
  onViewDebt: (debt: Debt) => void;
}

const DebtManager: React.FC<DebtManagerProps> = ({ 
  debts, creditors, debtPayments, addDebt, addCreditor, deleteDebt, onViewDebt 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingCreditor, setIsAddingCreditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    creditorId: '',
    principalAmount: 0,
    loanDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    interest: {
      enabled: false,
      type: InterestType.NONE,
      value: 0,
      frequency: InterestFrequency.MONTHLY
    }
  });

  const [creditorForm, setCreditorForm] = useState({ fullName: '', contactNumber: '', address: '' });

  const filteredDebts = debts.filter(d => {
    const c = creditors.find(cred => cred.id === d.creditorId);
    return c?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.creditorId || formData.principalAmount <= 0) return;
    
    const submissionData = {
      ...formData,
      dueDate: formData.dueDate || undefined
    };
    
    addDebt(submissionData);
    setIsAdding(false);
  };

  const handleCreateCreditor = (e: React.FormEvent) => {
    e.preventDefault();
    addCreditor(creditorForm);
    setIsAddingCreditor(false);
    setCreditorForm({ fullName: '', contactNumber: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Debts</h2>
          <p className="text-slate-500">Tracking money you owe to others.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsAddingCreditor(true)}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-200"
          >
            <UserPlus size={18} />
            <span>Add Creditor</span>
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Record New Debt</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by creditor name..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDebts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            No debt records found.
          </div>
        ) : (
          filteredDebts.map(debt => {
            const creditor = creditors.find(c => c.id === debt.creditorId);
            const dPayments = debtPayments.filter(p => p.debtId === debt.id);
            const metrics = computeObligationMetrics(debt, dPayments);

            return (
              <div 
                key={debt.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-amber-300 transition-all cursor-pointer group"
                onClick={() => onViewDebt(debt)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{creditor?.fullName || 'Unknown'}</h4>
                      <p className="text-xs text-slate-400">ID: {debt.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      metrics.status === LoanStatus.PAID ? 'bg-emerald-100 text-emerald-700' :
                      metrics.status === LoanStatus.OVERDUE ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{metrics.status}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Principal</p>
                      <p className="font-semibold">{formatCurrency(debt.principalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Balance</p>
                      <p className="font-bold text-amber-600">{formatCurrency(metrics.remainingBalance)}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 space-x-2">
                    <Calendar size={14} />
                    <span>Due: {debt.dueDate ? formatDate(debt.dueDate) : 'Flexible'}</span>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 flex justify-between items-center group-hover:bg-amber-50 transition-colors">
                  <span className="text-xs font-bold text-slate-500 uppercase group-hover:text-amber-600">View Debt Details</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-amber-600" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {isAddingCreditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">New Creditor</h3>
              <button onClick={() => setIsAddingCreditor(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateCreditor} className="p-8 space-y-4">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={creditorForm.fullName} onChange={e => setCreditorForm({...creditorForm, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Contact</label>
                <input required className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={creditorForm.contactNumber} onChange={e => setCreditorForm({...creditorForm, contactNumber: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">Save Creditor</button>
            </form>
           </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Record Personal Debt</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateDebt} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Who did you borrow from?</label>
                  <select 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                    value={formData.creditorId}
                    onChange={(e) => setFormData({ ...formData, creditorId: e.target.value })}
                  >
                    <option value="">Select a creditor...</option>
                    {creditors.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Borrowed Amount (PHP)</label>
                  <input required type="number" min="1" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.principalAmount} onChange={(e) => setFormData({ ...formData, principalAmount: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Loan Date</label>
                  <input required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.loanDate} onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Due Date (Optional)</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">Save Debt Record</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtManager;
