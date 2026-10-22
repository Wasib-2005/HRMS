import mongoose from 'mongoose'
import DepartmentAssign from './departmentAssign.model.js'
import Department from '../department/department.model.js'
import '../auth/user.model.js'

export const assignDepartmentService = async (data: {
  userId: string
  dept_id: string
  status?: 'active' | 'inactive' | 'disabled'
  createdBy?: any
}) => {
  const { userId, dept_id, status, createdBy } = data

  // 1. Resolve department by dept_id or ObjectId
  const deptQuery = mongoose.Types.ObjectId.isValid(dept_id)
    ? { _id: dept_id }
    : { dept_id: dept_id.toUpperCase() }

  const department = await Department.findOne(deptQuery)
  if (!department) {
    const error: any = new Error(`Department not found for '${dept_id}'.`)
    error.statusCode = 404
    throw error
  }

  // 2. Check for duplicate active assignment
  const existing = await DepartmentAssign.findOne({
    user: userId,
    department: department._id,
    status: 'active'
  })

  if (existing) {
    const error: any = new Error(
      'Employee is already actively assigned to this department.'
    )
    error.statusCode = 400
    throw error
  }

  // 3. Create assignment
  const newAssignment = new DepartmentAssign({
    user: new mongoose.Types.ObjectId(userId),
    department: department._id,
    dept_id: department.dept_id,
    status: status || 'active',
    createdBy
  })

  await newAssignment.save()
  return await newAssignment.populate([
    { path: 'user', select: 'name email role' },
    { path: 'department', select: 'name dept_id description status' }
  ])
}

export const transferDepartmentService = async (data: {
  userId: string
  toDeptId: string
  fromDeptId?: string
  status?: 'active' | 'inactive' | 'disabled'
  updatedBy?: any
}) => {
  const { userId, toDeptId, fromDeptId, status, updatedBy } = data

  // 1. Resolve target department
  const targetDeptQuery = mongoose.Types.ObjectId.isValid(toDeptId)
    ? { _id: toDeptId }
    : { dept_id: toDeptId.toUpperCase() }

  const targetDept = await Department.findOne(targetDeptQuery)
  if (!targetDept) {
    const error: any = new Error(`Target department not found for '${toDeptId}'.`)
    error.statusCode = 404
    throw error
  }

  // 2. Find current active assignment
  let currentAssignment = null
  if (fromDeptId) {
    const sourceDeptQuery = mongoose.Types.ObjectId.isValid(fromDeptId)
      ? { _id: fromDeptId }
      : { dept_id: fromDeptId.toUpperCase() }

    const sourceDept = await Department.findOne(sourceDeptQuery)
    if (sourceDept) {
      currentAssignment = await DepartmentAssign.findOne({
        user: userId,
        department: sourceDept._id,
        status: 'active'
      })
    }
  } else {
    currentAssignment = await DepartmentAssign.findOne({
      user: userId,
      status: 'active'
    })
  }

  if (!currentAssignment) {
    const error: any = new Error(
      'No active department assignment found for this employee.'
    )
    error.statusCode = 404
    throw error
  }

  // 3. Prevent transferring to the same department
  if (currentAssignment.department.toString() === targetDept._id.toString()) {
    const error: any = new Error(
      'Employee is already assigned to the target department.'
    )
    error.statusCode = 400
    throw error
  }

  // 4. Mark previous assignment as transferred
  currentAssignment.status = 'transferred'
  currentAssignment.updatedBy = updatedBy
  await currentAssignment.save()

  // 5. Create new assignment for target department
  const newAssignment = new DepartmentAssign({
    user: new mongoose.Types.ObjectId(userId),
    department: targetDept._id,
    dept_id: targetDept.dept_id,
    status: status || 'active',
    createdBy: updatedBy
  })

  await newAssignment.save()

  return {
    newAssignment: await newAssignment.populate([
      { path: 'user', select: 'name email role' },
      { path: 'department', select: 'name dept_id description status' }
    ]),
    previousAssignment: currentAssignment
  }
}

export const getAllDepartmentAssignmentsService = async (
  limit: number,
  skip: number,
  filters?: Record<string, any>
) => {
  return await DepartmentAssign.find(filters || {})
    .populate([
      { path: 'user', select: 'name email role' },
      { path: 'department', select: 'name dept_id description status' }
    ])
    .limit(limit)
    .skip(skip)
}

export const getDepartmentAssignmentByIdService = async (id: string) => {
  return await DepartmentAssign.findById(id)
    .setOptions({ includeDeleted: true })
    .populate([
      { path: 'user', select: 'name email role' },
      { path: 'department', select: 'name dept_id description status' }
    ])
}

export const getDepartmentAssignmentsByUserService = async (userId: string) => {
  return await DepartmentAssign.find({ user: userId })
    .populate([
      { path: 'user', select: 'name email role' },
      { path: 'department', select: 'name dept_id description status' }
    ])
}

export const getDepartmentAssignmentsByDeptService = async (deptId: string) => {
  const query = mongoose.Types.ObjectId.isValid(deptId)
    ? { $or: [{ department: deptId }, { dept_id: deptId.toUpperCase() }] }
    : { dept_id: deptId.toUpperCase() }

  return await DepartmentAssign.find(query)
    .populate([
      { path: 'user', select: 'name email role' },
      { path: 'department', select: 'name dept_id description status' }
    ])
}

export const getDepartmentAssignmentRecycleBinService = async (
  limit: number,
  skip: number
) => {
  return await DepartmentAssign.find({ isDeleted: true })
    .setOptions({ includeDeleted: true })
    .populate([
      { path: 'user', select: 'name email role' },
      { path: 'department', select: 'name dept_id description status' }
    ])
    .limit(limit)
    .skip(skip)
}

export const updateDepartmentAssignmentService = async (
  id: string,
  updateData: Record<string, any>
) => {
  return await DepartmentAssign.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate([
    { path: 'user', select: 'name email role' },
    { path: 'department', select: 'name dept_id description status' }
  ])
}

export const deleteDepartmentAssignmentService = async (
  id: string,
  userId?: any
) => {
  return await DepartmentAssign.findByIdAndUpdate(
    id,
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

export const restoreDepartmentAssignmentService = async (
  id: string,
  userId?: any
) => {
  return await DepartmentAssign.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: false,
        deletedBy: null,
        deletedAt: null,
        updatedBy: userId
      }
    },
    { new: true, includeDeleted: true }
  ).populate([
    { path: 'user', select: 'name email role' },
    { path: 'department', select: 'name dept_id description status' }
  ])
}

export const departmentAssignService = {
  assignDepartment: assignDepartmentService,
  transferDepartment: transferDepartmentService,
  getAllDepartmentAssignments: getAllDepartmentAssignmentsService,
  getDepartmentAssignmentById: getDepartmentAssignmentByIdService,
  getDepartmentAssignmentsByUser: getDepartmentAssignmentsByUserService,
  getDepartmentAssignmentsByDept: getDepartmentAssignmentsByDeptService,
  getDepartmentAssignmentRecycleBin: getDepartmentAssignmentRecycleBinService,
  updateDepartmentAssignment: updateDepartmentAssignmentService,
  deleteDepartmentAssignment: deleteDepartmentAssignmentService,
  restoreDepartmentAssignment: restoreDepartmentAssignmentService
}

export default departmentAssignService
