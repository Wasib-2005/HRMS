import Role from './role.model.js'
import type { RoleInterface } from './role.interface.js'

export const getAllRolesService = async (limit: number, skip: number) => {
  return await Role.find().limit(limit).skip(skip)
}

export const getRoleByIdService = async (roleId: string) => {
  return await Role.findById(roleId).setOptions({
    includeDeleted: true
  })
}

export const getRoleRecycleBinService = async (
  limit: number,
  skip: number
) => {
  return await Role.find({ isDeleted: true })
    .setOptions({ includeDeleted: true })
    .limit(limit)
    .skip(skip)
}

export const findRoleByNameService = async (name: string) => {
  return await Role.findOne({ name })
}

export const createRoleService = async (roleData: {
  name: string
  description?: string
  permissions?: RoleInterface['permissions']
  createdBy?: any
}) => {
  return await Role.create(roleData)
}

export const updateRoleService = async (
  roleId: string,
  updateData: Record<string, any>
) => {
  return await Role.findByIdAndUpdate(
    roleId,
    { $set: updateData },
    {
      new: true,
      runValidators: true
    }
  )
}

export const deleteRoleService = async (roleId: string, userId?: any) => {
  return await Role.findByIdAndUpdate(
    roleId,
    { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
    { new: true }
  )
}

export const restoreRoleService = async (roleId: string, userId?: any) => {
  return await Role.findByIdAndUpdate(
    roleId,
    {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedBy: userId
    },
    { new: true, includeDeleted: true }
  )
}

export const roleService = {
  getAllRoles: getAllRolesService,
  getRoleById: getRoleByIdService,
  getRoleRecycleBin: getRoleRecycleBinService,
  findRoleByName: findRoleByNameService,
  createRole: createRoleService,
  updateRole: updateRoleService,
  deleteRole: deleteRoleService,
  restoreRole: restoreRoleService
}

export default roleService
