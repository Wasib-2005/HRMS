"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppRole } from "@/types/auth.types";
import { PermissionKey } from "@/types/role.types";

export default function Can({
  roles,
  permission,
  children,
}: {
  roles?: AppRole[];
  permission?: PermissionKey;
  children: React.ReactNode;
}) {
  const { role, permissions, isSuperAdmin } = useAuth();

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  if (roles && !roles.includes(role)) {
    return null;
  }

  if (permission && !permissions[permission]) {
    return null;
  }

  return <>{children}</>;
}
