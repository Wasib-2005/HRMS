export const SYSTEM_ROLES = ['Admin', 'HR', 'Employee'] as const;

export type AppRole = (typeof SYSTEM_ROLES)[number];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: AppRole;
  permissions?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthSession {
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: AuthUser;
}
