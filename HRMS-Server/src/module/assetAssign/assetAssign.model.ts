import mongoose from 'mongoose'
import type { AssignAssetInterface } from './assetAssign.interface.js'

const assetAssignSchema = new mongoose.Schema<AssignAssetInterface>(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    itemQty: {
      type: Number,
      required: true,
      min: [1, 'Item quantity must be at least 1']
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'disabled', 'assigned', 'returned'],
      default: 'assigned',
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
)

// --- SOFT DELETE MIDDLEWARE ---
assetAssignSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, AssignAssetInterface>, next) {
    const options = this.getOptions()
    if (!options.includeDeleted) {
      this.where({ isDeleted: false })
    }
    next()
  }
)

export const AssetAssign = mongoose.model<AssignAssetInterface>(
  'AssetAssign',
  assetAssignSchema
)

export default AssetAssign
