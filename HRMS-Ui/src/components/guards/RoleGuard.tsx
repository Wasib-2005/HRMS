"use client";

import { useAuth } from "@/hooks/useAuth";
import { AppRole } from "@/types/auth.types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: AppRole[];
  children: React.ReactNode;
}) {
  const { role, loading } = useAuth();
  const router = useRouter();

  const isAllowed = allowedRoles.includes(role);

  useEffect(() => {
    if (!loading && !isAllowed) {
      router.replace("/dashboard");
    }
  }, [isAllowed, loading, router]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner text-sky-500"></span>
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
