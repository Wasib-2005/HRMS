import type { Types } from 'mongoose'

export interface AssignAssetInterface {
  asset: Types.ObjectId
  user: Types.ObjectId
  itemQty: number
  status: 'active' | 'inactive' | 'disabled' | 'assigned' | 'returned'

  createdAt?: Date
  createdBy?: Types.ObjectId
  updatedAt?: Date
  updatedBy?: Types.ObjectId
  isDeleted?: boolean
  deletedAt?: Date
  deletedBy?: Types.ObjectId
}
