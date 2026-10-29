// --- Corrected Router Code ---
import { Router } from 'express'
import verifyUserMiddleware from '../../../middlewares/verifyUser.middleware.js'
import { verifyPermissions } from '../../../middlewares/index.js'
import {
  createHolidayController,
  createHolidaysController,
  deleteHolidayController,
  getAllHolidaysController,
  getHolidayController,
  updateHolidayController
} from './holiday.controller.js'

const router: Router = Router()

router.get(
  '/',
  verifyUserMiddleware,
  verifyPermissions(['readHoliday']),
  getAllHolidaysController
)

router.get(
  '/:id',
  verifyUserMiddleware,
  verifyPermissions(['readHoliday']),
  getHolidayController
)

router.post(
  '/',
  verifyUserMiddleware,
  verifyPermissions(['createHoliday']),
  createHolidayController
)

router.post(
  '/many',
  verifyUserMiddleware,
  verifyPermissions(['createHoliday']),
  createHolidaysController
)

router.put(
  '/:id',
  verifyUserMiddleware,
  verifyPermissions(['updateHoliday']),
  updateHolidayController
)

router.delete(
  '/:id',
  verifyUserMiddleware,
  verifyPermissions(['deleteHoliday']),
  deleteHolidayController
)

export default router
