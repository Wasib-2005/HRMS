import type { NextFunction, Request, Response } from 'express'
import Holiday from './holiday.model.js'
import { logger } from '../../../config/index.js'

export const getAllHolidaysController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username

    const { month, year, limit: limitQuery, page: pageQuery } = req.query

    logger.info({
      message: 'Fetching holidays with filters',
      userId,
      username,
      month,
      year
    })

    const filter: Record<string, any> = {}

    // --- Year & Month Filtering ---
    if (year) {
      const targetYear = parseInt(year as string)
      let startDateRange: Date
      let endDateRange: Date

      if (month) {
        // Specific month in a specific year (month is 1-12)
        const targetMonth = parseInt(month as string) - 1
        startDateRange = new Date(
          Date.UTC(targetYear, targetMonth, 1, 0, 0, 0, 0)
        )
        endDateRange = new Date(
          Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999)
        )
      } else {
        // Entire year
        startDateRange = new Date(Date.UTC(targetYear, 0, 1, 0, 0, 0, 0))
        endDateRange = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999))
      }

      filter.startDate = {
        $gte: startDateRange,
        $lte: endDateRange
      }
    }

    let query = Holiday.find(filter)

    // --- Optional Pagination ---
    // Pagination is only applied if 'limit' or 'page' are passed in the query string
    const hasPagination = limitQuery !== undefined || pageQuery !== undefined
    if (hasPagination) {
      const limit = parseInt(limitQuery as string) || 10
      const page = parseInt(pageQuery as string) || 1
      const skip = (page - 1) * limit
      query = query.skip(skip).limit(limit)
    }

    const holidays = await query.lean()

    return res.status(200).json({
      success: true,
      message:
        holidays.length === 0
          ? 'No holidays found.'
          : 'Holidays retrieved successfully',
      data: holidays
    })
  } catch (error) {
    next(error)
  }
}

export const getHolidayController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const holidayId = req.params.id

    logger.info({
      message: 'Fetching holiday by ID',
      userId,
      username,
      holidayId
    })

    if (!holidayId) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      })
    }

    const holiday = await Holiday.findById(holidayId)

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Holiday retrieved successfully',
      data: holiday
    })
  } catch (error) {
    next(error)
  }
}

export const createHolidayController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const { titleEn, titleBn, startDate, endDate, type, notes } = req.body

    // Validation
    if (!titleEn || !titleBn || !startDate || !endDate || !type) {
      const error: any = new Error(
        'Missing required fields: titleEn, titleBn, startDate, endDate, and type are required.'
      )
      error.statusCode = 400
      return next(error)
    }

    // Log the request details for audit purposes
    logger.info({
      message: 'Creating a new holiday',
      userId,
      username,
      titleEn
    })

    const newHoliday = await Holiday.create({
      titleEn,
      titleBn,
      startDate,
      endDate,
      type,
      notes,
      createdBy: userId
    })

    return res.status(201).json({
      success: true,
      message: 'Holiday created successfully',
      data: newHoliday
    })
  } catch (error) {
    next(error)
  }
}

export const createHolidaysController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const body = req.body

    // Ensure request body is not empty
    if (!body || (Array.isArray(body) && body.length === 0)) {
      const error: any = new Error('Request body cannot be empty.')
      error.statusCode = 400
      return next(error)
    }

    // Normalize input: if it's a single object, wrap it in an array; if it's already an array, use it as-is.
    const holidaysArray = Array.isArray(body) ? body : [body]

    // Validate required fields for every item in the array
    for (const holiday of holidaysArray) {
      const { titleEn, titleBn, startDate, endDate, type } = holiday
      if (!titleEn || !titleBn || !startDate || !endDate || !type) {
        const error: any = new Error(
          'Missing required fields: titleEn, titleBn, startDate, endDate, and type are required for all entries.'
        )
        error.statusCode = 400
        return next(error)
      }
      // Inject createdBy into each record
      holiday.createdBy = userId
    }

    // Log the request details for audit purposes
    logger.info({
      message: 'Creating holiday(s)',
      userId,
      username,
      count: holidaysArray.length
    })

    // Holiday.create() automatically handles both single objects and arrays of objects
    const createdHolidays = await Holiday.create(holidaysArray)

    const isBulk = Array.isArray(body)

    return res.status(201).json({
      success: true,
      message: isBulk
        ? `${createdHolidays.length} holidays created successfully`
        : 'Holiday created successfully',
      data: createdHolidays
    })
  } catch (error) {
    next(error)
  }
}

export const updateHolidayController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const holidayId = req.params.id
    const { titleEn, titleBn, startDate, endDate, type, notes } = req.body

    if (!holidayId) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      })
    }

    const updateData: Record<string, any> = { updatedBy: userId }
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (titleBn !== undefined) updateData.titleBn = titleBn
    if (startDate !== undefined) updateData.startDate = startDate
    if (endDate !== undefined) updateData.endDate = endDate
    if (type !== undefined) updateData.type = type
    if (notes !== undefined) updateData.notes = notes

    logger.info({
      message: 'Updating holiday',
      userId,
      username,
      holidayId,
      updateData
    })

    const updatedHoliday = await Holiday.findByIdAndUpdate(
      holidayId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedHoliday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Holiday updated successfully',
      data: updatedHoliday
    })
  } catch (error) {
    next(error)
  }
}

export const deleteHolidayController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const holidayId = req.params.id

    if (!holidayId) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      })
    }

    logger.info({
      message: 'Permanently deleting holiday',
      userId,
      username,
      holidayId
    })

    // Permanently remove from database (includeDeleted: true ensures it can be found even if soft-deleted)
    const deletedHoliday = await Holiday.findByIdAndDelete(holidayId, {
      includeDeleted: true
    })

    if (!deletedHoliday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Holiday permanently deleted successfully',
      data: deletedHoliday
    })
  } catch (error) {
    next(error)
  }
}
