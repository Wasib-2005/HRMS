import type { NextFunction, Request, Response } from 'express'
import { logger } from '../utility/logger.js'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  logger.error({
    statusCode,
    message,
    stack: err.stack
  })

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message
  })
}

export default errorHandler
