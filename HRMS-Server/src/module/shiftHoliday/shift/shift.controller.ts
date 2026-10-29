import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import Shift from './shift.model.js'
import { logger } from '../../../config/index.js'

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/
const STATUSES = ['active', 'inactive']

const validateShiftFields = (data: Record<string, any>): string | null => {
  if (data.startAt !== undefined && !TIME_REGEX.test(data.startAt)) {
    return 'startAt must be in HH:mm (24h) format.'
  }
  if (data.endAt !== undefined && !TIME_REGEX.test(data.endAt)) {
    return 'endAt must be in HH:mm (24h) format.'
  }
  if (data.offDay !== undefined) {
    const offDay = Number(data.offDay)
    if (!Number.isInteger(offDay) || offDay < 1 || offDay > 7) {
      return 'offDay must be an integer between 1 and 7.'
    }
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    return 'status must be either active or inactive.'
  }
  return null
}

const badRequest = (message: string, statusCode = 400) => {
  const error: any = new Error(message)
  error.statusCode = statusCode
  return error
}

export const getAllShiftsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username

    const {
      department,
      offDay,
      status,
      shiftTitle,
      limit: limitQuery,
      page: pageQuery
    } = req.query

    logger.info({
      message: 'Fetching shifts with filters',
      userId,
      username,
      department,
      offDay,
      status,
      shiftTitle
    })

    const filter: Record<string, any> = {}

    if (department) filter.department = department
    if (offDay) filter.offDay = parseInt(offDay as string)
    if (status) filter.status = status
    if (shiftTitle) {
      filter.shiftTitle = { $regex: shiftTitle as string, $options: 'i' }
    }

    let query = Shift.find(filter)
      .populate('department')
      .sort({ createdAt: -1 })

    // --- Optional Pagination ---
    const hasPagination = limitQuery !== undefined || pageQuery !== undefined
    if (hasPagination) {
      const limit = parseInt(limitQuery as string) || 10
      const page = parseInt(pageQuery as string) || 1
      const skip = (page - 1) * limit
      query = query.skip(skip).limit(limit)
    }

    const shifts = await query.lean()

    return res.status(200).json({
      success: true,
      message:
        shifts.length === 0
          ? 'No shifts found.'
          : 'Shifts retrieved successfully',
      data: shifts
    })
  } catch (error) {
    next(error)
  }
}

export const getShiftController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const shiftId = req.params.id

    logger.info({
      message: 'Fetching shift by ID',
      userId,
      username,
      shiftId
    })

    if (!shiftId) return next(badRequest('Shift ID is required.'))
    if (!mongoose.Types.ObjectId.isValid(shiftId)) {
      return next(badRequest('Invalid Shift ID format.'))
    }

    const shift = await Shift.findById(shiftId).populate('department')

    if (!shift) return next(badRequest('Shift not found.', 404))

    return res.status(200).json({
      success: true,
      message: 'Shift retrieved successfully',
      data: shift
    })
  } catch (error) {
    next(error)
  }
}

export const getShiftRecycleBinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const limit = parseInt(req.query.limit as string) || 10
    const page = parseInt(req.query.page as string) || 1
    const skip = (page - 1) * limit

    logger.info({
      message: 'Fetching deleted shifts (Recycle Bin)',
      userId,
      username,
      limit,
      page
    })

    // Bypass the soft-delete middleware and fetch only deleted shifts
    const deletedShifts = await Shift.find({ isDeleted: true })
      .setOptions({ includeDeleted: true })
      .populate('department')
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return res.status(200).json({
      success: true,
      message:
        deletedShifts.length === 0
          ? 'No deleted shifts found.'
          : 'Deleted shifts retrieved successfully',
      data: deletedShifts
    })
  } catch (error) {
    next(error)
  }
}

export const createShiftController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const { shiftTitle, startAt, endAt, department, offDay, status } = req.body

    if (!shiftTitle || !startAt || !endAt || !department || !offDay) {
      return next(
        badRequest(
          'Missing required fields: shiftTitle, startAt, endAt, department, and offDay are required.'
        )
      )
    }

    const validationError = validateShiftFields({
      startAt,
      endAt,
      offDay,
      status
    })
    if (validationError) return next(badRequest(validationError))

    logger.info({
      message: 'Creating a new shift',
      userId,
      username,
      shiftTitle
    })

    const newShift = await Shift.create({
      shiftTitle,
      startAt,
      endAt,
      department,
      offDay,
      ...(status !== undefined && { status }),
      createdBy: userId
    })

    return res.status(201).json({
      success: true,
      message: 'Shift created successfully',
      data: newShift
    })
  } catch (error) {
    next(error)
  }
}

