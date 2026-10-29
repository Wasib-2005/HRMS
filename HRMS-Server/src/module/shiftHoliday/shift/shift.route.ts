// shift.router.ts
import { Router } from 'express'
import verifyUserMiddleware from '../../../middlewares/verifyUser.middleware.js'
import { verifyPermissions } from '../../../middlewares/index.js'
import {
  createShiftController,
  createShiftsController,
  deleteShiftController,
  getAllShiftsController,
  getShiftController,
  getShiftRecycleBinController,
  restoreShiftController,
  updateShiftController
} from './shift.controller.js'

const router: Router = Router()

router.get(
  '/',
  verifyUserMiddleware,
  verifyPermissions(['readShift']),
  getAllShiftsController
)

// must stay above '/:id'
router.get(
  '/recycle-bin',
  verifyUserMiddleware,
  verifyPermissions(['readShift']),
  getShiftRecycleBinController
)

router.get(
  '/:id',
  verifyUserMiddleware,
  verifyPermissions(['readShift']),
  getShiftController
)

router.post(
  '/',
  verifyUserMiddleware,
  verifyPermissions(['createShift']),
  createShiftController
)

router.post(
  '/many',
  verifyUserMiddleware,
  verifyPermissions(['createShift']),
  createShiftsController
)

router.put(
  '/:id',
  verifyUserMiddleware,
  verifyPermissions(['updateShift']),
  updateShiftController
)

router.patch(
  '/:id/restore',
  verifyUserMiddleware,
  verifyPermissions(['restoreShift']),
  restoreShiftController
)

router.delete(
  '/:id',
  verifyUserMiddleware,
  verifyPermissions(['deleteShift']),
  deleteShiftController
)

export default router