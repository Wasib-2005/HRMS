import mongoose, { Schema } from 'mongoose'

export interface IAttendanceDevice {
  deviceId: string
  name: string
  ipAddress?: string
  macAddress?: string
  location: string
  protocol: 'ADMS' | 'ICLOCK' | 'REST_WEBHOOK' | 'MQTT'
  status: 'online' | 'offline' | 'inactive'
  apiKey: string
  lastHeartbeat?: Date
  createdAt?: Date
  updatedAt?: Date
}

const deviceSchema = new Schema<IAttendanceDevice>(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    ipAddress: { type: String },
    macAddress: { type: String },
    location: { type: String, default: 'Main Office' },
    protocol: {
      type: String,
      enum: ['ADMS', 'ICLOCK', 'REST_WEBHOOK', 'MQTT'],
      default: 'REST_WEBHOOK'
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'inactive'],
      default: 'online'
    },
    apiKey: { type: String, required: true },
    lastHeartbeat: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
)

export const AttendanceDevice = (mongoose.models.AttendanceDevice as mongoose.Model<IAttendanceDevice>) || mongoose.model<IAttendanceDevice>('AttendanceDevice', deviceSchema)
export default AttendanceDevice
