import mongoose from 'mongoose'
import { envConfig } from './env.config.js'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 1000

export const connectMongoDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI || envConfig.mongoUri
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in the environment variables.')
  }

  let retries = MAX_RETRIES

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(mongoURI)
      console.log(`MongoDB Connected: ${conn.connection.host}`)
      return
    } catch (error) {
      retries--
      console.error(
        `Database connection failed. Retries remaining: ${retries}`,
        error
      )

      if (retries === 0) {
        console.error('Max connection retries reached. Exiting process.')
        process.exit(1)
      }

      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }
}

export default connectMongoDB
