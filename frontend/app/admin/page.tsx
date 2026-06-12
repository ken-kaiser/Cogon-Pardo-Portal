"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import { useApplicants } from "@/hooks/use-applicants";
import api from "@/lib/api";
import { SkeletonCard } from "@/components/ui/skeleton";
import type { User, Resident } from "@/lib/types";
import { Users, Shield, Clock, CheckCircle2, Briefcase, ChevronRight, UserCheck } from "lucide-react";

export default function AdminDashboard() {
  // Query users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await api.get("/accounts/users/");
      return data.results ?? data;
    },
  });

  // Query residents
  const { data: residents = [], isLoading: isLoadingResidents } = useQuery<Resident[]>({
    queryKey: ["residents"],
    queryFn: async () => {
      const { data } = await api.get("/residents/");
      return data.results ?? data;
    },
  });

  // Query careers applicants
  const { applicants, isLoading: isLoadingApplicants } = useApplicants();

  const activeStaff = users.filter((u) => u.role === "staff").length;
  const verifiedResidents = residents.filter((r) => r.verification_status === "verified").length;
  const pendingApplicants = applicants.filter((a) => a.status === "pending").length;

  const stats = [
    { label: "Total Users", value: users.length, description: `${activeStaff} active staff`, icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Registered Residents", value: residents.length, description: `${verifiedResidents} verified`, icon: UserCheck, color: "from-emerald-500 to-green-600" },
    { label: "Job Applicants", value: applicants.length, description: `${pendingApplicants} pending review`, icon: Briefcase, color: "from-amber-500 to-orange-500" },
    { label: "System Security", value: "Secure", description: "Audit logs active", icon: Shield, color: "from-violet-500 to-purple-600" },
  ];

  const isLoading = isLoadingUsers || isLoadingResidents || isLoadingApplicants;

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">System overview and recruitment portal management</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{s.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">{s.description}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-sm`}>
                    <s.icon size={18} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Quick Actions Panel */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Quick Actions</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Manage Portal Users", href: "/admin/users", icon: Users, desc: "Add, view, and assign staff permissions" },
                  { label: "Residents Registry", href: "/admin/residents", icon: UserCheck, desc: "Verify and manage resident credentials" },
                  { label: "Careers Manager", href: "/admin/careers", icon: Briefcase, desc: "Review hiring stages & candidates" },
                  { label: "Audit & Security Logs", href: "/admin/audit", icon: Shield, desc: "Track system access history logs" },
                ].map((action) => (
                  <a key={action.href} href={action.href} className="group flex flex-col justify-between rounded-2xl border border-slate-100 dark:border-slate-800/50 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition">
                        <action.icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{action.label}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-semibold leading-relaxed">{action.desc}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Registered Users Activity Panel */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Recent Portal Accessions</h2>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Newly registered users on the Cogon-Pardo Portal</p>
              <div className="mt-4 space-y-3">
                {users.slice(0, 4).map((usr) => (
                  <div key={usr.id} className="flex items-center justify-between rounded-xl bg-slate-50/50 dark:bg-slate-800/20 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                        {usr.first_name[0]}{usr.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{usr.first_name} {usr.last_name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{usr.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {usr.role}
                      </span>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Joined {new Date(usr.date_joined).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
