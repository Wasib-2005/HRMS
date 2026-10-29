import type { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { logger } from '../../utility/logger.js'
import { roleService } from './role.service.js'

export const getAllRoleController = async (
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
      message: 'Fetching all roles',
      userId,
      username,
      limit,
      page
    })

    const roles = await roleService.getAllRoles(limit, skip)

    // Return 200 OK with an empty array if no roles are found
    res.status(200).json({
      success: true,
      message:
        roles.length === 0 ? 'No roles found.' : 'Roles retrieved successfully',
      data: roles
    })
  } catch (error) {
    next(error)
  }
}

export const getRoleByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.id
    const userId = req.userId
    const username = req.username

    // Log the request details for audit purposes
    logger.info({
      message: 'Fetching role by ID',
      userId,
      username,
      roleId
    })

    if (!roleId) {
      const error: any = new Error('Role ID is required.')
      error.statusCode = 400
      return next(error)
    }

    // Validate roleId format
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      const error: any = new Error('Invalid Role ID format.')
      error.statusCode = 400
      return next(error)
    }

    const role = await roleService.getRoleById(roleId)

    if (!role) {
      const error: any = new Error('Role not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Role retrieved successfully',
      data: role
    })
  } catch (error) {
    next(error)
  }
}

export const getRoleRecycleBin = async (
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
      message: 'Fetching deleted roles (Recycle Bin)',
      userId,
      username,
      limit,
      page
    })

    // Fetch only deleted roles, bypassing the global soft-delete middleware
    const deletedRoles = await roleService.getRoleRecycleBin(limit, skip)

    return res.status(200).json({
      success: true,
      message:
        deletedRoles.length === 0
          ? 'No deleted roles found.'
          : 'Deleted roles retrieved successfully',
      data: deletedRoles
    })
  } catch (error) {
    next(error)
  }
}

export const createRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, permissions } = req.body
    const userId = req.userId
    const username = req.username

    // 1. Validation using the global error handler
    if (!name) {
      const error: any = new Error('Role name is required.')
      error.statusCode = 400
      return next(error)
    }

    // Log the request details for audit purposes
    logger.info({
      message: 'Creating a new role',
      userId,
      username,
      data: { name, description, permissions }
    })

    // 2. Check if role already exists
    const existingRole = await roleService.findRoleByName(name)
    if (existingRole) {
      const error: any = new Error('Role already exists.')
      error.statusCode = 400
      return next(error)
    }

    // 3. Create the role in MongoDB
    const newRole = await roleService.createRole({
      name,
      description,
      permissions,
      createdBy: userId
    })

    // 4. Success response
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: newRole
    })
  } catch (error) {
    next(error)
  }
}

export const updateRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.id
    const { name, description, permissions } = req.body
    const userId = req.userId
    const username = req.username

    // 1. Validate roleId presence and format early
    if (!roleId) {
      const error: any = new Error('Role ID is required.')
      error.statusCode = 400
      return next(error)
    }

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      const error: any = new Error('Invalid Role ID format.')
      error.statusCode = 400
      return next(error)
    }

    // 2. Build update object dynamically to support partial updates safely
    const updateData: Record<string, any> = { updatedBy: userId }
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (permissions !== undefined) updateData.permissions = permissions

    // 3. Log the request details for audit purposes
    logger.info({
      message: 'Updating role',
      userId,
      username,
      roleId,
      data: updateData
    })

    // 4. Perform update with validation enabled
    const updatedRole = await roleService.updateRole(roleId, updateData)

    if (!updatedRole) {
      const error: any = new Error('Role not found.')
      error.statusCode = 404
      return next(error)
    }

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole
    })
  } catch (error) {
    next(error)
  }
}

export const deleteRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.id
    const userID = req.userId
    const username = req.username

    // Log the request details for audit purposes
    logger.info({
      message: 'Deleting role',
      userId: userID,
      username,
      roleId
    })

    if (!roleId) {
      const error: any = new Error('Role ID is required.')
      error.statusCode = 400
      return next(error)
    }

    // Validate roleId format
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      const error: any = new Error('Invalid Role ID format.')
      error.statusCode = 400
      return next(error)
    }

    const deletedRole = await roleService.deleteRole(roleId, userID)

    if (!deletedRole) {
      const error: any = new Error('Role not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
      data: deletedRole
    })
  } catch (error) {
    next(error)
  }
}

export const restoreRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = req.params.id
    const userID = req.userId
    const username = req.username

    // Log the request details for audit purposes
    logger.info({
      message: 'Restoring role',
      userId: userID,
      username,
      roleId
    })

    if (!roleId) {
      const error: any = new Error('Role ID is required.')
      error.statusCode = 400
      return next(error)
    }

    // Validate roleId format
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      const error: any = new Error('Invalid Role ID format.')
      error.statusCode = 400
      return next(error)
    }

    const restoredRole = await roleService.restoreRole(roleId, userID)

    if (!restoredRole) {
      const error: any = new Error('Role not found.')
      error.statusCode = 404
      return next(error)
    }

    res.status(200).json({
      success: true,
      message: 'Role restored successfully',
      data: restoredRole
    })
  } catch (error) {
    next(error)
  }
}

export const roleController = {
  getAllRoles: getAllRoleController,
  getRoleById: getRoleByIdController,
  getRoleRecycleBin,
  createRole: createRoleController,
  updateRole: updateRoleController,
  deleteRole: deleteRoleController,
  restoreRole: restoreRoleController
}

export default roleController
