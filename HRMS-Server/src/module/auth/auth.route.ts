import { Router } from 'express'
import { getMeController, betterAuthHandler } from './auth.controller.js'

const router = Router()

router.get('/me', getMeController)

export const authRoutes = router
export { betterAuthHandler }
export default router
