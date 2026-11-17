export type PunchType = 'CHECK_IN' | 'CHECK_OUT' | 'BREAK_START' | 'BREAK_END';
export type VerifyMode = 'FINGERPRINT' | 'FACE' | 'RFID_CARD' | 'PASSWORD' | 'MANUAL_CORRECTION';
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'late' | 'undertime' | 'overtime' | 'on_target';

export interface IPunchLog {
  _id?: string;
  punchTime: string;
  punchType: PunchType;
  deviceId: string;
  deviceName: string;
  verifyMode: VerifyMode;
  note?: string;
}

export interface IAttendanceBreak {
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  isPaid: boolean;
}

export interface AttendanceRecord {
  _id?: string;
  userId: string;
  employeeCode?: string;
  date: string;
  shiftName: string;
  scheduledStart: string;
  scheduledEnd: string;
  scheduledUnpaidBreakMinutes: number;
  targetWorkMinutes: number;

  punches: IPunchLog[];
  firstCheckIn?: string;
  lastCheckOut?: string;
  breaks: IAttendanceBreak[];

  elapsedSpanMinutes: number;
  totalBreakMinutes: number;
  effectiveWorkedMinutes: number;
  status: AttendanceStatus;
  isOvertime: boolean;
  isUndertime: boolean;
  differenceMinutes: number;

  lastSyncedAt: string;
  lastDeviceName?: string;
}

export interface AttendanceDevice {
  deviceId: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'inactive';
  protocol: string;
  lastHeartbeat?: string;
}
