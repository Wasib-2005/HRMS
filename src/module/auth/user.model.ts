import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    role: { type: String }
  },
  {
    collection: 'user', // Points to Better-Auth's user collection in MongoDB
    strict: false,
    timestamps: true
  }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
