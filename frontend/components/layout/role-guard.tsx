"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import type { Role } from "@/lib/types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        // Redirect unauthorized users to their own dashboard
        switch (user.role) {
          case "admin":
            router.push("/admin");
            break;
          case "staff":
            router.push("/staff");
            break;
          case "resident":
            router.push("/resident/dashboard");
            break;
          default:
            router.push("/auth/login");
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
          <p className="text-sm text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
