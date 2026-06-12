"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Resident } from "@/lib/types";

const verificationColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  rejected: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
};

export default function StaffResidentsPage() {
  const { data: residents = [], isLoading } = useQuery<Resident[]>({
    queryKey: ["residents"],
    queryFn: async () => {
      const { data } = await api.get("/residents/");
      return data.results ?? data;
    },
  });

  const handleVerify = async (id: string, status: string) => {
    await api.patch(`/residents/${id}/verify/`, { verification_status: status });
  };

  return (
    <DashboardLayout allowedRoles={["staff", "admin"]}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Residents</h1>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">View and verify resident profiles</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 dark:border-slate-800 dark:border-t-slate-400" /></div>
        ) : residents.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Users size={32} className="text-slate-200 dark:text-slate-700" />
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">No residents registered yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Purok/Sitio</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contact</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {residents.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300">{r.full_name}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{r.purok_sitio}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{r.contact_number}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${verificationColors[r.verification_status]}`}>
                      {r.verification_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 flex gap-2">
                    {r.verification_status === "pending" && (
                      <>
                        <button onClick={() => handleVerify(r.id, "verified")} className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition">
                          <CheckCircle2 size={12} className="inline mr-1" />Verify
                        </button>
                        <button onClick={() => handleVerify(r.id, "rejected")} className="rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition">
                          <XCircle size={12} className="inline mr-1" />Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
