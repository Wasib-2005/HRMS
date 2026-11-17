import mongoose, { Schema } from 'mongoose'
import type { AttendanceInterface, IPunchLog, IAttendanceBreak } from './attendance.interface.js'

const punchLogSchema = new Schema<IPunchLog>(
  {
    punchTime: { type: Date, required: true },
    punchType: {
      type: String,
      enum: ['CHECK_IN', 'CHECK_OUT', 'BREAK_START', 'BREAK_END'],
      required: true
    },
    deviceId: { type: String, required: true },
    deviceName: { type: String, default: 'Main Terminal' },
    verifyMode: {
      type: String,
      enum: ['FINGERPRINT', 'FACE', 'RFID_CARD', 'PASSWORD', 'MANUAL_CORRECTION'],
      default: 'FINGERPRINT'
    },
    rawPayload: { type: Schema.Types.Mixed },
    note: { type: String }
  },
  { _id: true, timestamps: false }
)

const breakSchema = new Schema<IAttendanceBreak>(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    durationMinutes: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false }
  },
  { _id: false }
)

const attendanceSchema = new Schema<AttendanceInterface>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    employeeCode: { type: String, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD

    shiftName: { type: String, default: 'Standard 09:30-18:00' },
    scheduledStart: { type: String, default: '09:30' },
    scheduledEnd: { type: String, default: '18:00' },
    scheduledUnpaidBreakMinutes: { type: Number, default: 30 },
    targetWorkMinutes: { type: Number, default: 480 }, // 8 hours

    punches: [punchLogSchema],
    firstCheckIn: { type: Date },
    lastCheckOut: { type: Date },
    breaks: [breakSchema],

    elapsedSpanMinutes: { type: Number, default: 0 },
    totalBreakMinutes: { type: Number, default: 0 },
    effectiveWorkedMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['present', 'absent', 'half_day', 'late', 'undertime', 'overtime', 'on_target'],
      default: 'present'
    },
    isOvertime: { type: Boolean, default: false },
    isUndertime: { type: Boolean, default: false },
    differenceMinutes: { type: Number, default: 0 },

    lastSyncedAt: { type: Date, default: Date.now },
    lastDeviceName: { type: String }
  },
  {
    timestamps: true
  }
)

// Ensure one attendance document per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true })

export const Attendance = (mongoose.models.Attendance as mongoose.Model<AttendanceInterface>) || mongoose.model<AttendanceInterface>('Attendance', attendanceSchema)
export default Attendance
