import type { Types } from 'mongoose'
import type { PermissionsMap } from '../../constants/permissions.constant.js'
import type { SystemRole } from '../../constants/roles.constant.js'

export interface RoleInterface {
  name: SystemRole | string
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
