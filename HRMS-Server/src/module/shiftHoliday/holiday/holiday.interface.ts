import type { Types } from 'mongoose'

export interface HolidayInterface {
  titleEn: string
  titleBn: string
  startDate: Date
  endDate: Date
  type: string
  notes?: string

  createdAt?: Date
  createdBy?: Types.ObjectId
  updatedAt?: Date
  updatedBy?: Types.ObjectId
  isDeleted?: boolean
  deletedAt?: Date
  deletedBy?: Types.ObjectId
}
