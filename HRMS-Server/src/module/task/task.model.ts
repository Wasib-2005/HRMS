import mongoose, { Schema } from 'mongoose';
import type { ITask } from './task.interface.js';

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['overdue', 'today', 'upcoming'],
      default: 'today',
      required: true,
    },
    dueDateLabel: { type: String, default: 'Today' },
    priority: {
      type: String,
      enum: ['High', 'Normal'],
      default: 'Normal',
      required: true,
    },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    employeeEmail: { type: String, required: true, trim: true, index: true },
    userId: { type: String },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ employeeEmail: 1, isCompleted: 1 });
taskSchema.index({ category: 1 });

export const Task =
  (mongoose.models.Task as mongoose.Model<ITask>) ||
  mongoose.model<ITask>('Task', taskSchema);

export default Task;
