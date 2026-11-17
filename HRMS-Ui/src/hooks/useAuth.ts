"use client";

import { useEffect, useState, useCallback } from "react";
import { getSession } from "@/lib/auth";
import { AuthUser, AppRole, SYSTEM_ROLES } from "@/types/auth.types";
import { roleService } from "@/services/role.service";

/**
 * Normalizes any role string to strictly one of the 3 system roles:
 * "Admin" | "HR" | "Employee"
 */
export function normalizeRole(role?: string | null): AppRole {
  if (!role) return "Employee";
  const clean = role.trim().toLowerCase();
  if (clean === "admin" || clean === "super admin" || clean === "superadmin") return "Admin";
  if (clean === "hr" || clean === "hrmanager" || clean === "hr manager") return "HR";
  if (clean === "employee" || clean === "employe" || clean === "staff") return "Employee";
  return "Employee";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roleName, setRoleName] = useState<AppRole>("Employee");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const session = await getSession();
      if (session?.user) {
        const rawRole = (session.user.role || "Employee").toString().trim();

        // If the role is directly one of the 3 system roles or needs normalization
        if (!/^[0-9a-fA-F]{24}$/.test(rawRole)) {
          const resolvedRole = normalizeRole(rawRole);
          setRoleName(resolvedRole);
          setUser({ ...session.user, role: resolvedRole });
        } else {
          // If role is a MongoDB ObjectId, look up the role definition
          try {
            const roleRes = await roleService.getById(rawRole);
            if (roleRes?.data) {
              const resolvedRole = normalizeRole(roleRes.data.name);
              setRoleName(resolvedRole);
              setPermissions(roleRes.data.permissions || {});
              setUser({ ...session.user, role: resolvedRole });
            } else {
              setRoleName("Employee");
              setUser({ ...session.user, role: "Employee" });
            }
          } catch {
            setRoleName("Employee");
            setUser({ ...session.user, role: "Employee" });
          }
        }
      } else {
        setUser(null);
        setRoleName("Employee");
      }
    } catch {
      setUser(null);
      setRoleName("Employee");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const isAdmin = roleName === "Admin";
  const isHR = roleName === "HR";
  const isEmployee = roleName === "Employee";

  return {
    user,
    role: roleName,
    permissions,
    isAdmin,
    isSuperAdmin: isAdmin, // Backward compatibility alias
    isHR,
    isEmployee,
    loading,
    refresh: fetchUser,
  };
}

export default useAuth;
