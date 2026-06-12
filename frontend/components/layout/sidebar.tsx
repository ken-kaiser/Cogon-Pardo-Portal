"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  ScrollText,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Briefcase,
} from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  // Resident
  { label: "Dashboard", href: "/resident/dashboard", icon: LayoutDashboard, roles: ["resident"] },
  { label: "My Requests", href: "/resident/requests", icon: FileText, roles: ["resident"] },
  // Staff
  { label: "Dashboard", href: "/staff", icon: LayoutDashboard, roles: ["staff"] },
  { label: "Requests", href: "/staff/requests", icon: FileText, roles: ["staff"] },
  { label: "Residents", href: "/staff/residents", icon: Users, roles: ["staff"] },
  { label: "Certificates", href: "/staff/certificates", icon: ScrollText, roles: ["staff"] },
  // Admin
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin"] },
  { label: "Residents", href: "/admin/residents", icon: Users, roles: ["admin"] },
  { label: "Users", href: "/admin/users", icon: Shield, roles: ["admin"] },
  { label: "Careers", href: "/admin/careers", icon: Briefcase, roles: ["admin"] },
  { label: "Certificates", href: "/admin/certificates", icon: ScrollText, roles: ["admin"] },
  { label: "Audit Logs", href: "/admin/audit", icon: Settings, roles: ["admin"] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // shared Zustand UI States
  const collapsed = useUIStore((s) => s.isCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isMobileOpen = useUIStore((s) => s.isMobileOpen);
  const setMobileOpen = useUIStore((s) => s.setMobileOpen);

  if (!user) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile background overlay backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/20 dark:bg-black/40 backdrop-blur-sm transition-all duration-300 lg:hidden",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/65 backdrop-blur-xl transition-all duration-300 ease-in-out",
          // Desktop collapsed vs expanded widths
          collapsed ? "lg:w-[76px]" : "lg:w-[260px]",
          // Mobile responsive drawer slide states
          isMobileOpen ? "translate-x-0 w-[260px]" : "max-lg:-translate-x-full lg:translate-x-0 lg:block"
        )}
      >
        {/* ── Header / Logo Section ────────────────────────────── */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100/50 dark:border-slate-800/40 px-4 shrink-0">
          {(!collapsed || isMobileOpen) ? (
            <div className="flex items-center gap-2.5 pl-1.5">
              <div className="relative h-7 w-7 overflow-hidden rounded-lg flex items-center justify-center">
                <Image
                  src="/favicon.png"
                  alt="Cogon-Pardo Logo"
                  width={24}
                  height={24}
                  className="rounded object-cover"
                />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-slate-800 dark:text-white">
                Cogon-Pardo <span className="text-blue-600 dark:text-cyan-400 font-bold">Portal</span>
              </span>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg flex items-center justify-center">
                <Image
                  src="/favicon.png"
                  alt="Cogon-Pardo Logo"
                  width={28}
                  height={28}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          )}

          {/* Hide chevron arrow toggle on mobile viewports */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-cyan-400"
          >
            {collapsed ? <ChevronLeft size={18} className="rotate-180" /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* ── Navigation Items ─────────────────────────────────── */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-6">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)} // Auto dismiss drawer on mobile touch navigation
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300",
                  isActive
                    ? "bg-blue-600/90 text-white shadow-lg shadow-blue-600/15 border-l-[3px] border-cyan-300 dark:border-cyan-400"
                    : "text-slate-400 hover:bg-blue-50/50 dark:hover:bg-slate-900/50 hover:text-blue-600 dark:hover:text-cyan-400"
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-all duration-300 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400"
                  )}
                />
                {(!collapsed || isMobileOpen) && <span className="transition-opacity duration-300">{item.label}</span>}

                {/* Micro Indicator Glow dot */}
                {isActive && (!collapsed || isMobileOpen) && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300 dark:bg-cyan-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── User Profile / Footer Section ────────────────────── */}
        <div className="mt-auto border-t border-slate-100/50 dark:border-slate-800/40 p-4 shrink-0">
          {(!collapsed || isMobileOpen) ? (
            <div className="flex items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-900/20 border border-slate-100/10 dark:border-slate-800/10 rounded-xl p-2.5 shadow-sm transition-all hover:border-slate-200 dark:hover:border-slate-700">
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-white truncate">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
                <div className="pl-3.5 flex flex-col gap-0.5">
                  <p className="text-[10px] text-slate-400 truncate font-medium">{user.email}</p>
                  <span className="w-fit inline-flex items-center rounded bg-blue-50/80 dark:bg-blue-950/30 px-1 py-0 text-[8px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:shadow-sm active:scale-95 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800"
                title="Sign out"
              >
                <LogOut size={14} className="stroke-[2.5px]" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50/70 dark:bg-slate-900/20 border border-slate-100/10 dark:border-slate-800/10 text-slate-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 active:scale-95 shadow-sm"
              title="Sign out"
            >
              <LogOut size={16} className="stroke-[2.5px]" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
