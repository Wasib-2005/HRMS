import type { CorsOptions } from 'cors'
import { envConfig } from './env.config.js'

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) return callback(null, true)

    const allowedOrigins = process.env.ALLOW_ORIGIN
      ? process.env.ALLOW_ORIGIN.split(',')
      : envConfig.allowedOrigins

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.includes('*')
    ) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

export default corsOptions
