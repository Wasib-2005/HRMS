"use client";

import { useAuth } from "./useAuth";
import { PermissionKey } from "@/types/role.types";

export function usePermissions() {
  const { permissions, isSuperAdmin } = useAuth();

  const hasPermission = (permission: PermissionKey): boolean => {
    if (isSuperAdmin) return true;
    return Boolean(permissions[permission]);
  };

  const hasAnyPermission = (perms: PermissionKey[]): boolean => {
    if (isSuperAdmin) return true;
    return perms.some((p) => Boolean(permissions[p]));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
  };
}

export default usePermissions;