export const createShiftsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const body = req.body

    if (!body || (Array.isArray(body) && body.length === 0)) {
      return next(badRequest('Request body cannot be empty.'))
    }

    const shiftsArray = Array.isArray(body) ? body : [body]

    for (const shift of shiftsArray) {
      const { shiftTitle, startAt, endAt, department, offDay, status } = shift
      if (!shiftTitle || !startAt || !endAt || !department || !offDay) {
        return next(
          badRequest(
            'Missing required fields: shiftTitle, startAt, endAt, department, and offDay are required for all entries.'
          )
        )
      }

      const validationError = validateShiftFields({
        startAt,
        endAt,
        offDay,
        status
      })
      if (validationError) return next(badRequest(validationError))

      shift.createdBy = userId
    }

    logger.info({
      message: 'Creating shift(s)',
      userId,
      username,
      count: shiftsArray.length
    })

    const createdShifts = await Shift.create(shiftsArray)

    const isBulk = Array.isArray(body)

    return res.status(201).json({
      success: true,
      message: isBulk
        ? `${createdShifts.length} shifts created successfully`
        : 'Shift created successfully',
      data: createdShifts
    })
  } catch (error) {
    next(error)
  }
}

export const updateShiftController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const shiftId = req.params.id
    const { shiftTitle, startAt, endAt, department, offDay, status } = req.body

    if (!shiftId) return next(badRequest('Shift ID is required.'))
    if (!mongoose.Types.ObjectId.isValid(shiftId)) {
      return next(badRequest('Invalid Shift ID format.'))
    }

    const validationError = validateShiftFields({
      startAt,
      endAt,
      offDay,
      status
    })
    if (validationError) return next(badRequest(validationError))

    const updateData: Record<string, any> = { updatedBy: userId }
    if (shiftTitle !== undefined) updateData.shiftTitle = shiftTitle
    if (startAt !== undefined) updateData.startAt = startAt
    if (endAt !== undefined) updateData.endAt = endAt
    if (department !== undefined) updateData.department = department
    if (offDay !== undefined) updateData.offDay = offDay
    if (status !== undefined) updateData.status = status

    logger.info({
      message: 'Updating shift',
      userId,
      username,
      shiftId,
      updateData
    })

    const updatedShift = await Shift.findByIdAndUpdate(
      shiftId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedShift) return next(badRequest('Shift not found.', 404))

    return res.status(200).json({
      success: true,
      message: 'Shift updated successfully',
      data: updatedShift
    })
  } catch (error) {
    next(error)
  }
}

export const deleteShiftController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const shiftId = req.params.id

    logger.info({
      message: 'Deleting shift',
      userId,
      username,
      shiftId
    })

    if (!shiftId) return next(badRequest('Shift ID is required.'))
    if (!mongoose.Types.ObjectId.isValid(shiftId)) {
      return next(badRequest('Invalid Shift ID format.'))
    }

    // Soft delete — middleware already excludes already-deleted shifts
    const deletedShift = await Shift.findByIdAndUpdate(
      shiftId,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId
        }
      },
      { new: true }
    )

    if (!deletedShift) return next(badRequest('Shift not found.', 404))

    return res.status(200).json({
      success: true,
      message: 'Shift deleted successfully',
      data: deletedShift
    })
  } catch (error) {
    next(error)
  }
}

export const restoreShiftController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const shiftId = req.params.id

    logger.info({
      message: 'Restoring shift',
      userId,
      username,
      shiftId
    })

    if (!shiftId) return next(badRequest('Shift ID is required.'))
    if (!mongoose.Types.ObjectId.isValid(shiftId)) {
      return next(badRequest('Invalid Shift ID format.'))
    }

    const restoredShift = await Shift.findOneAndUpdate(
      { _id: shiftId, isDeleted: true },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedBy: userId
        }
      },
      { new: true }
    ).setOptions({ includeDeleted: true })

    if (!restoredShift) return next(badRequest('Shift not found.', 404))

    return res.status(200).json({
      success: true,
      message: 'Shift restored successfully',
      data: restoredShift
    })
  } catch (error) {
    next(error)
  }
}