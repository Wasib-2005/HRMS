export const SYSTEM_ROLES = ['Admin', 'HR', 'Employee'] as const;

export type SystemRole = (typeof SYSTEM_ROLES)[number];

export const normalizeRole = (role?: string | null): SystemRole => {
  if (!role) return 'Employee';
  const clean = role.trim().toLowerCase();
  if (clean === 'admin' || clean === 'super admin' || clean === 'superadmin') return 'Admin';
  if (clean === 'hr' || clean === 'hrmanager' || clean === 'hr manager') return 'HR';
  if (clean === 'employee' || clean === 'employe' || clean === 'staff') return 'Employee';
  return 'Employee';
};
