import dotenv from 'dotenv'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { MongoClient } from 'mongodb'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'

const scriptDir = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(scriptDir, '../.env') })

function parseArguments(args) {
  const values = { email: '', password: '' }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--help' || arg === '-h') {
      return { help: true, ...values }
    }

    const [flag, inlineValue] = arg.split('=', 2)
    const key = flag === '-e' || flag === '--email'
      ? 'email'
      : flag === '-p' || flag === '--password'
        ? 'password'
        : undefined

    if (!key) {
      throw new Error(`Unknown option: ${flag}`)
    }

    const value = inlineValue ?? args[index + 1]
    if (!value || value.startsWith('-')) {
      throw new Error(`Missing value for ${flag}`)
    }

    values[key] = value
    if (inlineValue === undefined) index += 1
  }

  return { help: false, ...values }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /[1-9]/.test(password)
}

const adminPermissions = [
  'readEmployeeList',
  'readEmployee',
  'createEmployee',
  'updateEmployee',
  'deleteEmployee',
  'readRoleList',
  'readRole',
  'createRole',
  'updateRole',
  'deleteRole',
  'restoreRole',
  'readDepartmentList',
  'readDepartment',
  'createDepartment',
  'updateDepartment',
  'deleteDepartment',
  'restoreDepartment',
  'readAssetList',
  'assignAsset',
  'createAsset',
  'readAsset',
  'updateAsset',
  'deleteAsset',
  'restoreAsset',
  'readHolidayList',
  'readHoliday',
  'createHoliday',
  'updateHoliday',
  'deleteHoliday',
  'restoreHoliday',
  'assignDepartment',
  'transferDepartment',
  'readDepartmentAssignList',
  'readDepartmentAssign',
  'updateDepartmentAssign',
  'deleteDepartmentAssign',
  'restoreDepartmentAssign',
  'readShift',
  'createShift',
  'updateShift',
  'deleteShift',
  'restoreShift'
]

async function askYesNo(prompt) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Admin setup requires an interactive terminal.')
  }

  const readline = createInterface({ input: process.stdin, output: process.stdout })
  try {
    while (true) {
      const answer = (await readline.question(`${prompt} (y/N): `)).trim().toLowerCase()
      if (['y', 'yes'].includes(answer)) return true
      if (['n', 'no', ''].includes(answer)) return false
      console.error('Please answer yes or no.')
    }
  } finally {
    readline.close()
  }
}

function promptHidden(prompt) {
  const input = process.stdin

  if (!input.isTTY) {
    throw new Error('Use -p/--password when running without an interactive terminal.')
  }

  return new Promise((resolvePrompt, rejectPrompt) => {
    const wasRaw = input.isRaw
    const chars = []

    const cleanup = () => {
      input.off('data', onData)
      input.setRawMode(wasRaw ?? false)
      input.pause()
      process.stdout.write('\n')
    }

    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === '\u0003') {
          cleanup()
          rejectPrompt(new Error('Input cancelled.'))
          return
        }

        if (char === '\r' || char === '\n') {
          cleanup()
          resolvePrompt(chars.join(''))
          return
        }

        if (char === '\u007f' || char === '\b') {
          if (chars.pop() !== undefined) {
            process.stdout.write('\b \b')
          }
        } else if (char >= ' ') {
          chars.push(char)
          process.stdout.write('*')
        }
      }
    }

    process.stdout.write(prompt)
    input.setRawMode(true)
    input.setEncoding('utf8')
    input.resume()
    input.on('data', onData)
  })
}

async function promptForMissingValues(values) {
  const interactive = process.stdin.isTTY && process.stdout.isTTY

  if (!interactive && (!values.email || !values.password)) {
    throw new Error('Provide both --email and --password when running without an interactive terminal.')
  }

  if (!values.email) {
    const readline = createInterface({ input: process.stdin, output: process.stdout })
    try {
      do {
        values.email = (await readline.question('Email: ')).trim()
        if (!validateEmail(values.email)) {
          console.error('Please enter a valid email address.')
        }
      } while (!validateEmail(values.email))
    } finally {
      readline.close()
    }
  }

  if (!values.password) {
    do {
      values.password = await promptHidden('Password: ')
      if (!validatePassword(values.password)) {
        console.error('Password must be at least 8 characters and contain at least one letter and one digit from 1 to 9.')
      }
    } while (!validatePassword(values.password))
  }

  if (!validateEmail(values.email)) {
    throw new Error('Please provide a valid email address.')
  }

  if (!validatePassword(values.password)) {
    throw new Error('Password must be at least 8 characters and contain at least one letter and one digit from 1 to 9.')
  }

  return values
}

