import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface EmployeeDashboardMetrics {
  today: {
    percentageOfDay: number;
    timeLeft: string;
    checkInTime: string;
    isCheckedIn: boolean;
    isCheckedOut: boolean;
    effectiveHours: string;
  };
  shiftOverview: {
    averageHours: string;
    averageCheckIn: string;
    onTimeArrivalRate: string;
    averageCheckOut: string;
    peerRank: string;
  };
  taskStats: {
    completedHours: number;
    targetHours: number;
    activeTasksCount: number;
    completedTasksCount: number;
    totalTasksCount: number;
    completionRate: string;
    completionText: string;
  };
  teamSchedule: {
    id: string;
    name: string;
    avatarLetter: string;
    department: string;
    attendance: {
      mon: 'I' | 'W' | 'L' | 'A' | '-';
      tue: 'I' | 'W' | 'L' | 'A' | '-';
      wed: 'I' | 'W' | 'L' | 'A' | '-';
      thu: 'I' | 'W' | 'L' | 'A' | '-';
      fri: 'I' | 'W' | 'L' | 'A' | '-';
    };
  }[];
  workingHistory: {
    date: string;
    arrival: string;
    departure: string;
    effectiveHours: string;
    targetDiff: string;
    statusType: 'undertime' | 'ontarget' | 'overtime';
  }[];
}

export const dashboardService = {
  /**
   * Get dynamic aggregated metrics for the Employee Dashboard
   */
  async getEmployeeMetrics(email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiClient.get<ApiResponse<EmployeeDashboardMetrics>>(
      `/dashboard/employee-metrics${params}`
    );
  },
};

export default dashboardService;
