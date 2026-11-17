import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export type LeaveType =
  | 'Casual leave'
  | 'Medical leave'
  | 'Earned leave'
  | 'Unpaid leave';

export type DurationType = 'Full Day' | 'First Half' | 'Second Half';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveBalanceData {
  _id?: string;
  employeeEmail: string;
  casualRemaining: number;
  casualTotal: number;
  medicalRemaining: number;
  medicalTotal: number;
  earnedRemaining: number;
  earnedTotal: number;
}

export interface LeaveRequestPayload {
  employeeEmail?: string;
  employeeName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  durationType: DurationType;
  workingDays: number;
  reason: string;
  attachmentName?: string;
  attachmentUrl?: string;
  handoverPeer?: string;
  emergencyContact?: string;
}

export interface LeaveRequestRecord extends LeaveRequestPayload {
  _id: string;
  status: LeaveStatus;
  reviewerNote?: string;
  createdAt: string;
  updatedAt: string;
}

export const leaveService = {
  /**
   * Get employee leave quota balances from MongoDB
   */
  async getBalances(email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.get<ApiResponse<LeaveBalanceData>>(`/leave/balances${params}`);
  },

  /**
   * Submit a new leave request to MongoDB
   */
  async applyLeave(data: LeaveRequestPayload) {
    return apiClient.post<ApiResponse<{ request: LeaveRequestRecord; balance: LeaveBalanceData }>>(
      '/leave/apply',
      data
    );
  },

  /**
   * Get employee's submitted leave request history
   */
  async getMyRequests(email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.get<ApiResponse<LeaveRequestRecord[]>>(`/leave/my-requests${params}`);
  },
};

export default leaveService;
