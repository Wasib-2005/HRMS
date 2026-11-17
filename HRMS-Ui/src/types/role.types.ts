export type PermissionKey =
  | 'readEmployeeList'
  | 'readEmployee'
  | 'createEmployee'
  | 'updateEmployee'
  | 'deleteEmployee'
  | 'readRoleList'
  | 'readRole'
  | 'createRole'
  | 'updateRole'
  | 'deleteRole'
  | 'restoreRole'
  | 'readDepartmentList'
  | 'readDepartment'
  | 'createDepartment'
  | 'updateDepartment'
  | 'deleteDepartment'
  | 'restoreDepartment'
  | 'readAssetList'
  | 'assignAsset'
  | 'createAsset'
  | 'readAsset'
  | 'updateAsset'
  | 'deleteAsset'
  | 'restoreAsset'
  | 'readHolidayList'
  | 'readHoliday'
  | 'createHoliday'
  | 'updateHoliday'
  | 'deleteHoliday'
  | 'restoreHoliday'
  | 'assignDepartment'
  | 'transferDepartment'
  | 'readDepartmentAssignList'
  | 'readDepartmentAssign'
  | 'updateDepartmentAssign'
  | 'deleteDepartmentAssign'
  | 'restoreDepartmentAssign'
  | 'readShift'
  | 'createShift'
  | 'updateShift'
  | 'deleteShift'
  | 'restoreShift';

export type PermissionsMap = Record<PermissionKey, boolean>;

export interface RoleInterface {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  permissions: Record<string, boolean>;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}
