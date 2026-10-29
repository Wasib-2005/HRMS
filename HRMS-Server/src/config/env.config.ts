import dotenv from 'dotenv'

dotenv.config()

export const envConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  allowOrigin: process.env.ALLOW_ORIGIN || '',
  allowedOrigins: process.env.ALLOW_ORIGIN
    ? process.env.ALLOW_ORIGIN.split(',')
    : ['http://localhost:5000', 'http://localhost:3000'],
  mongoUri: process.env.MONGO_URI || '',
  betterAuthSecret: process.env.BETTER_AUTH_SECRET || '',
  betterAuthUrl: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  isProduction: process.env.PRODUCTION === 'true' || process.env.NODE_ENV === 'production'
}

export default envConfig
