"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { User } from "@/lib/types";
import { Shield } from "lucide-react";
import { MarqueeCell } from "@/components/ui/marquee-cell";

const roleBadge: Record<string, string> = {
  admin: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  staff: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  resident: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
};

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await api.get("/accounts/users/");
      return data.results ?? data;
    },
  });

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">View and manage all system users</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 dark:border-slate-800 dark:border-t-slate-400" /></div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Purok/Sitio</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contact</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Verified</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Joined</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300">{u.first_name} {u.last_name}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400"><MarqueeCell text={u.email} maxWidth={180} /></td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400"><MarqueeCell text={u.purok_sitio || "N/A"} maxWidth={140} /></td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400"><MarqueeCell text={u.phone_number || "—"} maxWidth={130} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase ${roleBadge[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm">{u.is_verified ? <span className="text-emerald-500">✓</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-400 dark:text-slate-500">{new Date(u.date_joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
