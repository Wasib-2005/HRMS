import { Router } from 'express'
import { departmentAssignController } from './departmentAssign.controller.js'
import { verifyUser } from '../../middlewares/verifyUser.middleware.js'
import verifyPermissions from '../../middlewares/verifyPermissions.middleware.js'

const router: Router = Router()

// --- SPECIFIC ROUTES (Must precede '/:id' to avoid parameter collisions) ---
router.get(
  '/recycle_bin',
  verifyUser,
  verifyPermissions(['readDepartmentAssign']),
  departmentAssignController.getDepartmentAssignmentRecycleBin
)

router.post(
  '/transfer',
  verifyUser,
  verifyPermissions(['transferDepartment']),
  departmentAssignController.transferDepartment
)

router.get(
  '/user/:userId',
  verifyUser,
  verifyPermissions(['readDepartmentAssign']),
  departmentAssignController.getAssignmentsByUser
)

router.get(
  '/department/:deptId',
  verifyUser,
  verifyPermissions(['readDepartmentAssign']),
  departmentAssignController.getAssignmentsByDepartment
)

// --- COLLECTION ROUTES ---
router.get(
  '/',
  verifyUser,
  verifyPermissions(['readDepartmentAssignList']),
  departmentAssignController.getAllDepartmentAssignments
)

router.post(
  '/',
  verifyUser,
  verifyPermissions(['assignDepartment']),
  departmentAssignController.assignDepartment
)

// --- SINGLE ASSIGNMENT ROUTES ---
router.get(
  '/:id',
  verifyUser,
  verifyPermissions(['readDepartmentAssign']),
  departmentAssignController.getDepartmentAssignmentById
)

router.put(
  '/:id',
  verifyUser,
  verifyPermissions(['updateDepartmentAssign']),
  departmentAssignController.updateDepartmentAssignment
)

router.delete(
  '/:id',
  verifyUser,
  verifyPermissions(['deleteDepartmentAssign']),
  departmentAssignController.deleteDepartmentAssignment
)

router.patch(
  '/:id/restore',
  verifyUser,
  verifyPermissions(['restoreDepartmentAssign']),
  departmentAssignController.restoreDepartmentAssignment
)

export const departmentAssignRoutes = router
export default router
