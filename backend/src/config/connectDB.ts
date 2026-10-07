import mongoose from 'mongoose'
import { config } from './index'

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(config.mongoose.url)
    console.log(`MongoDB connected to ${conn.connection.host}`)
  } catch (error) {
    console.error(`failed to connect to database: ${error}`)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err}`)
})
