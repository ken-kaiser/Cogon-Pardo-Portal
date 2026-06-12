"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { AuditLog } from "@/lib/types";
import { Shield } from "lucide-react";

const actionColors: Record<string, string> = {
  create: "bg-emerald-50 text-emerald-700",
  update: "bg-blue-50 text-blue-700",
  delete: "bg-red-50 text-red-700",
  login: "bg-violet-50 text-violet-700",
  logout: "bg-slate-100 text-slate-600",
};

export default function AuditLogsPage() {
  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      // Audit logs are admin-only and may be accessed via Django admin
      // This is a placeholder — wire up a DRF endpoint if needed
      return [];
    },
  });

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
      <p className="mt-1 text-sm text-slate-400">System activity history</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col items-center py-16">
          <Shield size={32} className="text-slate-200" />
          <p className="mt-3 text-sm text-slate-400">Audit logs available via Django Admin</p>
          <a href="http://127.0.0.1:8000/admin/audit/auditlog/" target="_blank" rel="noopener" className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-600">
            Open Django Admin →
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
