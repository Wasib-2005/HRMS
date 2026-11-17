import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { MongoClient } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';

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

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();

  const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    secret: process.env.BETTER_AUTH_SECRET || '',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
    emailAndPassword: { enabled: true },
    trustedOrigins: ['http://localhost:5000', 'http://localhost:3000']
  });

  const rolesConfig = [
    {
      name: 'Admin',
      description: 'Full administrative control over all features',
      perms: allPermissions
    },
    {
      name: 'HR',
      description: 'Human resources management, employee records, and company operations',
      perms: hrPermissions
    },
    {
      name: 'Employee',
      description: 'Standard staff member self-service access',
      perms: employeePermissions
    }
  ];

  const roleMap = {};

  for (const r of rolesConfig) {
    let existing = await db.collection('roles').findOne({ name: r.name, isDeleted: { $ne: true } });
    if (!existing) {
      const now = new Date();
      const doc = {
        name: r.name,
        description: r.description,
        status: 'active',
        permissions: Object.fromEntries(r.perms.map(p => [p, true])),
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        createdAt: now,
        updatedAt: now
      };
      const res = await db.collection('roles').insertOne(doc);
      roleMap[r.name] = res.insertedId;
      console.log(`Created role [${r.name}] with ID:`, res.insertedId);
    } else {
      roleMap[r.name] = existing._id;
      console.log(`Found existing role [${r.name}] with ID:`, existing._id);
    }
  }

  // Also map Super Admin to Admin if existing
  const superAdminRole = await db.collection('roles').findOne({ name: 'Super Admin', isDeleted: { $ne: true } });
  if (superAdminRole) {
    roleMap['Super Admin'] = superAdminRole._id;
  }

  const accounts = [
    {
      name: 'System Admin',
      email: 'admin@hrms.com',
      password: 'Admin@123456',
      role: 'Admin'
    },
    {
      name: 'HR Manager',
      email: 'hr@hrms.com',
      password: 'Hr@123456',
      role: 'HR'
    },
    {
      name: 'John Staff',
      email: 'employee@hrms.com',
      password: 'Employee@123456',
      role: 'Employee'
    }
  ];

  for (const acc of accounts) {
    let user = await db.collection('user').findOne({ email: acc.email });
    if (!user) {
      console.log(`Registering account for ${acc.email}...`);
      await auth.api.signUpEmail({
        body: {
          name: acc.name,
          email: acc.email,
          password: acc.password
        }
      });
      user = await db.collection('user').findOne({ email: acc.email });
    }

    if (user && roleMap[acc.role]) {
      await db.collection('user').updateOne(
        { _id: user._id },
        { $set: { role: roleMap[acc.role].toString() } }
      );
      console.log(`Assigned role [${acc.role}] (${roleMap[acc.role]}) to ${acc.email}`);
    }
  }

  await client.close();
  console.log('Seeding completed successfully!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
