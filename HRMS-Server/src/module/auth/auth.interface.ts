export interface ISessionUser {
  id: string
  email: string
  name?: string
  [key: string]: any
}

export interface ISession {
  session: {
    id: string
    userId: string
    expiresAt: Date
    [key: string]: any
  }
  user: ISessionUser
}
