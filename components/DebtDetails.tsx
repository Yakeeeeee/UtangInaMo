
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, DollarSign, Calendar, Clock, Receipt } from 'lucide-react';
import { Debt, Creditor, DebtPayment, LoanStatus } from '../types';
import { computeObligationMetrics, formatCurrency, formatDate } from '../utils/calculations';

interface DebtDetailsProps {
  debt: Debt;
  creditor?: Creditor;
  payments: DebtPayment[];
  onBack: () => void;
  onAddPayment: (debtId: string, amount: number, date: string, method: string, remarks: string) => void;
  onDeleteDebt: (id: string) => void;
  updateDebtFullPaymentDate: (id: string, date: string | undefined) => void;
}

const DebtDetails: React.FC<DebtDetailsProps> = ({ 
  debt, creditor, payments, onBack, onAddPayment, onDeleteDebt, updateDebtFullPaymentDate 
}) => {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ amount: 0, date: new Date().toISOString().split('T')[0], method: 'Cash', remarks: '' });

  const metrics = computeObligationMetrics(debt, payments);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentForm.amount <= 0) return;
    onAddPayment(debt.id, paymentForm.amount, paymentForm.date, paymentForm.method, paymentForm.remarks);
    if (metrics.totalPaid + paymentForm.amount >= metrics.totalPayable) {
       updateDebtFullPaymentDate(debt.id, paymentForm.date);
    }
    setPaymentForm({ amount: 0, date: new Date().toISOString().split('T')[0], method: 'Cash', remarks: '' });
    setIsAddingPayment(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to My Debts</span>
        </button>
        <button 
           onClick={() => { if(confirm('Delete this debt record?')) { onDeleteDebt(debt.id); onBack(); } }}
           className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">Debt to {creditor?.fullName || 'Creditor'}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                metrics.status === LoanStatus.PAID ? 'bg-emerald-100 text-emerald-700' :
                metrics.status === LoanStatus.OVERDUE ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>{metrics.status}</span>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Principal</p>
                  <p className="font-bold text-slate-900 text-xl">{formatCurrency(debt.principalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Paid</p>
                  <p className="font-bold text-emerald-600">{formatCurrency(metrics.totalPaid)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Remaining</p>
                  <p className="font-black text-amber-600 text-2xl">{formatCurrency(metrics.remainingBalance)}</p>
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">Due Date</p>
                   <p className="font-semibold text-slate-900">{formatDate(debt.dueDate)}</p>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Outgoing Payments</h3>
              <button onClick={() => setIsAddingPayment(true)} className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm">
                <Plus size={16} />
                <span>Record Payment</span>
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400">No payments recorded.</td></tr>
                ) : (
                  payments.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 text-sm">{formatDate(p.paymentDate)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(p.amountPaid)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.paymentMethod}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAddingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Record My Payment</h3>
              <button onClick={() => setIsAddingPayment(false)} className="text-slate-400 hover:text-slate-600">X</button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-8 space-y-4">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount Paid (PHP)</label>
                <input required type="number" min="1" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Payment Date</label>
                <input required type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg" value={paymentForm.date} onChange={e => setPaymentForm({...paymentForm, date: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl">Confirm Payment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtDetails;
