import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { MongoClient, ObjectId } from 'mongodb';

const scriptDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(scriptDir, '../.env') });

async function seedAttendance() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();

  console.log('--- Registering Attendance Hardware Terminals ---');
  const devices = [
    {
      deviceId: 'DEV-TERM-01',
      name: 'Main Entrance Turnstile',
      ipAddress: '192.168.1.201',
      macAddress: '00:1A:79:3E:45:90',
      location: 'Ground Floor Lobby - Gate A',
      protocol: 'REST_WEBHOOK',
      status: 'online',
      apiKey: 'hw_key_lobby_gate_a_9921',
      lastHeartbeat: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      deviceId: 'DEV-TERM-02',
      name: 'Cafeteria Break Scanner',
      ipAddress: '192.168.1.202',
      macAddress: '00:1A:79:3E:45:91',
      location: '2nd Floor Cafeteria Entrance',
      protocol: 'REST_WEBHOOK',
      status: 'online',
      apiKey: 'hw_key_cafeteria_3310',
      lastHeartbeat: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  for (const dev of devices) {
    await db.collection('attendancedevices').updateOne(
      { deviceId: dev.deviceId },
      { $set: dev },
      { upsert: true }
    );
    console.log(`Registered hardware terminal: ${dev.name} (${dev.deviceId})`);
  }

  // Find employee John Staff
  const employee = await db.collection('user').findOne({ email: 'employee@hrms.com' });
  if (employee) {
    console.log(`Seeding attendance record for ${employee.name} (${employee.email})...`);

    const recordDate = '2026-10-22';
    const punchCheckIn = new Date('2026-10-22T09:28:00+06:00');
    const punchBreakStart = new Date('2026-10-22T12:30:00+06:00');
    const punchBreakEnd = new Date('2026-10-22T13:00:00+06:00');
    const punchCheckOut = new Date('2026-10-22T18:00:00+06:00');

    const attendanceDoc = {
      userId: employee._id,
      employeeCode: 'EMP001',
      date: recordDate,
      shiftName: '09:30–18:00 · On-site',
      scheduledStart: '09:30',
      scheduledEnd: '18:00',
      scheduledUnpaidBreakMinutes: 30,
      targetWorkMinutes: 480,
      punches: [
        {
          _id: new ObjectId(),
          punchTime: punchCheckIn,
          punchType: 'CHECK_IN',
          deviceId: 'DEV-TERM-01',
          deviceName: 'Main Entrance Turnstile',
          verifyMode: 'FINGERPRINT',
          note: '2 min before scheduled start'
        },
        {
          _id: new ObjectId(),
          punchTime: punchBreakStart,
          punchType: 'BREAK_START',
          deviceId: 'DEV-TERM-02',
          deviceName: 'Cafeteria Break Scanner',
          verifyMode: 'RFID_CARD',
          note: 'Unpaid break'
        },
        {
          _id: new ObjectId(),
          punchTime: punchBreakEnd,
          punchType: 'BREAK_END',
          deviceId: 'DEV-TERM-02',
          deviceName: 'Cafeteria Break Scanner',
          verifyMode: 'RFID_CARD',
          note: '30 min recorded'
        },
        {
          _id: new ObjectId(),
          punchTime: punchCheckOut,
          punchType: 'CHECK_OUT',
          deviceId: 'DEV-TERM-01',
          deviceName: 'Main Entrance Turnstile',
          verifyMode: 'FACE',
          note: 'Day complete'
        }
      ],
      firstCheckIn: punchCheckIn,
      lastCheckOut: punchCheckOut,
      breaks: [
        {
          startTime: punchBreakStart,
          endTime: punchBreakEnd,
          durationMinutes: 30,
          isPaid: false
        }
      ],
      elapsedSpanMinutes: 512, // 8h 32m
      totalBreakMinutes: 30,
      effectiveWorkedMinutes: 482, // 8h 02m
      status: 'on_target',
      isOvertime: false,
      isUndertime: false,
      differenceMinutes: 2, // +2 min
      lastSyncedAt: new Date(),
      lastDeviceName: 'Main Entrance Turnstile',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('attendances').updateOne(
      { userId: employee._id, date: recordDate },
      { $set: attendanceDoc },
      { upsert: true }
    );

    console.log(`Seeded hardware attendance document for date ${recordDate}`);
  }

  await client.close();
  console.log('Attendance hardware seed complete!');
}

seedAttendance().catch(console.error);
