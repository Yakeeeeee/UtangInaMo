
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Trash2, 
  DollarSign, 
  Calendar, 
  X,
  ChevronRight
} from 'lucide-react';
import { 
  Loan, 
  Borrower, 
  Lender, 
  Payment, 
  InterestType, 
  InterestFrequency, 
  LoanStatus 
} from '../types';
import { 
  computeLoanMetrics, 
  formatCurrency, 
  formatDate 
} from '../utils/calculations';

interface LoanManagerProps {
  loans: Loan[];
  borrowers: Borrower[];
  lenders: Lender[];
  payments: Payment[];
  addLoan: (l: Omit<Loan, 'id'>) => void;
  deleteLoan: (id: string) => void;
  onViewLoan: (loan: Loan) => void;
}

const LoanManager: React.FC<LoanManagerProps> = ({ 
  loans, borrowers, lenders, payments, addLoan, deleteLoan, onViewLoan 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    lenderId: lenders[0]?.id || '',
    borrowerId: '',
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

  const filteredLoans = loans.filter(l => {
    const b = borrowers.find(b => b.id === l.borrowerId);
    return b?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.borrowerId || formData.principalAmount <= 0) return;
    
    // Convert empty string to undefined for optional dueDate
    const submissionData = {
      ...formData,
      dueDate: formData.dueDate || undefined
    };
    
    addLoan(submissionData);
    setIsAdding(false);
  };

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.PAID:
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">PAID</span>;
      case LoanStatus.OVERDUE:
        return <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">OVERDUE</span>;
      case LoanStatus.ONGOING:
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">ONGOING</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Loans</h2>
          <p className="text-slate-500">Track current and past loan agreements.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Create New Loan</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by borrower name..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            No loans found. Create one to get started.
          </div>
        ) : (
          filteredLoans.map(loan => {
            const borrower = borrowers.find(b => b.id === loan.borrowerId);
            const loanPayments = payments.filter(p => p.loanId === loan.id);
            const metrics = computeLoanMetrics(loan, loanPayments);

            return (
              <div 
                key={loan.id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-indigo-300 transition-all cursor-pointer group"
                onClick={() => onViewLoan(loan)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{borrower?.fullName || 'Unknown'}</h4>
                      <p className="text-xs text-slate-400">ID: {loan.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    {getStatusBadge(metrics.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Principal</p>
                      <p className="font-semibold">{formatCurrency(loan.principalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Balance</p>
                      <p className="font-bold text-indigo-600">{formatCurrency(metrics.remainingBalance)}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 space-x-2">
                    <Calendar size={14} />
                    <span>Due: {loan.dueDate ? formatDate(loan.dueDate) : 'No set date'}</span>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 flex justify-between items-center group-hover:bg-indigo-50 transition-colors">
                  <span className="text-xs font-bold text-slate-500 uppercase group-hover:text-indigo-600">View Details</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">New Loan Agreement</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateLoan} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Borrower</label>
                  <select 
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.borrowerId}
                    onChange={(e) => setFormData({ ...formData, borrowerId: e.target.value })}
                  >
                    <option value="">Select a borrower...</option>
                    {borrowers.map(b => <option key={b.id} value={b.id}>{b.fullName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Principal Amount (PHP)</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.principalAmount}
                    onChange={(e) => setFormData({ ...formData, principalAmount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Loan Date</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.loanDate}
                    onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Due Date (Optional)</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-indigo-900">Interest Settings</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.interest.enabled}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        interest: { ...formData.interest, enabled: e.target.checked, type: e.target.checked ? InterestType.PERCENT : InterestType.NONE } 
                      })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {formData.interest.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-indigo-700 mb-1 uppercase">Type</label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm"
                        value={formData.interest.type}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          interest: { ...formData.interest, type: e.target.value as InterestType } 
                        })}
                      >
                        <option value={InterestType.PERCENT}>Percentage</option>
                        <option value={InterestType.FIXED}>Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-indigo-700 mb-1 uppercase">
                        {formData.interest.type === InterestType.PERCENT ? 'Rate (%)' : 'Amount (PHP)'}
                      </label>
                      <input 
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm"
                        value={formData.interest.value}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          interest: { ...formData.interest, value: Number(e.target.value) } 
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-indigo-700 mb-1 uppercase">Frequency</label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm"
                        value={formData.interest.frequency}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          interest: { ...formData.interest, frequency: e.target.value as InterestFrequency } 
                        })}
                      >
                        <option value={InterestFrequency.DAILY}>Daily</option>
                        <option value={InterestFrequency.WEEKLY}>Weekly</option>
                        <option value={InterestFrequency.MONTHLY}>Monthly</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManager;
