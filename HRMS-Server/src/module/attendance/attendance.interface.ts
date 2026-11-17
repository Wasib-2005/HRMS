import type { Types } from 'mongoose'

export type PunchType = 'CHECK_IN' | 'CHECK_OUT' | 'BREAK_START' | 'BREAK_END'
export type VerifyMode = 'FINGERPRINT' | 'FACE' | 'RFID_CARD' | 'PASSWORD' | 'MANUAL_CORRECTION'
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'late' | 'undertime' | 'overtime' | 'on_target'

export interface IPunchLog {
  _id?: Types.ObjectId
  punchTime: Date
  punchType: PunchType
  deviceId: string
  deviceName: string
  verifyMode: VerifyMode
  rawPayload?: Record<string, any> | undefined
  note?: string | undefined
}

export interface IAttendanceBreak {
  startTime: Date
  endTime?: Date | undefined
  durationMinutes: number
  isPaid: boolean
}

export interface AttendanceInterface {
  _id?: Types.ObjectId
  userId: Types.ObjectId
  employeeCode?: string
  date: string // Format: YYYY-MM-DD
  
  // Shift reference
  shiftName: string
  scheduledStart: string // e.g. "09:30"
  scheduledEnd: string   // e.g. "18:00"
  scheduledUnpaidBreakMinutes: number // e.g. 30
  targetWorkMinutes: number // e.g. 480 (8 hours)

  // Hardware Punches
  punches: IPunchLog[]
  firstCheckIn?: Date
  lastCheckOut?: Date
  breaks: IAttendanceBreak[]

  // Computed metrics from hardware punches
  elapsedSpanMinutes: number
  totalBreakMinutes: number
  effectiveWorkedMinutes: number
  status: AttendanceStatus
  isOvertime: boolean
  isUndertime: boolean
  differenceMinutes: number // Difference against target

  // Device snapshot info
  lastSyncedAt: Date
  lastDeviceName?: string

  // Audit
  createdAt?: Date
  updatedAt?: Date
}

export interface IHardwarePunchDTO {
  apiKey?: string
  deviceId: string
  deviceName: string
  employeeCode?: string
  userId?: string
  punchTime: string | Date
  punchType: PunchType
  verifyMode: VerifyMode
  rawPayload?: Record<string, any>
}
