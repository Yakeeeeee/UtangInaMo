
export enum InterestType {
  NONE = 'NONE',
  PERCENT = 'PERCENT',
  FIXED = 'FIXED'
}

export enum InterestFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

export enum LoanStatus {
  ONGOING = 'ONGOING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  enabled: boolean;
}

export interface Lender {
  id: string;
  fullName: string;
  contactNumber: string;
  address?: string;
}

export interface Borrower {
  id: string;
  fullName: string;
  contactNumber: string;
  address?: string;
  notes?: string;
}

export interface Creditor {
  id: string;
  fullName: string;
  contactNumber: string;
  address?: string;
  notes?: string;
}

export interface InterestConfig {
  enabled: boolean;
  type: InterestType;
  value: number;
  frequency: InterestFrequency;
}

export interface Loan {
  id: string;
  lenderId: string;
  borrowerId: string;
  principalAmount: number;
  loanDate: string;
  dueDate?: string;
  interest: InterestConfig;
  fullPaymentDate?: string;
}

export interface Debt {
  id: string;
  creditorId: string;
  principalAmount: number;
  loanDate: string;
  dueDate?: string;
  interest: InterestConfig;
  fullPaymentDate?: string;
}

export interface Payment {
  id: string;
  loanId: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod?: string;
  remarks?: string;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod?: string;
  remarks?: string;
}

export interface ComputedLoanMetrics {
  periodsElapsed: number;
  totalInterest: number;
  totalPayable: number;
  totalPaid: number;
  remainingBalance: number;
  status: LoanStatus;
}
