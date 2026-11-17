import { Router } from 'express'
import { assetRoutes } from './module/asset/asset.route.js'
import { departmentRoutes } from './module/department/department.route.js'
import { departmentAssignRoutes } from './module/departmentAssign/departmentAssign.route.js'
import { authRoutes } from './module/auth/auth.route.js'
import { healthRoutes } from './module/health/health.route.js'
import { attendanceRoutes } from './module/attendance/attendance.route.js'
import { taskRoutes } from './module/task/task.route.js'
import { payrollRoutes } from './module/payroll/payroll.route.js'
import { dashboardRoutes } from './module/dashboard/dashboard.route.js'
import { leaveRoutes } from './module/leave/leave.route.js'
import { roleRoutes } from './module/role/role.route.js'
import holidayRoute from './module/shiftHoliday/holiday/holiday.route.js'
import shiftRouter from './module/shiftHoliday/shift/shift.route.js'

const router: Router = Router()

// Register module routes
router.use('/attendance', attendanceRoutes)
router.use('/tasks', taskRoutes)
router.use('/payslip', payrollRoutes)
router.use('/payroll', payrollRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/leave', leaveRoutes)
router.use('/roles', roleRoutes)
router.use('/assets', assetRoutes)
router.use('/holidays', holidayRoute)
router.use('/shifts', shiftRouter)

router.use('/departments', departmentRoutes)
router.use('/department-assign', departmentAssignRoutes)
router.use('/health', healthRoutes)
router.use('/', authRoutes)

export const rootRouter = router
export default router
