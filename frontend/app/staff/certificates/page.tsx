"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ScrollText } from "lucide-react";
import type { CertificateTemplate } from "@/lib/types";

export default function StaffCertificatesPage() {
  const { data: templates = [], isLoading } = useQuery<CertificateTemplate[]>({
    queryKey: ["cert-templates"],
    queryFn: async () => {
      const { data } = await api.get("/certificates/templates/");
      return data.results ?? data;
    },
  });

  return (
    <DashboardLayout allowedRoles={["staff", "admin"]}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Certificate Templates</h1>
      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Manage and preview certificate templates</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600 dark:border-slate-800 dark:border-t-slate-400" /></div>
        ) : templates.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-16">
            <ScrollText size={32} className="text-slate-200 dark:text-slate-700" />
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">No templates configured yet</p>
            <p className="text-xs text-slate-300 dark:text-slate-600">Add templates via Django admin or the API</p>
          </div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900/50 p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <ScrollText size={18} className="text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{t.certificate_type}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${t.is_active ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"}`}>
                  {t.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
