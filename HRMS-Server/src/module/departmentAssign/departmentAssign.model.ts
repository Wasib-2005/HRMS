import mongoose, { Schema } from 'mongoose'
import type { DepartmentAssignInterface } from './departmentAssign.interface.js'

const departmentAssignSchema = new Schema<DepartmentAssignInterface>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required'],
      index: true
    },
    dept_id: {
      type: String,
      required: [true, 'Department ID is required'],
      trim: true,
      uppercase: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'disabled', 'transferred'],
      default: 'active',
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

// Prevent assigning the same employee to the same department with an active status
departmentAssignSchema.index(
  { user: 1, department: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false, status: 'active' }
  }
)

// --- SOFT DELETE MIDDLEWARE ---
departmentAssignSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, DepartmentAssignInterface>, next) {
    const options = this.getOptions()
    if (!options.includeDeleted) {
      this.where({ isDeleted: false })
    }
    next()
  }
)

export const DepartmentAssign = mongoose.model<DepartmentAssignInterface>(
  'DepartmentAssign',
  departmentAssignSchema
)

export default DepartmentAssign
