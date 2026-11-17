import type { Request, Response, NextFunction } from 'express'
import { attendanceService } from './attendance.service.js'

export const attendanceController = {
  /**
   * Hardware Ingestion Webhook / Terminal Push Endpoint
   * Devices (ZKTeco, Hikvision, IoT RFID scanners) send punch events here
   */
  async handleHardwarePunch(req: Request, res: Response, next: NextFunction) {
    try {
      const { deviceId, punchTime, punchType, biometricUserId, employeeCode, verifyMode, apiKey } = req.body

      if (!deviceId || !punchTime || !punchType) {
        return res.status(400).json({
          success: false,
          message: 'Missing required hardware payload parameters (deviceId, punchTime, punchType).'
        })
      }

      const updatedRecord = await attendanceService.recordHardwarePunch({
        deviceId,
        deviceName: req.body.deviceName || 'Biometric Terminal',
        employeeCode: employeeCode || biometricUserId,
        userId: req.body.userId,
        punchTime: new Date(punchTime),
        punchType,
        verifyMode: verifyMode || 'FINGERPRINT',
        rawPayload: req.body
      })

      res.status(200).json({
        success: true,
        message: 'Hardware punch processed and attendance updated successfully.',
        data: updatedRecord
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Get authenticated user's attendance status for today
   */
  async getTodayAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0]
      const attendance = await attendanceService.getDailyAttendance(userId, date)

      res.status(200).json({
        success: true,
        data: attendance
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * Get authenticated user's attendance history
   */
  async getAttendanceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const limit = parseInt(req.query.limit as string) || 30
      const history = await attendanceService.getHistory(userId, limit)

      res.status(200).json({
        success: true,
        data: history
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * List connected attendance hardware devices
   */
  async listDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const devices = await attendanceService.getDevices()
      res.status(200).json({
        success: true,
        data: devices
      })
    } catch (error) {
      next(error)
    }
  }
}

export default attendanceController
