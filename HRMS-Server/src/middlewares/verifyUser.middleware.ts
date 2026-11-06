import type { NextFunction, Request, Response } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../config/auth.config.js'

export const verifyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    })

    if (!session) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    req.userId = session.user.id
    req.username = session.user.name || session.user.email

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
  } catch (error) {
    next(error)
  }
}

export const verifyUser = verifyUserMiddleware
export default verifyUserMiddleware
