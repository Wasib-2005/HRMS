import { Router } from 'express'
import {
  createRoleController,
  deleteRoleController,
  getAllRoleController,
  getRoleByIdController,
  getRoleRecycleBin,
  restoreRoleController,
  updateRoleController
} from './role.controller.js'
import { verifyUser } from '../../middlewares/verifyUser.middleware.js'
import verifyPermissions from '../../middlewares/verifyPermissions.middleware.js'

const router: Router = Router()

router.get(
  '/',
  verifyUser,
  verifyPermissions(['readRoleList']),
  getAllRoleController
)

// MUST be placed before '/:id' to prevent Express from treating 'recycle_bin' as an ID
router.get(
  '/recycle_bin',
  verifyUser,
  verifyPermissions(['readRole']),
  getRoleRecycleBin
)

router.get(
  '/:id',
  verifyUser,
  verifyPermissions(['readRole']),
  getRoleByIdController
)

router.post(
  '/',
  verifyUser,
  verifyPermissions(['createRole']),
  createRoleController
)

router.put(
  '/:id',
  verifyUser,
  verifyPermissions(['updateRole']),
  updateRoleController
)

router.delete(
  '/:id',
  verifyUser,
  verifyPermissions(['deleteRole']),
  deleteRoleController
)

router.patch(
  '/:id/restore',
  verifyUser,
  verifyPermissions(['restoreRole']),
  restoreRoleController
)

export const roleRoutes = router
export default router
