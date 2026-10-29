export const PERMISSIONS_LIST = [
  // Read Employee Data
  'readEmployeeList',
  'readEmployee',
  'createEmployee',
  'updateEmployee',
  'deleteEmployee',

  // Read Role Data
  'readRoleList',
  'readRole',
  'createRole',
  'updateRole',
  'deleteRole',
  'restoreRole',

  // Read Department Data
  'readDepartmentList',
  'readDepartment',
  'createDepartment',
  'updateDepartment',
  'deleteDepartment',
  'restoreDepartment',

  // Read Assets Data
  'readAssetList',
  'assignAsset',
  'createAsset',
  'readAsset',
  'updateAsset',
  'deleteAsset',
  'restoreAsset',

  // Read Holidays data
  'readHolidayList',
  'readHoliday',
  'createHoliday',
  'updateHoliday',
  'deleteHoliday',
  'restoreHoliday',

  // Department Assignment Data
  'assignDepartment',
  'transferDepartment',
  'readDepartmentAssignList',
  'readDepartmentAssign',
  'updateDepartmentAssign',
  'deleteDepartmentAssign',
  'restoreDepartmentAssign',

  // Shift Assignment Data
  'readShift',
  'createShift',
  'updateShift',
  'deleteShift',
  'restoreShift'
] as const

// Automatically derive the TypeScript type from the array
export type PermissionKey = typeof PERMISSIONS_LIST[number]

// Automatically create a type where all keys map to a boolean
export type PermissionsMap = Record<PermissionKey, boolean>
