import type { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { logger } from '../../utility/logger.js'
import { departmentService } from './department.service.js'

export const getAllDepartmentController = async (
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

    // Log the request details for audit purposes
    logger.info({
      message: 'Fetching all departments',
      userId,
      username,
      limit,
      page
    })

    const departments = await departmentService.getAllDepartments(limit, skip)

    res.status(200).json({
      success: true,
      message:
        departments.length === 0
          ? 'No departments found.'
          : 'Departments retrieved successfully',
      data: departments
    })
  } catch (error) {
    next(error)
  }
}

export const getDepartmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departmentId = req.params.id
    const userId = req.userId
    const username = req.username

    logger.info({
      message: 'Fetching department by ID',
      userId,
      username,
      departmentId
    })

    if (!departmentId) {
      const error: any = new Error('Department ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const department = await departmentService.getDepartmentById(departmentId)

    if (!department) {
      const error: any = new Error('Department not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Department retrieved successfully',
      data: department
    })
  } catch (error) {
    next(error)
  }
}

export const getDepartmentRecycleBinController = async (
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
      message: 'Fetching deleted departments (Recycle Bin)',
      userId,
      username,
      limit,
      page
    })

    const deletedDepartments = await departmentService.getDepartmentRecycleBin(
      limit,
      skip
    )

    return res.status(200).json({
      success: true,
      message:
        deletedDepartments.length === 0
          ? 'No deleted departments found.'
          : 'Deleted departments retrieved successfully',
      data: deletedDepartments
    })
  } catch (error) {
    next(error)
  }
}

export const createDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const { dept_id, name, departmentName, description, status } = req.body

    const targetName = name || departmentName

    // 1. Validation
    if (!targetName) {
      const error: any = new Error('Department name is required.')
      error.statusCode = 400
      return next(error)
    }

    logger.info({
      message: 'Creating a new department',
      userId,
      username,
      name: targetName,
      dept_id
    })

    // 2. Check if department already exists (active records)
    const existingDepartment = await departmentService.findDepartmentByName(
      targetName
    )
    if (existingDepartment) {
      const error: any = new Error('Department already exists.')
      error.statusCode = 400
      return next(error)
    }

    if (dept_id) {
      const existingDeptId = await departmentService.findDepartmentByDeptId(
        dept_id.trim().toUpperCase()
      )
      if (existingDeptId) {
        const error: any = new Error('Department ID already exists.')
        error.statusCode = 400
        return next(error)
      }
    }

    // 3. Create the department
    const newDepartment = await departmentService.createDepartment({
      dept_id: dept_id ? dept_id.trim().toUpperCase() : undefined,
      name: targetName,
      description,
      status,
      createdBy: userId
    })

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: newDepartment
    })
  } catch (error) {
    next(error)
  }
}

export const updateDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departmentId = req.params.id
    const userId = req.userId
    const username = req.username
    const { dept_id, name, departmentName, description, status } = req.body

    if (!departmentId) {
      const error: any = new Error('Department ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const updateData: Record<string, any> = { updatedBy: userId }
    const targetName = name !== undefined ? name : departmentName
    if (targetName !== undefined) updateData.name = targetName
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (dept_id !== undefined) {
      const formattedDeptId = dept_id.trim().toUpperCase()
      const existing = await departmentService.findDepartmentByDeptId(
        formattedDeptId
      )
      if (
        existing &&
        existing._id.toString() !== departmentId &&
        existing.dept_id !== departmentId.toUpperCase()
      ) {
        const error: any = new Error('Department ID already exists.')
        error.statusCode = 400
        return next(error)
      }
      updateData.dept_id = formattedDeptId
    }

    logger.info({
      message: 'Updating department',
      userId,
      username,
      departmentId,
      data: updateData
    })

    const updatedDepartment = await departmentService.updateDepartment(
      departmentId,
      updateData
    )

    if (!updatedDepartment) {
      const error: any = new Error('Department not found.')
      error.statusCode = 404
      return next(error)
    }

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment
    })
  } catch (error) {
    next(error)
  }
}

export const deleteDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departmentId = req.params.id
    const userId = req.userId
    const username = req.username

    logger.info({
      message: 'Deleting department',
      userId,
      username,
      departmentId
    })

    if (!departmentId) {
      const error: any = new Error('Department ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const deletedDepartment = await departmentService.deleteDepartment(
      departmentId,
      userId
    )

    if (!deletedDepartment) {
      const error: any = new Error('Department not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
      data: deletedDepartment
    })
  } catch (error) {
    next(error)
  }
}

export const restoreDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departmentId = req.params.id
    const userId = req.userId
    const username = req.username

    logger.info({
      message: 'Restoring department',
      userId,
      username,
      departmentId
    })

    if (!departmentId) {
      const error: any = new Error('Department ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const restoredDepartment = await departmentService.restoreDepartment(
      departmentId,
      userId
    )

    if (!restoredDepartment) {
      const error: any = new Error('Department not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Department restored successfully',
      data: restoredDepartment
    })
  } catch (error) {
    next(error)
  }
}

export const departmentController = {
  getAllDepartments: getAllDepartmentController,
  getDepartmentById: getDepartmentByIdController,
  getDepartmentRecycleBin: getDepartmentRecycleBinController,
  createDepartment: createDepartmentController,
  updateDepartment: updateDepartmentController,
  deleteDepartment: deleteDepartmentController,
  restoreDepartment: restoreDepartmentController
}

export default departmentController
