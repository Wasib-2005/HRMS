import type { NextFunction, Request, Response } from 'express'

export const verifyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: Implement user verification logic here

  req.userId = '6ad4729e856ea46aefdb1ff3' // Placeholder for user verification logic

  req.username = 'admin' // Placeholder for user verification logic

  req.permissions = {
    readEmployeeList: true,
    createEmployee: false,
    readRoleList: true,
    createRole: true,
    updateRole: true,
    deleteRole: true,
    restoreRole: true,
    readDepartmentList: true,
    createDepartment: true,
    updateDepartment: true,
    deleteDepartment: true,
    restoreDepartment: true,
    readDepartment: true,

    readAssetList: true,
    createAsset: true,
    readAsset: true,
    updateAsset: true,
    restoreAsset: true,
    deleteAsset: true,

    createHoliday: true,
    deleteHoliday: true,
    readHoliday: true,
    assignDepartment: true,
    transferDepartment: true,
    readDepartmentAssignList: true,
    readDepartmentAssign: true,
    updateDepartmentAssign: true,
    deleteDepartmentAssign: true,
    restoreDepartmentAssign: true,
    readShift: true,
    createShift: true,
    updateShift: true,
    deleteShift: true,
    restoreShift: true
  }

  next()
}

export const verifyUser = verifyUserMiddleware
export default verifyUserMiddleware
