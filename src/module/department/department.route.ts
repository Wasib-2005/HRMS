import { Router } from 'express'
import {
  createDepartmentController,
  deleteDepartmentController,
  getAllDepartmentController,
  getDepartmentByIdController,
  getDepartmentRecycleBinController,
  restoreDepartmentController,
  updateDepartmentController
} from './department.controller.js'
import { verifyUser } from '../../middlewares/verifyUser.middleware.js'
import verifyPermissions from '../../middlewares/verifyPermissions.middleware.js'

const router: Router = Router()

// --- LIST / RECYCLE BIN ROUTES ---
router.get(
  '/',
  verifyUser,
  verifyPermissions(['readDepartmentList']),
  getAllDepartmentController
)

// MUST be placed before '/:id' to prevent Express from treating 'recycle_bin' as an ID parameter
router.get(
  '/recycle_bin',
  verifyUser,
  verifyPermissions(['readDepartment']),
  getDepartmentRecycleBinController
)

// --- SINGLE DEPARTMENT ROUTES ---
router.get(
  '/:id',
  verifyUser,
  verifyPermissions(['readDepartment']),
  getDepartmentByIdController
)

router.post(
  '/',
  verifyUser,
  verifyPermissions(['createDepartment']),
  createDepartmentController
)

router.put(
  '/:id',
  verifyUser,
  verifyPermissions(['updateDepartment']),
  updateDepartmentController
)

router.delete(
  '/:id',
  verifyUser,
  verifyPermissions(['deleteDepartment']),
  deleteDepartmentController
)

router.patch(
  '/:id/restore',
  verifyUser,
  verifyPermissions(['restoreDepartment']),
  restoreDepartmentController
)

export const departmentRoutes = router
export default router
