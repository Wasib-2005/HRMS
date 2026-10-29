import type { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      username?: string
      permissions?: { [key: string]: boolean }
    }
  }
}

export {}
