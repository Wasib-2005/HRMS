import type { Response } from 'express'

export interface IApiResponse<T> {
  statusCode: number
  success: boolean
  message?: string
  data?: T
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    ...(data.message !== undefined && { message: data.message }),
    ...(data.data !== undefined && { data: data.data })
  })
}

export default sendResponse
