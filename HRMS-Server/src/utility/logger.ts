interface LogDataInterface {
  [key: string]: any
}

const NODE_ENV = process.env.NODE_ENV || 'development'
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

// Define priority numbers for filtering
const LOG_LEVELS: Record<string, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const shouldLog = (level: string): boolean => {
  const currentLevel = LOG_LEVEL.toLowerCase()
  const targetLevel = level.toLowerCase()

  const currentPriority = LOG_LEVELS[currentLevel] ?? 1 // default to info (1)
  const targetPriority = LOG_LEVELS[targetLevel] ?? 1

  return targetPriority >= currentPriority
}

const formatAndPrint = (level: string, logData: LogDataInterface) => {
  // Skip if the log level is lower than the configured LOG_LEVEL
  if (!shouldLog(level)) return

  const timestamp = new Date().toISOString()

  if (NODE_ENV === 'production') {
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      ...logData,
      environment: NODE_ENV
    }
    console.log(JSON.stringify(logEntry))
  } else {
    const { userId, username, message, data, ...rest } = logData
    const userInfo = userId ? `[User: ${username || userId}]` : ''
    const colorTag =
      level === 'error' ? '[ERROR]' : level === 'warn' ? ' [WARN]' : '[INFO]'

    console.log(`${colorTag} [${timestamp}] ${userInfo} ${message || ''}`)

    if (data !== undefined) {
      console.log('Data:', data)
    }

    if (Object.keys(rest).length > 0) {
      console.log('Metadata:', rest)
    }
  }
}

export const logger = {
  info: (logData: LogDataInterface) => formatAndPrint('info', logData),
  error: (logData: LogDataInterface) => formatAndPrint('error', logData),
  warn: (logData: LogDataInterface) => formatAndPrint('warn', logData),
  debug: (logData: LogDataInterface) => formatAndPrint('debug', logData)
}
