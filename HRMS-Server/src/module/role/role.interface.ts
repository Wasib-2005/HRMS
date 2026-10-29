import type { Types } from 'mongoose'
import type { PermissionsMap } from '../../constants/permissions.constant.js'

export interface RoleInterface {
  name: string
  description: string
  status: 'active' | 'inactive' | 'disabled'
  permissions: PermissionsMap

  createdAt?: Date
  createdBy?: Types.ObjectId
  updatedAt?: Date
  updatedBy?: Types.ObjectId
  isDeleted?: boolean
  deletedAt?: Date
  deletedBy?: Types.ObjectId
}

export interface IRoleQueryOptions {
  limit?: number
  page?: number
  skip?: number
}
