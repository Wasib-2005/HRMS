import { auth } from '../../config/auth.config.js'

export const getSessionService = async (headers: Headers) => {
  return await auth.api.getSession({
    headers
  })
}

export const authService = {
  auth,
  getSession: getSessionService
}

export default authService
