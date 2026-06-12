"use client";

import { ScrollText, FileCheck } from "lucide-react";
import type { CertificateTemplate } from "@/lib/types";

interface TemplateCardProps {
  template: CertificateTemplate;
  onPreview?: (id: string) => void;
}

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <ScrollText size={18} className="text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 truncate">{template.name}</h3>
          <p className="text-xs text-slate-400">{template.certificate_type}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            template.is_active
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {template.is_active ? "Active" : "Inactive"}
        </span>

        {onPreview && (
          <button
            onClick={() => onPreview(template.id)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <FileCheck size={12} />
            Preview
          </button>
        )}
      </div>
    </div>
  );
}
