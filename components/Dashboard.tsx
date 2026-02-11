
import React from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  CircleDollarSign, 
  HandCoins, 
  ShieldCheck,
  CreditCard,
  Scale
} from 'lucide-react';
import { Loan, Payment, LoanStatus, Debt, DebtPayment } from '../types';
import { computeObligationMetrics, formatCurrency } from '../utils/calculations';

interface DashboardProps {
  loans: Loan[];
  payments: Payment[];
  debts: Debt[];
  debtPayments: DebtPayment[];
}

const Dashboard: React.FC<DashboardProps> = ({ loans, payments, debts, debtPayments }) => {
  const lentMetrics = loans.reduce((acc, loan) => {
    const loanPayments = payments.filter(p => p.loanId === loan.id);
    const m = computeObligationMetrics(loan, loanPayments);
    acc.totalLent += loan.principalAmount;
    acc.totalCollected += m.totalPaid;
    acc.outstandingReceivable += m.remainingBalance;
    if (m.status === LoanStatus.OVERDUE) acc.overdueCount += 1;
    return acc;
  }, { totalLent: 0, totalCollected: 0, outstandingReceivable: 0, overdueCount: 0 });

  const owedMetrics = debts.reduce((acc, debt) => {
    const dPayments = debtPayments.filter(p => p.debtId === debt.id);
    const m = computeObligationMetrics(debt, dPayments);
    acc.totalBorrowed += debt.principalAmount;
    acc.totalPaidBack += m.totalPaid;
    acc.outstandingPayable += m.remainingBalance;
    if (m.status === LoanStatus.OVERDUE) acc.overdueCount += 1;
    return acc;
  }, { totalBorrowed: 0, totalPaidBack: 0, outstandingPayable: 0, overdueCount: 0 });

  const netBalance = lentMetrics.outstandingReceivable - owedMetrics.outstandingPayable;

  const cards = [
    { label: 'Net Position', value: formatCurrency(netBalance), icon: Scale, color: netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600', bg: netBalance >= 0 ? 'bg-emerald-100' : 'bg-rose-100' },
    { label: 'Receivables (Lent)', value: formatCurrency(lentMetrics.outstandingReceivable), icon: HandCoins, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Payables (Owed)', value: formatCurrency(owedMetrics.outstandingPayable), icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const recentTransactions = [
    ...payments.map(p => ({ ...p, type: 'INCOME', label: 'Payment Received' })),
    ...debtPayments.map(p => ({ ...p, type: 'EXPENSE', label: 'Payment Sent' }))
  ].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of your financial standing and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
              <h3 className={`text-2xl font-bold mt-2 ${card.color}`}>{card.value}</h3>
            </div>
            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No activity recorded yet.</div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className={`${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} p-2 rounded-full`}>
                      <TrendingUp size={16} className={tx.type === 'EXPENSE' ? 'rotate-180' : ''} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{formatCurrency(tx.amountPaid)}</p>
                      <p className="text-xs text-slate-500">{tx.label} • {new Date(tx.paymentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6">Lending Stats</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
               <span className="text-slate-500">Total Money Lent</span>
               <span className="font-bold">{formatCurrency(lentMetrics.totalLent)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
               <span className="text-slate-500">Total Borrowed</span>
               <span className="font-bold">{formatCurrency(owedMetrics.totalBorrowed)}</span>
            </div>
            <div className="flex justify-between items-center text-rose-600">
               <span className="font-medium">Overdue Accounts</span>
               <span className="font-bold">{lentMetrics.overdueCount + owedMetrics.overdueCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
