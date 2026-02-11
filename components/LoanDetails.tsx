
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Clock, 
  Receipt,
  Download,
  Printer
} from 'lucide-react';
import { Loan, Borrower, Lender, Payment, LoanStatus } from '../types';
import { computeLoanMetrics, formatCurrency, formatDate } from '../utils/calculations';

interface LoanDetailsProps {
  loan: Loan;
  borrower?: Borrower;
  lender?: Lender;
  payments: Payment[];
  onBack: () => void;
  onAddPayment: (loanId: string, amount: number, date: string, method: string, remarks: string) => void;
  onDeleteLoan: (id: string) => void;
  updateLoanFullPaymentDate: (id: string, date: string | undefined) => void;
}

const LoanDetails: React.FC<LoanDetailsProps> = ({ 
  loan, borrower, lender, payments, onBack, onAddPayment, onDeleteLoan, updateLoanFullPaymentDate 
}) => {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    method: 'Cash',
    remarks: ''
  });

  const metrics = computeLoanMetrics(loan, payments);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentForm.amount <= 0) return;
    
    onAddPayment(loan.id, paymentForm.amount, paymentForm.date, paymentForm.method, paymentForm.remarks);
    
    // Check if fully paid after this payment
    const newTotalPaid = metrics.totalPaid + paymentForm.amount;
    if (newTotalPaid >= metrics.totalPayable) {
       updateLoanFullPaymentDate(loan.id, paymentForm.date);
    }

    setPaymentForm({ amount: 0, date: new Date().toISOString().split('T')[0], method: 'Cash', remarks: '' });
    setIsAddingPayment(false);
  };

  if (showContract) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center no-print">
          <button onClick={() => setShowContract(false)} className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Details</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            <Printer size={18} />
            <span>Print Contract</span>
          </button>
        </div>

        <div className="bg-white p-12 shadow-lg border border-slate-200 max-w-4xl mx-auto text-slate-800">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black uppercase tracking-widest border-b-2 border-slate-900 inline-block pb-2 mb-4">Loan Agreement</h1>
            <p className="text-sm">No: {loan.id.split('-')[0].toUpperCase()}</p>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-justify">
            <p>
              This Loan Agreement is entered into by and between <strong>{lender?.fullName || 'N/A'}</strong> (Lender) 
              and <strong>{borrower?.fullName || 'N/A'}</strong> (Borrower) of {borrower?.address || 'the address on record'}.
            </p>

            <p>
              The Lender agrees to lend the Borrower the principal amount of <strong>{formatCurrency(loan.principalAmount)}</strong> on <strong>{formatDate(loan.loanDate)}</strong>.
            </p>

            {loan.interest.enabled ? (
              <p>
                The loan shall incur interest at a rate of 
                <strong> {loan.interest.type === 'PERCENT' ? `${loan.interest.value}%` : formatCurrency(loan.interest.value)}</strong> 
                <strong> {loan.interest.frequency}</strong>, computed based on the agreed schedule.
              </p>
            ) : (
              <p>This loan shall not incur any interest.</p>
            )}

            <p>
              Interest shall be computed starting from the loan date until full settlement or until the due date of 
              <strong> {formatDate(loan.dueDate)}</strong>, whichever applies.
            </p>

            <p>
              The total payable amount shall be computed automatically by the system based on the agreed interest terms. 
              As of contract generation, the estimated total payable is <strong>{formatCurrency(metrics.totalPayable)}</strong>.
            </p>

            <p>
              The Borrower agrees to settle the remaining balance on or before <strong>{formatDate(loan.dueDate)}</strong>. 
              Failure to settle beyond the due date will mark the loan as overdue and may incur penalties.
            </p>

            <p>
              Both parties confirm that they understand and agree to the terms stated above.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-20">
            <div className="space-y-4">
              <div className="border-b border-slate-900 pt-8"></div>
              <p className="text-center font-bold">Lender Signature</p>
              <p className="text-center text-sm">{lender?.fullName}</p>
            </div>
            <div className="space-y-4">
              <div className="border-b border-slate-900 pt-8"></div>
              <p className="text-center font-bold">Borrower Signature</p>
              <p className="text-center text-sm">{borrower?.fullName}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
          <span>All Loans</span>
        </button>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowContract(true)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-200"
          >
            <FileText size={18} />
            <span>Generate Contract</span>
          </button>
          <button 
             onClick={() => {
               if(confirm('Are you sure you want to delete this loan record?')) {
                 onDeleteLoan(loan.id);
                 onBack();
               }
             }}
             className="flex items-center justify-center p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Loan Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Loan Overview</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                metrics.status === LoanStatus.PAID ? 'bg-emerald-100 text-emerald-700' :
                metrics.status === LoanStatus.OVERDUE ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {metrics.status}
              </span>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Borrower</p>
                  <p className="font-bold text-slate-900">{borrower?.fullName || 'N/A'}</p>
                  <p className="text-xs text-slate-500">{borrower?.contactNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Principal</p>
                  <p className="font-bold text-slate-900 text-xl">{formatCurrency(loan.principalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Interest Accrued</p>
                  <p className="font-bold text-indigo-600">{formatCurrency(metrics.totalInterest)}</p>
                  <p className="text-[10px] text-slate-500">{metrics.periodsElapsed} periods elapsed</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Remaining</p>
                  <p className="font-black text-rose-600 text-2xl">{formatCurrency(metrics.remainingBalance)}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="text-slate-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Started</p>
                    <p className="text-sm text-slate-900 font-semibold">{formatDate(loan.loanDate)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="text-slate-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Due Date</p>
                    <p className="text-sm text-slate-900 font-semibold">{formatDate(loan.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Receipt className="text-slate-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Payable</p>
                    <p className="text-sm text-slate-900 font-semibold">{formatCurrency(metrics.totalPayable)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Payment History</h3>
              <button 
                onClick={() => setIsAddingPayment(true)}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Plus size={16} />
                <span>Add Payment</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No payments found.</td>
                    </tr>
                  ) : (
                    payments.map(p => (
                      <tr key={p.id}>
                        <td className="px-6 py-4 text-sm text-slate-600">{formatDate(p.paymentDate)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(p.amountPaid)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{p.paymentMethod}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{p.remarks || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Interest Configuration</h4>
            {loan.interest.enabled ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Type</span>
                  <span className="text-sm font-bold text-indigo-600">{loan.interest.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Value</span>
                  <span className="text-sm font-bold text-indigo-600">
                    {loan.interest.type === 'PERCENT' ? `${loan.interest.value}%` : formatCurrency(loan.interest.value)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Frequency</span>
                  <span className="text-sm font-bold text-indigo-600">{loan.interest.frequency}</span>
                </div>
                <p className="text-xs text-slate-400 italic mt-4">* Terms are locked and cannot be changed after creation.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No interest applied to this loan.</p>
            )}
          </div>
          
          <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold mb-4 opacity-80">Collection Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>{Math.round((metrics.totalPaid / metrics.totalPayable) * 100)}% Collected</span>
                <span>{formatCurrency(metrics.totalPaid)}</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                <div 
                  className="bg-emerald-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (metrics.totalPaid / metrics.totalPayable) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAddingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Record Payment</h3>
              <button onClick={() => setIsAddingPayment(false)} className="text-slate-400 hover:text-slate-600">
                 <ArrowLeft size={24} className="rotate-90" />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-8 space-y-4">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Amount to Pay (PHP)</label>
                <input 
                  required
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Payment Date</label>
                <input 
                  required
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Payment Method</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                >
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Remarks</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetails;
