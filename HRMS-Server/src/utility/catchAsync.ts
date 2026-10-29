import type { Request, Response, NextFunction, RequestHandler } from 'express'

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(err => next(err))
  }
}

export default catchAsync
