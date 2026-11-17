import mongoose, { Schema } from 'mongoose';
import type { ILeaveRequest, ILeaveBalance } from './leave.interface.js';

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    employeeEmail: { type: String, required: true, trim: true, index: true },
    employeeName: { type: String, required: true, trim: true },
    leaveType: {
      type: String,
      enum: ['Casual leave', 'Medical leave', 'Earned leave', 'Unpaid leave'],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    durationType: {
      type: String,
      enum: ['Full Day', 'First Half', 'Second Half'],
      default: 'Full Day',
      required: true,
    },
    workingDays: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    attachmentName: { type: String },
    attachmentUrl: { type: String },
    handoverPeer: { type: String },
    emergencyContact: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    reviewerNote: { type: String },
  },
  {
    timestamps: true,
  }
);

leaveRequestSchema.index({ employeeEmail: 1, createdAt: -1 });

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    employeeEmail: { type: String, required: true, unique: true, trim: true },
    casualRemaining: { type: Number, default: 8 },
    casualTotal: { type: Number, default: 12 },
    medicalRemaining: { type: Number, default: 6 },
    medicalTotal: { type: Number, default: 10 },
    earnedRemaining: { type: Number, default: 12 },
    earnedTotal: { type: Number, default: 18 },
  },
  {
    timestamps: true,
  }
);

export const LeaveRequest =
  (mongoose.models.LeaveRequest as mongoose.Model<ILeaveRequest>) ||
  mongoose.model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);

export const LeaveBalance =
  (mongoose.models.LeaveBalance as mongoose.Model<ILeaveBalance>) ||
  mongoose.model<ILeaveBalance>('LeaveBalance', leaveBalanceSchema);

export default LeaveRequest;
