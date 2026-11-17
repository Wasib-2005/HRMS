import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';
import { AttendanceRecord, AttendanceDevice, PunchType, VerifyMode } from '@/types/attendance.types';

export const attendanceService = {
  /**
   * Get user's attendance for today
   */
  async getToday(date?: string) {
    const params = date ? `?date=${encodeURIComponent(date)}` : '';
    return apiClient.get<ApiResponse<AttendanceRecord>>(`/attendance/today${params}`);
  },

  /**
   * Get attendance logs history
   */
  async getHistory(limit = 30) {
    return apiClient.get<ApiResponse<AttendanceRecord[]>>(`/attendance/history?limit=${limit}`);
  },

  /**
   * List connected hardware devices
   */
  async getDevices() {
    return apiClient.get<ApiResponse<AttendanceDevice[]>>('/attendance/devices');
  },

  /**
   * Simulate or send a hardware punch event
   */
  async pushHardwarePunch(data: {
    deviceId: string;
    deviceName?: string;
    punchTime: string;
    punchType: PunchType;
    verifyMode?: VerifyMode;
    employeeCode?: string;
    userId?: string;
  }) {
    return apiClient.post<ApiResponse<AttendanceRecord>>('/attendance/device-punch', data);
  }
};

export default attendanceService;
