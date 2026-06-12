"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function BaseRequestsRedirectPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else {
        // Staff has access to staff requests; all others are blocked and redirected to dashboard
        if (user?.role === "staff") {
          router.push("/staff/requests");
        } else {
          router.push(user?.role === "admin" ? "/admin" : "/resident/dashboard");
        }
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm p-6 rounded-3xl border border-slate-100 bg-white shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800">Access Restricted</h3>
        <p className="text-xs text-slate-400 leading-relaxed font-semibold">
          You do not have permission to access this module. Redirecting you shortly...
        </p>
      </div>
    </div>
  );
}
