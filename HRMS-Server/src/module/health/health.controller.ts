import type { Request, Response } from 'express'

export const healthCheckController = (req: Request, res: Response) => {
  res.json({ message: 'hems Server is running successfully!' })
}

export default healthCheckController
