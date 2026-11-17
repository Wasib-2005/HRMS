 import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { MongoClient, ObjectId } from 'mongodb';

const scriptDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(scriptDir, '../.env') });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();

  await db.collection('user').updateOne(
    { email: 'admin@hrms.com' },
    { $set: { role: 'Admin', roleName: 'Admin', roleId: new ObjectId('6af94f30884b2a9ae107b314') } }
  );

  await db.collection('user').updateOne(
    { email: 'hr@hrms.com' },
    { $set: { role: 'HR', roleName: 'HR', roleId: new ObjectId('6af94f31884b2a9ae107b315') } }
  );

  await db.collection('user').updateOne(
    { email: 'employee@hrms.com' },
    { $set: { role: 'Employee', roleName: 'Employee', roleId: new ObjectId('6af94f31884b2a9ae107b316') } }
  );

  const users = await db.collection('user').find().toArray();
  users.forEach(u => console.log(u.email, '-> role:', u.role, 'roleName:', u.roleName));
  await client.close();
}

run().catch(console.error);
