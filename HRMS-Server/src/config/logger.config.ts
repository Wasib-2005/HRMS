import { logger } from '../utility/logger.js'

export const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  environment: process.env.NODE_ENV || 'development'
}

export { logger }
export default logger
