import type { Request, Response, NextFunction } from 'express'
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node'
import { auth } from '../../config/auth.config.js'
import { authService } from './auth.service.js'

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await authService.getSession(fromNodeHeaders(req.headers))

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    res.json(session)
  } catch (error) {
    next(error)
  }
}

export const betterAuthHandler = toNodeHandler(auth)

export const authController = {
  getMe: getMeController,
  betterAuthHandler
}

export default authController
