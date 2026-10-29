import type { Types } from 'mongoose'

export interface DepartmentAssignInterface {
  user: Types.ObjectId
  department: Types.ObjectId
  dept_id: string
  status: 'active' | 'inactive' | 'disabled' | 'transferred'

  createdAt?: Date
  createdBy?: Types.ObjectId
  updatedAt?: Date
  updatedBy?: Types.ObjectId
  isDeleted?: boolean
  deletedAt?: Date | null
  deletedBy?: Types.ObjectId | null
}

export interface IDepartmentAssignQueryOptions {
  limit?: number
  page?: number
  skip?: number
  userId?: string
  dept_id?: string
  status?: string
}
