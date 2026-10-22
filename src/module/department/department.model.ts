import mongoose, { Schema } from 'mongoose'
import type { DepartmentInterface } from './department.interface.js'

const departmentSchema = new Schema<DepartmentInterface>(
  {
    dept_id: {
      type: String,
      required: [true, 'Department ID is required'],
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Department name is required'],
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
// Enforces unique department names only for active (non-deleted) records,
// allowing reuse of department names of deleted records.
departmentSchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
)

departmentSchema.index(
  { dept_id: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false, dept_id: { $type: 'string' } }
  }
)

export const generateDeptPrefix = (name: string): string => {
  if (!name) return 'DEP'
  const match = name.match(/\(([A-Za-z0-9]+)\)/)
  const parenAbbr = match?.[1]
  if (parenAbbr && parenAbbr.length >= 2 && parenAbbr.length <= 6) {
    return parenAbbr.toUpperCase()
  }
  const sanitized = name.replace(/[^a-zA-Z0-9\s]/g, ' ').trim()
  const words = sanitized.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'DEP'
  const firstWord = words[0]
  if (words.length === 1 && firstWord) {
    const single = firstWord.toUpperCase()
    return single.length <= 3 ? single : single.slice(0, 3)
  }
  return words
    .slice(0, 5)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

export const generateUniqueDeptId = async (
  name: string,
  model?: mongoose.Model<DepartmentInterface>
): Promise<string> => {
  const targetModel = model || Department
  const prefix = generateDeptPrefix(name)
  const isDbConnected = targetModel.db?.readyState === 1

  // 1. Try 3-digit random numbers (100 - 999) e.g. "SSE-535"
  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(100 + Math.random() * 900)
    const candidate = `${prefix}-${randomNum}`
    if (!isDbConnected) {
      return candidate
    }
    const existing = await targetModel
      .findOne({ dept_id: candidate })
      .setOptions({ includeDeleted: true })
    if (!existing) {
      return candidate
    }
  }

  // 2. Fallback to 4 digits if 3-digit namespace is exhausted
  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const candidate = `${prefix}-${randomNum}`
    if (!isDbConnected) {
      return candidate
    }
    const existing = await targetModel
      .findOne({ dept_id: candidate })
      .setOptions({ includeDeleted: true })
    if (!existing) {
      return candidate
    }
  }

  return `${prefix}-${Date.now().toString().slice(-4)}`
}

// --- AUTO-GENERATE DEPT_ID MIDDLEWARE ---
departmentSchema.pre('validate', async function (next) {
  if (this.dept_id) {
    this.dept_id = this.dept_id.trim().toUpperCase()
  } else if (this.name) {
    const model = this.constructor as mongoose.Model<DepartmentInterface>
    this.dept_id = await generateUniqueDeptId(this.name, model)
  }
  next()
})

// --- SOFT DELETE MIDDLEWARE ---
departmentSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, DepartmentInterface>, next) {
    const options = this.getOptions()
    if (!options.includeDeleted) {
      this.where({ isDeleted: false })
    }
    next()
  }
)

export const Department = mongoose.model<DepartmentInterface>(
  'Department',
  departmentSchema
)
export default Department
