import mongoose from 'mongoose'
import { Attendance } from './attendance.model.js'
import { AttendanceDevice } from './device.model.js'
import { User } from '../auth/user.model.js'
import type { IHardwarePunchDTO, IPunchLog } from './attendance.interface.js'

export const attendanceService = {
  /**
   * Process a punch pushed from biometric / RFID attendance hardware
   */
  async recordHardwarePunch(payload: IHardwarePunchDTO) {
    const punchDate = new Date(payload.punchTime)
    const dateStr = punchDate.toISOString().split('T')[0] // YYYY-MM-DD

    // 1. Resolve User
    let userId = payload.userId
    if (!userId && payload.employeeCode) {
      const user = await User.findOne({
        $or: [{ employeeCode: payload.employeeCode }, { email: payload.employeeCode }]
      })
      if (user) {
        userId = user._id.toString()
      }
    }

    if (!userId) {
      throw new Error(`Unable to resolve employee for code/id: ${payload.employeeCode || payload.userId}`)
    }

    // 2. Fetch or initialize today's attendance document
    let record = await Attendance.findOne({ userId, date: dateStr })
    if (!record) {
      record = new Attendance({
        userId,
        employeeCode: payload.employeeCode,
        date: dateStr,
        punches: [],
        breaks: [],
        shiftName: '09:30–18:00 · On-site',
        scheduledStart: '09:30',
        scheduledEnd: '18:00',
        scheduledUnpaidBreakMinutes: 30,
        targetWorkMinutes: 480
      })
    }

    // 3. Append Punch Log
    const newPunch: IPunchLog = {
      punchTime: punchDate,
      punchType: payload.punchType,
      deviceId: payload.deviceId,
      deviceName: payload.deviceName || 'Main Entrance Turnstile',
      verifyMode: payload.verifyMode || 'FINGERPRINT',
      rawPayload: payload.rawPayload,
      note: `${payload.punchType} recorded via ${payload.verifyMode}`
    }

    record.punches.push(newPunch)
    record.lastSyncedAt = new Date()
    record.lastDeviceName = payload.deviceName || payload.deviceId

    // 4. Update check-in and check-out timestamps
    const checkIns = record.punches
      .filter((p: IPunchLog) => p.punchType === 'CHECK_IN')
      .sort((a: IPunchLog, b: IPunchLog) => a.punchTime.getTime() - b.punchTime.getTime())

    const checkOuts = record.punches
      .filter((p: IPunchLog) => p.punchType === 'CHECK_OUT')
      .sort((a: IPunchLog, b: IPunchLog) => b.punchTime.getTime() - a.punchTime.getTime())

    const firstPunch = checkIns[0]
    if (firstPunch) {
      record.firstCheckIn = firstPunch.punchTime
    }

    const lastPunch = checkOuts[0]
    if (lastPunch) {
      record.lastCheckOut = lastPunch.punchTime
    }

    // 5. Compute Breaks
    const breakStarts = record.punches
      .filter((p: IPunchLog) => p.punchType === 'BREAK_START')
      .sort((a: IPunchLog, b: IPunchLog) => a.punchTime.getTime() - b.punchTime.getTime())

    const breakEnds = record.punches
      .filter((p: IPunchLog) => p.punchType === 'BREAK_END')
      .sort((a: IPunchLog, b: IPunchLog) => a.punchTime.getTime() - b.punchTime.getTime())

    let totalBreakMinutes = 0
    record.breaks = []

    for (let i = 0; i < breakStarts.length; i++) {
      const bStartItem = breakStarts[i]
      if (!bStartItem) continue
      const bStart = bStartItem.punchTime
      const bEndItem = breakEnds[i]
      const bEnd = bEndItem ? bEndItem.punchTime : undefined
      const duration = bEnd ? Math.max(0, Math.round((bEnd.getTime() - bStart.getTime()) / 60000)) : 0
      totalBreakMinutes += duration
      record.breaks.push({
        startTime: bStart,
        endTime: bEnd,
        durationMinutes: duration,
        isPaid: false
      })
    }

    record.totalBreakMinutes = totalBreakMinutes

    // 6. Compute Elapsed and Effective Time
    if (record.firstCheckIn) {
      const endTime = record.lastCheckOut ? record.lastCheckOut : new Date()
      const totalElapsed = Math.max(0, Math.round((endTime.getTime() - record.firstCheckIn.getTime()) / 60000))
      record.elapsedSpanMinutes = totalElapsed

      const effectiveMinutes = Math.max(0, totalElapsed - record.totalBreakMinutes)
      record.effectiveWorkedMinutes = effectiveMinutes

      const target = record.targetWorkMinutes || 480
      const diff = effectiveMinutes - target
      record.differenceMinutes = diff

      if (diff >= 0) {
        record.isOvertime = diff > 0
        record.isUndertime = false
        record.status = diff > 0 ? 'overtime' : 'on_target'
      } else {
        record.isOvertime = false
        record.isUndertime = true
        record.status = 'undertime'
      }
    }

    await record.save()
    return record
  },

  /**
   * Get attendance for a user for a specific date (defaults to today)
   */
  async getDailyAttendance(userId: string, dateStr?: string) {
    const today = dateStr || new Date().toISOString().split('T')[0]
    return await Attendance.findOne({ userId, date: today })
  },

  /**
   * Get historical records
   */
  async getHistory(userId: string, limit = 30) {
    return await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(limit)
  },

  /**
   * Register or update an attendance terminal
   */
  async registerDevice(deviceData: any) {
    return await AttendanceDevice.findOneAndUpdate(
      { deviceId: deviceData.deviceId },
      { $set: { ...deviceData, lastHeartbeat: new Date() } },
      { upsert: true, new: true }
    )
  },

  /**
   * List all registered hardware devices
   */
  async getDevices() {
    return await AttendanceDevice.find().sort({ name: 1 })
  }
}

export default attendanceService
