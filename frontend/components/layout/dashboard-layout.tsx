"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { RoleGuard } from "./role-guard";
import type { Role } from "@/lib/types";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useViewport } from "@/hooks/use-viewport";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const isCollapsed = useUIStore((s) => s.isCollapsed);
  const setMobileOpen = useUIStore((s) => s.setMobileOpen);
  const { isDesktop } = useViewport();

  // Automatically close mobile menu when scaling up to desktop
  useEffect(() => {
    if (isDesktop) {
      setMobileOpen(false);
    }
  }, [isDesktop, setMobileOpen]);

  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-slate-50/40 dark:bg-slate-950/20">
        <Sidebar />
        <div 
          className={cn(
            "flex flex-1 flex-col transition-all duration-300 ease-in-out w-full min-w-0",
            "pl-0 lg:pl-[260px]", // 0 padding on mobile/tablet, 260px on desktop
            isCollapsed && "lg:pl-[76px]" // 76px when collapsed on desktop
          )}
        >
          <Navbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 w-full min-w-0 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
