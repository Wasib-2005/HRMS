// shift.model.ts
import { Schema, model, Query } from 'mongoose'
import type { ShiftInterface } from './shift.interface.js'

const shiftSchema = new Schema<ShiftInterface>(
  {
    shiftTitle: {
      type: String,
      required: [true, 'shiftTitle is required'],
      trim: true,
      index: true
    },
    startAt: {
      type: String,
      required: [true, 'startAt is required'],
      trim: true
    },
    endAt: {
      type: String,
      required: [true, 'endAt is required'],
      trim: true
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'department is required'],
      index: true
    },
    offDay: {
      type: Number,
      required: [true, 'offDay is required'],
      enum: {
        values: [1, 2, 3, 4, 5, 6, 7],
        message: 'offDay must be a valid weekday between 1 and 7'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: 'status must be either active or inactive'
      },
      default: 'active',
      index: true
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required']
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

// --- SOFT DELETE MIDDLEWARE ---
shiftSchema.pre(/^find/, function (this: Query<any, ShiftInterface>, next) {
  const options = this.getOptions()
  if (!options.includeDeleted) {
    this.where({ isDeleted: false })
  }
  next()
})

const Shift = model<ShiftInterface>('Shift', shiftSchema)
export default Shift