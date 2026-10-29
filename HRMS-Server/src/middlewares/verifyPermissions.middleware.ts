import type { NextFunction, Request, Response } from 'express'
import type { PermissionKey } from '../constants/permissions.constant.js'
import { logger } from '../utility/logger.js'

const verifyPermissions = (requiredPermissions: PermissionKey[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = req?.permissions || {}
    const hasPermission = requiredPermissions.every(
      permission => userPermissions[permission]
    )

    logger.info({
      reqUrl: req.originalUrl,
      message: 'Verifying user permissions',
      requiredPermissions,
      userPermissions: req?.permissions || {},
      hasPermission
    })

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' })
    }
    next()
  }
}

export default verifyPermissions
