"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRequests } from "@/hooks/use-requests";
import { SkeletonTable } from "@/components/ui/skeleton";
import { MarqueeCell } from "@/components/ui/marquee-cell";
import { ChevronDown, ChevronUp, FileText, Clock } from "lucide-react";
import type { CertificateRequest } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  under_review: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  rejected: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  ready_pickup: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  completed: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
};

/** Prettify a snake_case key into a human-readable label */
function prettifyKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function RequestDetailPanel({ req }: { req: CertificateRequest }) {
  const extra = req.extra_fields ?? {};
  const entries = Object.entries(extra).filter(([, v]) => v !== null && v !== "");

  return (
    <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/40 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
        {/* Purpose */}
        <div className="md:col-span-2 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-blue-500 dark:text-cyan-400" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Request Details</span>
          </div>
          <div className="rounded-xl border border-slate-100 dark:border-slate-800/40 bg-white dark:bg-slate-900/40 p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Clock size={12} />
              Submitted {new Date(req.created_at).toLocaleString()}
            </div>
            {req.purpose && (
              <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                <span className="text-slate-400 dark:text-slate-500 font-bold">Purpose:</span> {req.purpose}
              </p>
            )}
          </div>
        </div>

        {/* Extra Fields */}
        {entries.length > 0 ? (
          entries.map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-2 py-1.5 border-b border-slate-100/50 dark:border-slate-800/30 last:border-b-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 min-w-[120px] shrink-0">
                {prettifyKey(key)}
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {String(value)}
              </span>
            </div>
          ))
        ) : (
          <p className="md:col-span-2 text-xs text-slate-400 dark:text-slate-500 italic">No additional details submitted.</p>
        )}
      </div>
    </div>
  );
}

export default function StaffRequestsPage() {
  const { requests, isLoading, updateRequest } = useRequests();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: string) => {
    updateRequest.mutate({ id, status });
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <DashboardLayout allowedRoles={["staff"]}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">All Requests</h1>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Review and manage certificate requests</p>

      <div className="mt-6">
        {isLoading ? (
          <SkeletonTable cols={8} rows={6} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 shadow-sm">
            <table className="w-full">
            <thead><tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50">
              <th className="w-10 px-3 py-3"></th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">ID</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Resident</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Purok/Sitio</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Contact</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Type</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {requests.map((req) => (
                <> 
                  <tr
                    key={req.id}
                    className={`cursor-pointer transition-colors ${expandedId === req.id ? "bg-blue-50/40 dark:bg-blue-950/20" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"}`}
                    onClick={() => toggleExpand(req.id)}
                  >
                    <td className="px-3 py-3.5 text-center">
                      <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-transform" style={{ transform: expandedId === req.id ? "rotate(180deg)" : "rotate(0)" }}>
                        <ChevronDown size={16} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-300">{req.request_id}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{req.resident_name}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400"><MarqueeCell text={req.resident_purok_sitio || "—"} maxWidth={140} /></td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400"><MarqueeCell text={req.resident_contact_number || "—"} maxWidth={130} /></td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{req.certificate_type_display}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusColors[req.status] || "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700"}`}>
                        {req.status_display}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="ready_printing">Ready Printing</option>
                        <option value="ready_pickup">Ready Pickup</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                  {expandedId === req.id && (
                    <tr key={`${req.id}-detail`}>
                      <td colSpan={8} className="p-0">
                        <RequestDetailPanel req={req} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
