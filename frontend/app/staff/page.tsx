"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRequests } from "@/hooks/use-requests";
import { FileText, Users, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { MarqueeCell } from "@/components/ui/marquee-cell";

export default function StaffDashboard() {
  const { requests, isLoading } = useRequests();
  const pending = requests.filter((r) => r.status === "pending").length;
  const inProgress = requests.filter((r) => ["under_review", "for_verification", "approved", "ready_printing"].includes(r.status)).length;
  const completed = requests.filter((r) => r.status === "completed").length;

  const stats = [
    { label: "Total", value: requests.length, icon: FileText, color: "from-blue-500 to-blue-600" },
    { label: "Pending", value: pending, icon: Clock, color: "from-amber-500 to-orange-500" },
    { label: "In Progress", value: inProgress, icon: TrendingUp, color: "from-cyan-500 to-blue-500" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "from-emerald-500 to-green-600" },
  ];

  return (
    <DashboardLayout allowedRoles={["staff", "admin"]}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Staff Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Manage certificate requests and resident services</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{s.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-sm`}>
                <s.icon size={18} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800/50 px-5 py-3">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">Pending Requests</h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 dark:border-slate-800 dark:border-t-slate-400" /></div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">ID</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Resident</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Purok/Sitio</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contact</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Type</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {requests.filter((r) => r.status === "pending").map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300">{req.request_id}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{req.resident_name}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400"><MarqueeCell text={req.resident_purok_sitio || "—"} maxWidth={140} /></td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400"><MarqueeCell text={req.resident_contact_number || "—"} maxWidth={130} /></td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{req.certificate_type_display}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-400 dark:text-slate-500">{new Date(req.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
