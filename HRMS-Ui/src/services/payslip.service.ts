import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface PayslipRecord {
  _id: string;
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
  inquiries?: {
    senderEmail: string;
    category: string;
    message: string;
    status: 'PENDING' | 'RESOLVED';
    createdAt: string;
  }[];
}

export const payslipService = {
  /**
   * Get employee payslips list from MongoDB
   */
  async getMyPayslips(email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.get<ApiResponse<PayslipRecord[]>>(`/payslip/my-payslips${params}`);
  },

  /**
   * Get specific period payslip
   */
  async getPayslipByPeriod(periodKey: string, email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.get<ApiResponse<PayslipRecord>>(
      `/payslip/period/${encodeURIComponent(periodKey)}${params}`
    );
  },

  /**
   * Submit an inquiry to HR/Payroll regarding a payslip
   */
  async submitInquiry(data: {
    periodKey: string;
    category: string;
    message: string;
    employeeEmail?: string;
  }) {
    return apiClient.post<ApiResponse<PayslipRecord>>('/payslip/inquiry', data);
  },
};

export default payslipService;
