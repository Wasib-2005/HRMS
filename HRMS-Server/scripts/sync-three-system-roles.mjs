import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { MongoClient, ObjectId } from 'mongodb';

const scriptDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(scriptDir, '../.env') });

const allPermissions = [
  'readEmployeeList', 'readEmployee', 'createEmployee', 'updateEmployee', 'deleteEmployee',
  'readRoleList', 'readRole', 'createRole', 'updateRole', 'deleteRole', 'restoreRole',
  'readDepartmentList', 'readDepartment', 'createDepartment', 'updateDepartment', 'deleteDepartment', 'restoreDepartment',
  'readAssetList', 'assignAsset', 'createAsset', 'readAsset', 'updateAsset', 'deleteAsset', 'restoreAsset',
  'readHolidayList', 'readHoliday', 'createHoliday', 'updateHoliday', 'deleteHoliday', 'restoreHoliday',
  'assignDepartment', 'transferDepartment', 'readDepartmentAssignList', 'readDepartmentAssign', 'updateDepartmentAssign', 'deleteDepartmentAssign', 'restoreDepartmentAssign',
  'readShift', 'createShift', 'updateShift', 'deleteShift', 'restoreShift'
];

const hrPermissions = [
  'readEmployeeList', 'readEmployee', 'createEmployee', 'updateEmployee',
  'readDepartmentList', 'readDepartment', 'createDepartment', 'updateDepartment',
  'readAssetList', 'assignAsset', 'createAsset', 'readAsset', 'updateAsset',
  'readHolidayList', 'readHoliday', 'createHoliday',
  'assignDepartment', 'transferDepartment', 'readDepartmentAssignList', 'readDepartmentAssign',
  'readShift', 'createShift', 'updateShift'
];

const employeePermissions = [
  'readEmployee',
  'readDepartment',
  'readAsset',
  'readHolidayList', 'readHoliday',
  'readShift'
];

async function syncSystemRoles() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();

  console.log('--- Cleaning up non-standard roles ---');
  // Mark old Super Admin as deleted
  await db.collection('roles').updateMany(
    { name: { $nin: ['Admin', 'HR', 'Employee'] } },
    { $set: { isDeleted: true, deletedAt: new Date() } }
  );

  const systemRoles = [
    {
      name: 'Admin',
      description: 'System Administrator with full management and configuration permissions',
      perms: allPermissions
    },
    {
      name: 'HR',
      description: 'Human Resources management, employee directory, and operations',
      perms: hrPermissions
    },
    {
      name: 'Employee',
      description: 'Standard staff member self-service portal access',
      perms: employeePermissions
    }
  ];

  const roleMap = {};

  for (const roleDef of systemRoles) {
    const existing = await db.collection('roles').findOne({ name: roleDef.name });
    const now = new Date();
    const permissionsObj = Object.fromEntries(roleDef.perms.map(p => [p, true]));

    if (existing) {
      await db.collection('roles').updateOne(
        { _id: existing._id },
        {
          $set: {
            description: roleDef.description,
            status: 'active',
            permissions: permissionsObj,
            isDeleted: false,
            deletedAt: null,
            updatedAt: now
          }
        }
      );
      roleMap[roleDef.name] = existing._id;
      console.log(`Updated active system role [${roleDef.name}] -> ${existing._id}`);
    } else {
      const res = await db.collection('roles').insertOne({
        name: roleDef.name,
        description: roleDef.description,
        status: 'active',
        permissions: permissionsObj,
        isDeleted: false,
        deletedAt: null,
        createdAt: now,
        updatedAt: now
      });
      roleMap[roleDef.name] = res.insertedId;
      console.log(`Created system role [${roleDef.name}] -> ${res.insertedId}`);
    }
  }

  console.log('--- Syncing user accounts to strictly 3 roles ---');
  const userUpdates = [
    { email: 'admin@hrms.com', name: 'System Admin', role: 'Admin' },
    { email: 'hr@hrms.com', name: 'HR Manager', role: 'HR' },
    { email: 'employee@hrms.com', name: 'John Staff', role: 'Employee' }
  ];

  for (const u of userUpdates) {
    const rId = roleMap[u.role];
    await db.collection('user').updateOne(
      { email: u.email },
      {
        $set: {
          name: u.name,
          role: u.role,
          roleName: u.role,
          roleId: rId
        }
      }
    );
    console.log(`Synced user [${u.email}] -> role: ${u.role}, name: ${u.name}`);
  }

  // Ensure any other users in DB have a valid role fallback
  await db.collection('user').updateMany(
    { role: { $nin: ['Admin', 'HR', 'Employee'] } },
    { $set: { role: 'Employee', roleName: 'Employee', roleId: roleMap['Employee'] } }
  );

  console.log('\nFinal Roles in DB:');
  const activeRoles = await db.collection('roles').find({ isDeleted: { $ne: true } }).toArray();
  activeRoles.forEach(r => console.log(` * ${r.name} (${r._id}) - status: ${r.status}`));

  console.log('\nFinal Users in DB:');
  const allUsers = await db.collection('user').find().toArray();
  allUsers.forEach(u => console.log(` * ${u.email} | Name: ${u.name} | Role: ${u.role}`));

  await client.close();
  console.log('\nSystem roles successfully synchronized to 3 types: Admin, HR, Employee!');
}

syncSystemRoles().catch(err => {
  console.error(err);
  process.exit(1);
});
