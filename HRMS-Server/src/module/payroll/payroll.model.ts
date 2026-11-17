import mongoose, { Schema } from 'mongoose';
import type { IPayslipRecord } from './payroll.interface.js';

const inquirySchema = new Schema(
  {
    senderEmail: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'RESOLVED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const payslipSchema = new Schema<IPayslipRecord>(
  {
    employeeEmail: { type: String, required: true, trim: true, index: true },
    employeeName: { type: String, required: true },
    employeeId: { type: String, default: 'EMP-2026-084' },
    designation: { type: String, default: 'Product Designer' },
    department: { type: String, default: 'Product & Design' },
    periodKey: { type: String, required: true, index: true },
    periodLabel: { type: String, required: true },
    payDate: { type: String, required: true },
    currency: { type: String, default: 'BDT' },
    netTakeHome: { type: Number, required: true },
    grossEarnings: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    differenceVsPrev: { type: String },
    percentageDiff: { type: String },
    whatChangedSummary: { type: String },
    changes: [
      {
        item: { type: String },
        prevAmount: { type: String },
        currAmount: { type: String },
        effectText: { type: String },
        effectType: { type: String, enum: ['positive', 'negative', 'neutral'] },
      },
    ],
    prevNet: { type: String },
    currNet: { type: String },
    netEffect: { type: String },
    formulaNote1: { type: String },
    formulaNote2: { type: String },
    earnings: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
    deductions: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
        calcDetails: [{ type: String }],
        subnote: { type: String },
      },
    ],
    bankAccount: { type: String, default: 'City Bank Ltd · **** 4892' },
    status: { type: String, enum: ['PAID', 'PENDING'], default: 'PAID' },
    inquiries: [inquirySchema],
  },
  {
    timestamps: true,
  }
);

payslipSchema.index({ employeeEmail: 1, periodKey: 1 }, { unique: true });

export const Payslip =
  (mongoose.models.Payslip as mongoose.Model<IPayslipRecord>) ||
  mongoose.model<IPayslipRecord>('Payslip', payslipSchema);

export default Payslip;
