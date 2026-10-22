import type { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { logger } from '../../utility/logger.js'
import { departmentAssignService } from './departmentAssign.service.js'

export const assignDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const creatorId = req.userId
    const username = req.username
    const { userId, user, dept_id, status } = req.body

    const targetUserId = userId || user

    // 1. Validation
    if (!targetUserId) {
      const error: any = new Error('User ID (userId) is required.')
      error.statusCode = 400
      return next(error)
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      const error: any = new Error('Invalid User ID format.')
      error.statusCode = 400
      return next(error)
    }

    if (!dept_id) {
      const error: any = new Error('Department ID (dept_id) is required.')
      error.statusCode = 400
      return next(error)
    }

    logger.info({
      message: 'Assigning department to employee',
      creatorId,
      username,
      userId: targetUserId,
      dept_id
    })

    const newAssignment = await departmentAssignService.assignDepartment({
      userId: targetUserId,
      dept_id,
      status,
      createdBy: creatorId
    })

    res.status(201).json({
      success: true,
      message: 'Department assigned to employee successfully',
      data: newAssignment
    })
  } catch (error) {
    next(error)
  }
}

export const transferDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updaterId = req.userId
    const username = req.username
    const { userId, user, toDeptId, newDeptId, fromDeptId, status } = req.body

    const targetUserId = userId || user
    const targetToDeptId = toDeptId || newDeptId

    if (!targetUserId) {
      const error: any = new Error('User ID (userId) is required.')
      error.statusCode = 400
      return next(error)
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      const error: any = new Error('Invalid User ID format.')
      error.statusCode = 400
      return next(error)
    }

    if (!targetToDeptId) {
      const error: any = new Error('Target department ID (toDeptId) is required.')
      error.statusCode = 400
      return next(error)
    }

    logger.info({
      message: 'Transferring employee to new department',
      updaterId,
      username,
      userId: targetUserId,
      toDeptId: targetToDeptId,
      fromDeptId
    })

    const transferResult = await departmentAssignService.transferDepartment({
      userId: targetUserId,
      toDeptId: targetToDeptId,
      fromDeptId,
      status,
      updatedBy: updaterId
    })

    res.status(200).json({
      success: true,
      message: 'Employee transferred to new department successfully',
      data: transferResult
    })
  } catch (error) {
    next(error)
  }
}

export const getAllDepartmentAssignmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const page = parseInt(req.query.page as string) || 1
    const skip = (page - 1) * limit

    const filters: Record<string, any> = {}
    if (req.query.userId) filters.user = req.query.userId
    if (req.query.dept_id) filters.dept_id = (req.query.dept_id as string).toUpperCase()
    if (req.query.status) filters.status = req.query.status

    const assignments =
      await departmentAssignService.getAllDepartmentAssignments(
        limit,
        skip,
        filters
      )

    res.status(200).json({
      success: true,
      message:
        assignments.length === 0
          ? 'No department assignments found.'
          : 'Department assignments retrieved successfully',
      data: assignments
    })
  } catch (error) {
    next(error)
  }
}

export const getDepartmentAssignmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignmentId = req.params.id

    if (!assignmentId) {
      const error: any = new Error('Assignment ID is required.')
      error.statusCode = 400
      return next(error)
    }

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      const error: any = new Error('Invalid Assignment ID format.')
      error.statusCode = 400
      return next(error)
    }

    const assignment =
      await departmentAssignService.getDepartmentAssignmentById(assignmentId)

    if (!assignment) {
      const error: any = new Error('Department assignment not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Department assignment retrieved successfully',
      data: assignment
    })
  } catch (error) {
    next(error)
  }
}

export const getAssignmentsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const error: any = new Error('Valid User ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const assignments =
      await departmentAssignService.getDepartmentAssignmentsByUser(userId)

    res.status(200).json({
      success: true,
      message: 'Employee department assignments retrieved successfully',
      data: assignments
    })
  } catch (error) {
    next(error)
  }
}

export const getAssignmentsByDeptController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deptId = req.params.deptId

    if (!deptId) {
      const error: any = new Error('Department ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const assignments =
      await departmentAssignService.getDepartmentAssignmentsByDept(deptId)

    res.status(200).json({
      success: true,
      message: 'Department employee assignments retrieved successfully',
      data: assignments
    })
  } catch (error) {
    next(error)
  }
}

export const getDepartmentAssignmentRecycleBinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const page = parseInt(req.query.page as string) || 1
    const skip = (page - 1) * limit

    const deletedAssignments =
      await departmentAssignService.getDepartmentAssignmentRecycleBin(
        limit,
        skip
      )

    res.status(200).json({
      success: true,
      message:
        deletedAssignments.length === 0
          ? 'No deleted department assignments found.'
          : 'Deleted department assignments retrieved successfully',
      data: deletedAssignments
    })
  } catch (error) {
    next(error)
  }
}

export const updateDepartmentAssignmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignmentId = req.params.id
    const updaterId = req.userId
    const { status } = req.body

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      const error: any = new Error('Valid Assignment ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const updateData: Record<string, any> = { updatedBy: updaterId }
    if (status !== undefined) updateData.status = status

    const updatedAssignment =
      await departmentAssignService.updateDepartmentAssignment(
        assignmentId,
        updateData
      )

    if (!updatedAssignment) {
      const error: any = new Error('Department assignment not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Department assignment updated successfully',
      data: updatedAssignment
    })
  } catch (error) {
    next(error)
  }
}

export const deleteDepartmentAssignmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignmentId = req.params.id
    const userId = req.userId

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      const error: any = new Error('Valid Assignment ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const deletedAssignment =
      await departmentAssignService.deleteDepartmentAssignment(
        assignmentId,
        userId
      )

    if (!deletedAssignment) {
      const error: any = new Error('Department assignment not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Department assignment deleted successfully',
      data: deletedAssignment
    })
  } catch (error) {
    next(error)
  }
}

export const restoreDepartmentAssignmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignmentId = req.params.id
    const userId = req.userId

    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      const error: any = new Error('Valid Assignment ID is required.')
      error.statusCode = 400
      return next(error)
    }

    const restoredAssignment =
      await departmentAssignService.restoreDepartmentAssignment(
        assignmentId,
        userId
      )

    if (!restoredAssignment) {
      const error: any = new Error('Department assignment not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Department assignment restored successfully',
      data: restoredAssignment
    })
  } catch (error) {
    next(error)
  }
}

export const departmentAssignController = {
  assignDepartment: assignDepartmentController,
  transferDepartment: transferDepartmentController,
  getAllDepartmentAssignments: getAllDepartmentAssignmentsController,
  getDepartmentAssignmentById: getDepartmentAssignmentByIdController,
  getAssignmentsByUser: getAssignmentsByUserController,
  getAssignmentsByDepartment: getAssignmentsByDeptController,
  getDepartmentAssignmentRecycleBin:
    getDepartmentAssignmentRecycleBinController,
  updateDepartmentAssignment: updateDepartmentAssignmentController,
  deleteDepartmentAssignment: deleteDepartmentAssignmentController,
  restoreDepartmentAssignment: restoreDepartmentAssignmentController
}

export default departmentAssignController
