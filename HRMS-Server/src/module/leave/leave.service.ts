import { LeaveRequest, LeaveBalance } from './leave.model.js';
import type { ILeaveRequest } from './leave.interface.js';

export const leaveService = {
  /**
   * Get employee leave balance, seeding default quota if empty
   */
  async getBalances(employeeEmail: string) {
    let balance = await LeaveBalance.findOne({ employeeEmail });

    if (!balance) {
      balance = await LeaveBalance.create({
        employeeEmail,
        casualRemaining: 8,
        casualTotal: 12,
        medicalRemaining: 6,
        medicalTotal: 10,
        earnedRemaining: 12,
        earnedTotal: 18,
      });
    }

    return balance;
  },

  /**
   * Create a new leave request in MongoDB
   */
  async createRequest(data: Omit<ILeaveRequest, '_id' | 'status' | 'createdAt' | 'updatedAt'>) {
    // Check balance
    const balance = await this.getBalances(data.employeeEmail);

    const request = new LeaveRequest({
      ...data,
      status: 'PENDING',
    });

    const saved = await request.save();

    // Optionally deduct balance preview or hold quota
    return {
      request: saved,
      balance,
    };
  },

  /**
   * Get employee's submitted leave requests
   */
  async getMyRequests(employeeEmail: string) {
    return LeaveRequest.find({ employeeEmail }).sort({ createdAt: -1 });
  },

  /**
   * Get all organization leave requests (for HR / Admin)
   */
  async getAllRequests() {
    return LeaveRequest.find().sort({ createdAt: -1 });
  },
};

export default leaveService;
