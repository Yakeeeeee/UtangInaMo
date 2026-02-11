
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BorrowerManager from './components/BorrowerManager';
import CreditorManager from './components/CreditorManager';
import LoanManager from './components/LoanManager';
import LoanDetails from './components/LoanDetails';
import DebtManager from './components/DebtManager';
import DebtDetails from './components/DebtDetails';
import Settings from './components/Settings';
import About from './components/About';
import Help from './components/Help';
import { useAppState } from './store';
import { Loan, Debt } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  
  const state = useAppState();

  const handleViewLoan = (loan: Loan) => {
    setSelectedLoanId(loan.id);
    setActiveTab('loan-details');
  };

  const handleViewDebt = (debt: Debt) => {
    setSelectedDebtId(debt.id);
    setActiveTab('debt-details');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            loans={state.loans} 
            payments={state.payments} 
            debts={state.debts} 
            debtPayments={state.debtPayments} 
          />
        );
      
      case 'borrowers':
        return (
          <BorrowerManager 
            borrowers={state.borrowers} 
            addBorrower={state.addBorrower} 
            deleteBorrower={state.deleteBorrower}
          />
        );

      case 'creditors':
        return (
          <CreditorManager 
            creditors={state.creditors} 
            addCreditor={state.addCreditor} 
            deleteCreditor={state.deleteCreditor}
          />
        );

      case 'settings':
        return (
          <Settings 
            lender={state.lenders[0]} 
            updateLender={state.updateLender}
            resetAllData={state.resetAllData}
            dbConfig={state.dbConfig}
            setDbConfig={state.setDbConfig}
            pushAllToCloud={state.pushAllToCloud}
            syncStatus={state.syncStatus}
          />
        );

      case 'help':
        return <Help />;

      case 'about':
        return <About />;

      case 'loans':
        return (
          <LoanManager 
            loans={state.loans}
            borrowers={state.borrowers}
            lenders={state.lenders}
            payments={state.payments}
            addLoan={state.addLoan}
            deleteLoan={state.deleteLoan}
            onViewLoan={handleViewLoan}
          />
        );

      case 'loan-details':
        if (!selectedLoanId) { setActiveTab('loans'); return null; }
        const loan = state.loans.find(l => l.id === selectedLoanId);
        if (!loan) { setActiveTab('loans'); return null; }
        const borrower = state.borrowers.find(b => b.id === loan.borrowerId);
        const lender = state.lenders.find(l => l.id === loan.lenderId);
        const loanPayments = state.payments.filter(p => p.loanId === loan.id);
        return (
          <LoanDetails 
            loan={loan} borrower={borrower} lender={lender} payments={loanPayments}
            onBack={() => setActiveTab('loans')}
            onAddPayment={(loanId, amount, date, method, remarks) => state.addPayment({ loanId, amountPaid: amount, paymentDate: date, paymentMethod: method, remarks })}
            onDeleteLoan={state.deleteLoan}
            updateLoanFullPaymentDate={state.updateLoanFullPaymentDate}
          />
        );

      case 'debts':
        return (
          <DebtManager 
            debts={state.debts}
            creditors={state.creditors}
            debtPayments={state.debtPayments}
            addDebt={state.addDebt}
            addCreditor={state.addCreditor}
            deleteDebt={state.deleteDebt}
            onViewDebt={handleViewDebt}
          />
        );

      case 'debt-details':
        if (!selectedDebtId) { setActiveTab('debts'); return null; }
        const debt = state.debts.find(d => d.id === selectedDebtId);
        if (!debt) { setActiveTab('debts'); return null; }
        const creditor = state.creditors.find(c => c.id === debt.creditorId);
        const payments = state.debtPayments.filter(p => p.debtId === debt.id);
        return (
          <DebtDetails 
            debt={debt} creditor={creditor} payments={payments}
            onBack={() => setActiveTab('debts')}
            onAddPayment={(debtId, amount, date, method, remarks) => state.addDebtPayment({ debtId, amountPaid: amount, paymentDate: date, paymentMethod: method, remarks })}
            onDeleteDebt={state.deleteDebt}
            updateDebtFullPaymentDate={state.updateDebtFullPaymentDate}
          />
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} syncStatus={state.syncStatus}>
      {renderContent()}
    </Layout>
  );
};

export default App;
