import Asset from './asset.model.js'
import type { AssetInterface } from './asset.interface.js'

export const getAllAssetsService = async (limit: number, skip: number) => {
  return await Asset.find().limit(limit).skip(skip)
}

export const getAssetByIdService = async (assetId: string) => {
  return await Asset.findById(assetId).setOptions({
    includeDeleted: true
  })
}

export const getAssetRecycleBinService = async (
  limit: number,
  skip: number
) => {
  return await Asset.find({ isDeleted: true })
    .setOptions({ includeDeleted: true })
    .limit(limit)
    .skip(skip)
}

export const createAssetService = async (
  assetData: Record<string, any>
) => {
  const newAsset = new Asset(assetData)
  await newAsset.save()
  return newAsset
}

export const updateAssetService = async (
  assetId: string,
  updateData: Record<string, any>
) => {
  return await Asset.findByIdAndUpdate(
    assetId,
    { $set: updateData },
    {
      new: true,
      runValidators: true
    }
  )
}

export const deleteAssetService = async (assetId: string, userId?: any) => {
  return await Asset.findByIdAndUpdate(
    assetId,
    { $set: { isDeleted: true, deletedBy: userId, deletedAt: new Date() } },
    { new: true }
  )
}

export const restoreAssetService = async (assetId: string) => {
  return await Asset.findByIdAndUpdate(
    assetId,
    { $set: { isDeleted: false, deletedBy: null, deletedAt: null } },
    { new: true, includeDeleted: true }
  )
}

export const assetService = {
  getAllAssets: getAllAssetsService,
  getAssetById: getAssetByIdService,
  getAssetRecycleBin: getAssetRecycleBinService,
  createAsset: createAssetService,
  updateAsset: updateAssetService,
  deleteAsset: deleteAssetService,
  restoreAsset: restoreAssetService
}

export default assetService
