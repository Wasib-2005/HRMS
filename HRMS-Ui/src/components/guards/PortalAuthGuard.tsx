"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export default function PortalAuthGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;

    getSession()
      .then((session) => {
        if (active && !session?.user) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => {
        if (active) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      })
      .finally(() => {
        if (active) {
          setIsChecking(false);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-md text-sky-600"></span>
          <p className="text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
