export type LeaveType =
  | 'Casual leave'
  | 'Medical leave'
  | 'Earned leave'
  | 'Unpaid leave';

export type DurationType = 'Full Day' | 'First Half' | 'Second Half';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ILeaveRequest {
  _id?: string | undefined;
  employeeEmail: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  durationType: DurationType;
  workingDays: number;
  reason: string;
  attachmentName?: string | undefined;
  attachmentUrl?: string | undefined;
  handoverPeer?: string | undefined;
  emergencyContact?: string | undefined;
  status: LeaveStatus;
  reviewerNote?: string | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface ILeaveBalance {
  _id?: string | undefined;
  employeeEmail: string;
  casualRemaining: number;
  casualTotal: number;
  medicalRemaining: number;
  medicalTotal: number;
  earnedRemaining: number;
  earnedTotal: number;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}
