import { Router } from 'express'
import { attendanceController } from './attendance.controller.js'
import { verifyUser } from '../../middlewares/verifyUser.middleware.js'

const router = Router()

// Public / Machine-to-Machine hardware device punch ingestion endpoint
router.post('/device-punch', attendanceController.handleHardwarePunch)
router.post('/hardware-webhook', attendanceController.handleHardwarePunch)

// Authenticated user endpoints (requires user session)
router.get('/today', verifyUser, attendanceController.getTodayAttendance)
router.get('/history', verifyUser, attendanceController.getAttendanceHistory)
router.get('/devices', verifyUser, attendanceController.listDevices)

export const attendanceRoutes = router
export default attendanceRoutes
