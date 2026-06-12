"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRequests } from "@/hooks/use-requests";
import { useState } from "react";
import Link from "next/link";
import { Plus, Loader2, FileText } from "lucide-react";
import { SkeletonTable } from "@/components/ui/skeleton";

const CERT_TYPES = [
  { value: "barangay_clearance", label: "Barangay Clearance" },
  { value: "residency", label: "Certificate of Residency" },
  { value: "indigency", label: "Certificate of Indigency" },
  { value: "business_permit", label: "Certificate of Business Permit" },
  { value: "cedula", label: "Cedula" },
  { value: "low_income", label: "Certificate of Low Income" },
  { value: "no_income", label: "Certificate of No Income" },
  { value: "identification", label: "Certificate of Identification" },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  under_review: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  for_verification: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  rejected: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  ready_printing: "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
  ready_pickup: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  completed: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
};

export default function ResidentRequests() {
  const { requests, isLoading, createRequest } = useRequests();
  return (
    <DashboardLayout allowedRoles={["resident"]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Requests</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Track and manage your certificate requests</p>
        </div>
        <Link
          href="/resident/requests/new"
          className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-950 transition hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-[0.98]"
        >
          <Plus size={16} />
          New Request
        </Link>
      </div>

      {/* ── Requests Table ────────────────────────────────────────── */}
      <div className="mt-6">
        {isLoading ? (
          <SkeletonTable cols={5} rows={5} />
        ) : requests.length === 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 shadow-sm flex flex-col items-center py-16">
            <FileText size={32} className="text-slate-200 dark:text-slate-700" />
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">No requests yet</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Purpose</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {requests.map((req) => (
                  <tr key={req.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300">{req.request_id}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{req.certificate_type_display}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{req.purpose || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusColors[req.status] || "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700"}`}>
                        {req.status_display}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-400 dark:text-slate-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
