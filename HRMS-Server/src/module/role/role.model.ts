import mongoose, { Schema } from 'mongoose'
import {
  PERMISSIONS_LIST,
  type PermissionKey
} from '../../constants/permissions.constant.js'
import type { RoleInterface } from './role.interface.js'

// Programmatically build the Mongoose permissions sub-object
const permissionsSchemaDefinition = PERMISSIONS_LIST.reduce(
  (acc, permission) => {
    acc[permission] = { type: Boolean, default: false }
    return acc
  },
  {} as Record<PermissionKey, { type: typeof Boolean; default: boolean }>
)

const roleSchema = new Schema<RoleInterface>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'disabled'],
      default: 'active',
      index: true
    },

    permissions: permissionsSchemaDefinition,

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

// --- PARTIAL UNIQUE INDEX FOR SOFT DELETES ---
// Enforces unique role names only for active (non-deleted) roles,
// allowing you to reuse role names of deleted records.
roleSchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
)

// --- SOFT DELETE MIDDLEWARE ---
roleSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, RoleInterface>, next) {
    const options = this.getOptions()
    if (!options.includeDeleted) {
      this.where({ isDeleted: false })
    }
    next()
  }
)

export const Role = mongoose.model<RoleInterface>('Role', roleSchema)
export default Role
