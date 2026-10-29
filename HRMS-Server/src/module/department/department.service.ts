import mongoose from 'mongoose'
import Department from './department.model.js'
import type { DepartmentInterface } from './department.interface.js'

export const getAllDepartmentsService = async (limit: number, skip: number) => {
  return await Department.find().limit(limit).skip(skip)
}

export const getDepartmentByIdService = async (departmentId: string) => {
  const query = mongoose.Types.ObjectId.isValid(departmentId)
    ? { _id: departmentId }
    : { dept_id: departmentId.toUpperCase() }
  return await Department.findOne(query).setOptions({
    includeDeleted: true
  })
}

export const getDepartmentRecycleBinService = async (
  limit: number,
  skip: number
) => {
  return await Department.find({ isDeleted: true })
    .setOptions({ includeDeleted: true })
    .limit(limit)
    .skip(skip)
}

export const findDepartmentByNameService = async (name: string) => {
  return await Department.findOne({ name })
}

export const findDepartmentByDeptIdService = async (
  dept_id: string,
  includeDeleted = false
) => {
  const query = Department.findOne({ dept_id: dept_id.toUpperCase() })
  if (includeDeleted) {
    query.setOptions({ includeDeleted: true })
  }
  return await query
}

export const createDepartmentService = async (departmentData: {
  dept_id?: string
  name: string
  description?: string
  status?: 'active' | 'inactive' | 'disabled'
  createdBy?: any
}) => {
  const newDepartment = new Department(departmentData)
  await newDepartment.save()
  return newDepartment
}

export const updateDepartmentService = async (
  departmentId: string,
  updateData: Record<string, any>
) => {
  const query = mongoose.Types.ObjectId.isValid(departmentId)
    ? { _id: departmentId }
    : { dept_id: departmentId.toUpperCase() }
  return await Department.findOneAndUpdate(
    query,
    { $set: updateData },
    {
      new: true,
      runValidators: true
    }
  )
}

export const deleteDepartmentService = async (
  departmentId: string,
  userId?: any
) => {
  const query = mongoose.Types.ObjectId.isValid(departmentId)
    ? { _id: departmentId }
    : { dept_id: departmentId.toUpperCase() }
  return await Department.findOneAndUpdate(
    query,
    {
      $set: {
        isDeleted: true,
        deletedBy: userId,
        deletedAt: new Date()
      }
    },
    { new: true }
  )
}

export const restoreDepartmentService = async (
  departmentId: string,
  userId?: any
) => {
  const query = mongoose.Types.ObjectId.isValid(departmentId)
    ? { _id: departmentId }
    : { dept_id: departmentId.toUpperCase() }
  return await Department.findOneAndUpdate(
    query,
    {
      $set: {
        isDeleted: false,
        deletedBy: null,
        deletedAt: null,
        updatedBy: userId
      }
    },
    { new: true, includeDeleted: true }
  )
}

export const departmentService = {
  getAllDepartments: getAllDepartmentsService,
  getDepartmentById: getDepartmentByIdService,
  getDepartmentRecycleBin: getDepartmentRecycleBinService,
  findDepartmentByName: findDepartmentByNameService,
  findDepartmentByDeptId: findDepartmentByDeptIdService,
  createDepartment: createDepartmentService,
  updateDepartment: updateDepartmentService,
  deleteDepartment: deleteDepartmentService,
  restoreDepartment: restoreDepartmentService
}

export default departmentService
