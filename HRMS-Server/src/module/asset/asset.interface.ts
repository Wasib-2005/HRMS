import type { Types } from 'mongoose'

export interface AssetInterface {
  assetName: string
  description?: string
  status: 'active' | 'inactive' | 'disabled'
  serialNumber?: string
  qty?: number

  createdAt?: Date
  createdBy?: Types.ObjectId
  updatedAt?: Date
  updatedBy?: Types.ObjectId
  isDeleted?: boolean
  deletedAt?: Date
  deletedBy?: Types.ObjectId
}

export interface IAssetQueryOptions {
  limit?: number
  page?: number
  skip?: number
}
