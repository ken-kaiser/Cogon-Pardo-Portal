"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function AdminRequestsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user?.role !== "staff") {
      // Show blocked message and redirect to respective dashboard
      const timer = setTimeout(() => {
        router.push(user?.role === "admin" ? "/admin" : "/resident/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">Access Restricted</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
          You do not have permission to access this module. Redirecting you shortly...
        </p>
      </div>
    </div>
  );
}
