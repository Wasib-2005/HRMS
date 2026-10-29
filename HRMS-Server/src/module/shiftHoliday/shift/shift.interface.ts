import type { Types } from 'mongoose'

export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type ShiftStatus = 'active' | 'inactive'

export interface ShiftInterface {
  shiftTitle: string
  startAt: string // "HH:mm" (24h)
  endAt: string // "HH:mm" (24h)
  department: Types.ObjectId
  offDay: WeekDay // 1–7
  status: ShiftStatus

  // Audit & Soft Delete Fields
  updatedBy?: Types.ObjectId
  createdBy: Types.ObjectId
  isDeleted: boolean
  deletedAt?: Date | null
  deletedBy?: Types.ObjectId | null

  // Mongoose Timestamps
  createdAt?: Date
  updatedAt?: Date
}
