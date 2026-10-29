import dotenv from 'dotenv'

// Load environment variables first
dotenv.config()

import { app } from './app.js'
import { envConfig, connectMongoDB, logger } from './config/index.js'

// Log reload/start event for tsx watch
console.log('Server is starting / reloading...')
console.log(`Environment: ${envConfig.nodeEnv}`)
console.log(`Log Level: ${envConfig.logLevel}`)
if (envConfig.nodeEnv === 'development') {
  console.log(`Allowed Origins: ${envConfig.allowOrigin}`)
}

const PORT = envConfig.port

// Initialize Database Connection
connectMongoDB().catch(error => {
  logger.error({
    message: 'Database connection error',
    error
  })
})

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health Check: http://localhost:${PORT}/api/health`)
})

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`)
  server.close(() => {
    console.log('HTTP server closed.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

export { server }
export default server
