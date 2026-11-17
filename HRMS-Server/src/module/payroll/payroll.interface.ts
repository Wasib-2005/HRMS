export interface IPayrollInquiry {
  senderEmail: string;
  category: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: Date;
}

export interface IPayslipRecord {
  _id?: string;
  employeeEmail: string;
  employeeName: string;
  employeeId?: string;
  designation: string;
  department: string;
  periodKey: string;
  periodLabel: string;
  payDate: string;
  currency: string;
  netTakeHome: number;
  grossEarnings: number;
  totalDeductions: number;
  differenceVsPrev: string;
  percentageDiff: string;
  whatChangedSummary: string;
  changes: {
    item: string;
    prevAmount: string;
    currAmount: string;
    effectText: string;
    effectType: 'positive' | 'negative' | 'neutral';
  }[];
  prevNet: string;
  currNet: string;
  netEffect: string;
  formulaNote1: string;
  formulaNote2: string;
  earnings: { name: string; amount: string }[];
  deductions: {
    name: string;
    amount: string;
    calcDetails?: string[];
    subnote?: string;
  }[];
  bankAccount: string;
  status: 'PAID' | 'PENDING';
  inquiries: IPayrollInquiry[];
  createdAt?: Date;
  updatedAt?: Date;
}
