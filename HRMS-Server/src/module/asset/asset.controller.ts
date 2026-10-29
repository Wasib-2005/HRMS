import type { NextFunction, Request, Response } from 'express'
import { logger } from '../../utility/logger.js'
import { assetService } from './asset.service.js'

export const getAllAssetController = async (
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
      message: 'Fetching all assets',
      userId,
      username
    })

    const assets = await assetService.getAllAssets(limit, skip)

    // Return 200 OK with an empty array if no assets are found
    res.status(200).json({
      success: true,
      message:
        assets.length === 0
          ? 'No assets found.'
          : 'Assets retrieved successfully',
      data: assets
    })
  } catch (error) {
    next(error)
  }
}

export const getAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const assetId = req.params.id

    // Log the request details for audit purposes
    logger.info({
      message: 'Fetching asset by ID',
      userId,
      username,
      assetId
    })

    if (!assetId) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    const asset = await assetService.getAssetById(assetId)

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Asset retrieved successfully',
      data: asset
    })
  } catch (error) {
    next(error)
  }
}

export const getAssetRecycleBinController = async (
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
      message: 'Fetching deleted assets (Recycle Bin)',
      userId,
      username,
      limit,
      page
    })

    // Bypass the global soft-delete filter to fetch only deleted items with pagination
    const deletedAssets = await assetService.getAssetRecycleBin(limit, skip)

    return res.status(200).json({
      success: true,
      message:
        deletedAssets.length === 0
          ? 'No deleted assets found.'
          : 'Deleted assets retrieved successfully',
      data: deletedAssets
    })
  } catch (error) {
    next(error)
  }
}

export const createAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const { assetName, description, serialNumber, status } = req.body

    console.log('Request Body:', req.body)

    // 1. Validation using the global error handler
    if (!assetName) {
      const error: any = new Error('Asset name is required.')
      error.statusCode = 400
      return next(error)
    }

    // Log the request details for audit purposes
    logger.info({
      message: 'Creating a new asset',
      userId,
      username,
      assetName: assetName
    })

    const newAsset = await assetService.createAsset({
      assetName,
      description,
      serialNumber,
      status,
      createdBy: userId
    })

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: newAsset
    })
  } catch (error) {
    next(error)
  }
}

export const updateAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const assetId = req.params.id
    const { assetName, description, serialNumber, status } = req.body

    if (!assetId) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    // Build update object dynamically to prevent overwriting fields with undefined
    const updateData: Record<string, any> = { updatedBy: userId }
    if (assetName !== undefined) updateData.assetName = assetName
    if (description !== undefined) updateData.description = description
    if (serialNumber !== undefined) updateData.serialNumber = serialNumber
    if (status !== undefined) updateData.status = status

    // Log the request details for audit purposes
    logger.info({
      message: 'Updating asset',
      userId,
      username,
      assetId,
      updateData
    })

    const updatedAsset = await assetService.updateAsset(assetId, updateData)

    if (!updatedAsset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: updatedAsset
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const assetId = req.params.id

    if (!assetId) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    // Log the request details for audit purposes
    logger.info({
      message: 'Deleting asset',
      userId,
      username,
      assetId
    })

    const deletedAsset = await assetService.deleteAsset(assetId, userId)

    if (!deletedAsset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Asset deleted successfully',
      data: deletedAsset
    })
  } catch (error) {
    next(error)
  }
}

export const restoreAssetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId
    const username = req.username
    const assetId = req.params.id

    if (!assetId) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    // Log the request details for audit purposes
    logger.info({
      message: 'Restoring asset',
      userId,
      username,
      assetId
    })

    const restoredAsset = await assetService.restoreAsset(assetId)

    if (!restoredAsset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Asset restored successfully',
      data: restoredAsset
    })
  } catch (error) {
    next(error)
  }
}

export const assetController = {
  getAllAssets: getAllAssetController,
  getAsset: getAssetController,
  getAssetRecycleBin: getAssetRecycleBinController,
  createAsset: createAssetController,
  updateAsset: updateAssetController,
  deleteAsset: deleteAssetController,
  restoreAsset: restoreAssetController
}

export default assetController
