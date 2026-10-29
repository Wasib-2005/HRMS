import { Schema, model, Query } from 'mongoose'
import type { HolidayInterface } from './holiday.interface.js'

const holidaySchema = new Schema<HolidayInterface>(
  {
    titleEn: {
      type: String,
      required: [true, 'titleEn is required'],
      trim: true,
      index: true
    },
    titleBn: {
      type: String,
      required: [true, 'titleBn is required'],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'startDate is required']
    },
    endDate: {
      type: Date,
      required: [true, 'endDate is required']
    },
    type: {
      type: String,
      required: [true, 'type is required']
    },
    notes: {
      type: String,
      trim: true
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

// --- SOFT DELETE MIDDLEWARE ---
holidaySchema.pre(/^find/, function (this: Query<any, HolidayInterface>, next) {
  const options = this.getOptions()
  if (!options.includeDeleted) {
    this.where({ isDeleted: false })
  }
  next()
})

const Holiday = model<HolidayInterface>('Holiday', holidaySchema)
export default Holiday