async function createUser({ email, password }, adminSetup, auth) {
  const result = await auth.api.signUpEmail({
    body: {
      name: email.split('@')[0],
      email,
      password
    }
  })
  const createdEmail = result?.user?.email || email
  console.log(`User created: ${createdEmail}`)

  if (!adminSetup?.assignAdmin) {
    if (adminSetup?.requestedAdmin) {
      console.log('Created as a regular user because no Admin role was selected.')
    }
    return
  }

  const users = adminSetup.db.collection('user')
  const user = await users.findOne({ email: createdEmail })
  if (!user) {
    throw new Error(`User was created, but could not find ${createdEmail} in MongoDB to assign the Admin role.`)
  }

  let adminRole = adminSetup.role
  if (adminSetup.createRole) {
    const now = new Date()
    const role = {
      name: 'Admin',
      description: 'Full system access',
      status: 'active',
      permissions: Object.fromEntries(adminPermissions.map(permission => [permission, true])),
      createdBy: user._id,
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      createdAt: now,
      updatedAt: now
    }

    try {
      const insertResult = await adminSetup.db.collection('roles').insertOne(role)
      adminRole = { _id: insertResult.insertedId }
    } catch (error) {
      if (error?.code !== 11000) throw error
      adminRole = await adminSetup.db.collection('roles').findOne({
        name: /^admin$/i,
        isDeleted: { $ne: true }
      })
      if (!adminRole) throw error
    }
  }

  if (!adminRole) {
    throw new Error('User was created, but the Admin role could not be found or created.')
  }

  const updateResult = await users.updateOne(
    { _id: user._id },
    { $set: { role: adminRole._id.toString() } }
  )
  if (updateResult.matchedCount !== 1) {
    throw new Error(`User was created, but could not assign the Admin role to ${createdEmail}.`)
  }

  console.log(`Admin role assigned: ${adminRole._id}`)
}

const usage = `Usage:
  pnpm user
  pnpm user -e "was@was.was" -p "wasib123"

Options:
  -e, --email       User email
  -p, --password    User password
  -h, --help        Show this help`

async function main() {
  const args = parseArguments(process.argv.slice(2))
  if (args.help) {
    console.log(usage)
    return
  }

  const credentials = await promptForMissingValues(args)
  const requestedAdmin = await askYesNo('Make this user an admin?')
  const mongoURI = process.env.MONGO_URI?.trim()
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in HRMS-Server/.env.')
  }

  const client = new MongoClient(mongoURI)
  let adminSetup = { assignAdmin: false, requestedAdmin }

  try {
    await client.connect()
    const db = client.db()
    const baseURL = (process.env.BETTER_AUTH_URL || 'http://localhost:5000').replace(/\/+$/, '')
    const auth = betterAuth({
      database: mongodbAdapter(db, { client }),
      secret: process.env.BETTER_AUTH_SECRET || '',
      baseURL,
      emailAndPassword: { enabled: true },
      trustedOrigins: process.env.ALLOW_ORIGIN
        ? process.env.ALLOW_ORIGIN.split(',')
        : ['http://localhost:5000', 'http://localhost:3000']
    })

    if (requestedAdmin) {
      const role = await db.collection('roles').findOne({
        name: /^admin$/i,
        isDeleted: { $ne: true }
      })

      if (role) {
        adminSetup = { assignAdmin: true, requestedAdmin, db, role }
      } else {
        console.log('Admin role not found.')
        const createRole = await askYesNo('Create an Admin role with full permissions?')
        adminSetup = { assignAdmin: createRole, requestedAdmin, createRole, db }
      }
    }

    await createUser(credentials, adminSetup, auth)
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
