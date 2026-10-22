import type { Types } from 'mongoose'

export interface DepartmentInterface {
  dept_id?: string
  name: string
  description?: string
  status: 'active' | 'inactive' | 'disabled'

  createdAt?: Date
  createdBy?: Types.ObjectId
  updatedAt?: Date
  updatedBy?: Types.ObjectId
  isDeleted?: boolean
  deletedAt?: Date | null
  deletedBy?: Types.ObjectId | null
}

export interface IDepartmentQueryOptions {
  limit?: number
  page?: number
  skip?: number
}
