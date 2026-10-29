import  { model, Query, Schema } from 'mongoose'
import type { AssetInterface } from './asset.interface.js'

const assetSchema = new Schema<AssetInterface>(
  {
    assetName: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    serialNumber: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'disabled'],
      default: 'active',
      index: true
    },
    qty: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },
    
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
)

// --- PARTIAL UNIQUE INDEX FOR SOFT DELETES ---
// Enforces unique serial numbers only for active (non-deleted) assets,
// allowing you to reuse serial numbers of deleted records.
assetSchema.index(
  { serialNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      serialNumber: { $exists: true, $ne: null },
      isDeleted: false
    }
  }
)

// --- SOFT DELETE MIDDLEWARE ---
assetSchema.pre(
  /^find/,
  function (this: Query<any, AssetInterface>, next) {
    const options = this.getOptions()
    if (!options.includeDeleted) {
      this.where({ isDeleted: false })
    }
    next()
  }
)

export const Asset = model<AssetInterface>('Asset', assetSchema)
export default Asset
