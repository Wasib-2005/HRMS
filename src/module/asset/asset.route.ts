import { Router } from 'express'
import {
  createAssetController,
  deleteAssetController,
  getAllAssetController,
  getAssetController,
  getAssetRecycleBinController,
  restoreAssetController,
  updateAssetController
} from './asset.controller.js'
import { verifyUser } from '../../middlewares/verifyUser.middleware.js'
import verifyPermissions from '../../middlewares/verifyPermissions.middleware.js'

const router: Router = Router()

// --- PUBLIC / LIST ROUTES ---
router.get(
  '/',
  verifyUser,
  verifyPermissions(['readAssetList']),
  getAllAssetController
)
// --- SINGLE ASSET ROUTES ---
router.get(
  '/:id',
  verifyUser,
  verifyPermissions(['readAsset']),
  getAssetController
)

// MUST be placed before '/:id' to prevent Express from treating 'recycle_bin' as an ID
router.get(
  '/recycle_bin',
  verifyUser,
  verifyPermissions(['readAsset']),
  getAssetRecycleBinController
)

router.post(
  '/',
  verifyUser,
  verifyPermissions(['createAsset']),
  createAssetController
)

router.put(
  '/:id',
  verifyUser,
  verifyPermissions(['updateAsset']),
  updateAssetController
)

router.delete(
  '/:id',
  verifyUser,
  verifyPermissions(['deleteAsset']),
  deleteAssetController
)

router.patch(
  '/:id/restore',
  verifyUser,
  verifyPermissions(['restoreAsset']),
  restoreAssetController
)

export const assetRoutes = router
export default router
