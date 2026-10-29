import dotenv from 'dotenv'
import { betterAuth } from 'better-auth'
import { MongoClient } from 'mongodb'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import { envConfig } from './env.config.js'

dotenv.config()

const mongoURI = process.env.MONGO_URI || envConfig.mongoUri
if (!mongoURI) {
  throw new Error('MONGO_URI is not defined in the environment variables.')
}

// Create native MongoDB client instance for Better Auth
const client = new MongoClient(mongoURI)
const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  emailAndPassword: {
    enabled: true
  },
  // Allow your frontend origins + localhost:5000 for Postman testing
  trustedOrigins: process.env.ALLOW_ORIGIN
    ? process.env.ALLOW_ORIGIN.split(',')
    : ['http://localhost:5000', 'http://localhost:3000']
})

export default auth
