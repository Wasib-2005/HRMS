import mongoose, { Schema } from 'mongoose'
import { SYSTEM_ROLES } from '../../constants/roles.constant.js'

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    role: {
      type: String,
      enum: SYSTEM_ROLES,
      default: 'Employee'
    }
  },
  {
    collection: 'user', // Points to Better-Auth's user collection in MongoDB
    strict: false,
    timestamps: true
  }
)

export const User = (mongoose.models.User as mongoose.Model<any>) || mongoose.model('User', userSchema)
export default User
