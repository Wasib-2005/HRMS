import express from 'express'
import type { Application } from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors.config.js'
import { betterAuthHandler } from './module/auth/auth.controller.js'
import './module/auth/user.model.js'
import { rootRouter } from './routecontroller.js'
import { notFound } from './middlewares/notFound.middleware.js'
import { errorHandler } from './middlewares/errorHandler.middleware.js'

const app: Application = express()

// ==========================================
// 1. GLOBAL MIDDLEWARE
// ==========================================

// CORS Configuration
app.use(cors(corsOptions))

// Better Auth Handler (MUST BE BEFORE express.json())
app.all('/api/auth/*', betterAuthHandler)

// Body Parser
app.use(express.json())

// ==========================================
// 2. CENTRAL ROUTES
// ==========================================
app.use('/api', rootRouter)

// ==========================================
// 3. ERROR HANDLING MIDDLEWARE
// ==========================================

// 404 Handler (Catch-all for unhandled routes)
app.use(notFound)

// Global Error Handler
app.use(errorHandler)

export { app }
export default app
