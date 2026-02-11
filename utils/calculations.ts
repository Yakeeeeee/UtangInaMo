
import { 
  InterestType, 
  InterestFrequency, 
  LoanStatus, 
  ComputedLoanMetrics 
} from '../types';

export const getDaysDiff = (start: Date, end: Date): number => {
  const diffTime = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
};

export const calculatePeriods = (startDateStr: string, endDateStr: string, frequency: InterestFrequency): number => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const days = getDaysDiff(start, end);

  switch (frequency) {
    case InterestFrequency.DAILY:
      return days;
    case InterestFrequency.WEEKLY:
      return Math.ceil(days / 7);
    case InterestFrequency.MONTHLY:
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      return Math.max(0, months);
    default:
      return 0;
  }
};

/**
 * Generic computation engine for any financial obligation (Loan or Debt)
 */
export interface CalculatableObligation {
  principalAmount: number;
  loanDate: string;
  dueDate?: string;
  interest: {
    enabled: boolean;
    type: InterestType;
    value: number;
    frequency: InterestFrequency;
  };
  fullPaymentDate?: string;
}

export interface GenericPayment {
  amountPaid: number;
}

export const computeObligationMetrics = (
  obligation: CalculatableObligation, 
  payments: GenericPayment[], 
  currentDate: string = new Date().toISOString()
): ComputedLoanMetrics => {
  const totalPaid = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const calculationEndDate = obligation.fullPaymentDate || currentDate;
  
  const periodsElapsed = obligation.interest.enabled 
    ? calculatePeriods(obligation.loanDate, calculationEndDate, obligation.interest.frequency)
    : 0;

  let totalInterest = 0;
  if (obligation.interest.enabled) {
    if (obligation.interest.type === InterestType.PERCENT) {
      const interestPerPeriod = obligation.principalAmount * (obligation.interest.value / 100);
      totalInterest = interestPerPeriod * periodsElapsed;
    } else if (obligation.interest.type === InterestType.FIXED) {
      totalInterest = obligation.interest.value * periodsElapsed;
    }
  }

  const totalPayable = obligation.principalAmount + totalInterest;
  const remainingBalance = totalPayable - totalPaid;

  let status = LoanStatus.ONGOING;
  if (remainingBalance <= 0) {
    status = LoanStatus.PAID;
  } else if (obligation.dueDate && new Date(currentDate) > new Date(obligation.dueDate)) {
    status = LoanStatus.OVERDUE;
  }

  return {
    periodsElapsed,
    totalInterest,
    totalPayable,
    totalPaid,
    remainingBalance,
    status
  };
};

/** Compatibility alias */
export const computeLoanMetrics = computeObligationMetrics;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'No Date';
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
