import { Router } from 'express'
import { assetRoutes } from './module/asset/asset.route.js'
import { departmentRoutes } from './module/department/department.route.js'
import { departmentAssignRoutes } from './module/departmentAssign/departmentAssign.route.js'
import { authRoutes } from './module/auth/auth.route.js'
import { healthRoutes } from './module/health/health.route.js'

import { roleRoutes } from './module/role/role.route.js'
import holidayRoute from './module/shiftHoliday/holiday/holiday.route.js'
import shiftRouter from './module/shiftHoliday/shift/shift.route.js'
const router: Router = Router()

// Register module routes
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
