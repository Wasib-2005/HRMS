import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { MongoClient } from 'mongodb';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';

const scriptDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(scriptDir, '../.env') });

const adminPermissions = [
  'readEmployeeList', 'readEmployee', 'createEmployee', 'updateEmployee', 'deleteEmployee',
  'readRoleList', 'readRole', 'createRole', 'updateRole', 'deleteRole', 'restoreRole',
  'readDepartmentList', 'readDepartment', 'createDepartment', 'updateDepartment', 'deleteDepartment', 'restoreDepartment',
  'readAssetList', 'assignAsset', 'createAsset', 'readAsset', 'updateAsset', 'deleteAsset', 'restoreAsset',
  'readHolidayList', 'readHoliday', 'createHoliday', 'updateHoliday', 'deleteHoliday', 'restoreHoliday',
  'assignDepartment', 'transferDepartment', 'readDepartmentAssignList', 'readDepartmentAssign', 'updateDepartmentAssign', 'deleteDepartmentAssign', 'restoreDepartmentAssign',
  'readShift', 'createShift', 'updateShift', 'deleteShift', 'restoreShift'
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

  const email = 'admin@hrms.com';
  const password = 'Admin@123456';
  const name = 'Super Admin';

  console.log('Registering Super Admin account via Better-Auth...');
  let user = await db.collection('user').findOne({ email });

  if (!user) {
    const result = await auth.api.signUpEmail({
      body: { name, email, password }
    });
    console.log('User signed up:', result?.user?.email);
    user = await db.collection('user').findOne({ email });
  } else {
    console.log('User already exists in DB:', user.email);
  }

  if (!user) {
    throw new Error('Failed to find user in MongoDB.');
  }

  let role = await db.collection('roles').findOne({ name: 'Super Admin', isDeleted: { $ne: true } });
  if (!role) {
    console.log('Creating Super Admin role with full permissions...');
    const now = new Date();
    const roleDoc = {
      name: 'Super Admin',
      description: 'Full system access with all permissions enabled',
      status: 'active',
      permissions: Object.fromEntries(adminPermissions.map(p => [p, true])),
      createdBy: user._id,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: now,
      updatedAt: now
    };
    const roleRes = await db.collection('roles').insertOne(roleDoc);
    role = { _id: roleRes.insertedId };
    console.log('Role created with ID:', role._id);
  } else {
    console.log('Role already exists with ID:', role._id);
  }

  await db.collection('user').updateOne(
    { _id: user._id },
    { $set: { role: role._id.toString() } }
  );
  console.log(`Successfully assigned Super Admin role (${role._id}) to user (${user.email})!`);

  await client.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
