import type { NextFunction, Request, Response } from 'express'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export default notFound
