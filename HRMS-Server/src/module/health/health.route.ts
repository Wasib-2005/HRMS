import { Router } from 'express'
import { healthCheckController } from './health.controller.js'

const router = Router()

router.get('/', healthCheckController)

export const healthRoutes = router
export default router
