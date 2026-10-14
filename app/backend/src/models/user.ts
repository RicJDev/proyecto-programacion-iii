import mongoose, { Schema } from 'mongoose'
import { IUser } from '@/types'

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
})

export default mongoose.model<IUser>('User', userSchema)
