"use client";

import { FileText, Download, Eye } from "lucide-react";
import type { CertificateRequest } from "@/lib/types";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  under_review: "bg-blue-50 text-blue-700 border-blue-100",
  for_verification: "bg-purple-50 text-purple-700 border-purple-100",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
  ready_printing: "bg-cyan-50 text-cyan-700 border-cyan-100",
  ready_pickup: "bg-violet-50 text-violet-700 border-violet-100",
  completed: "bg-slate-50 text-slate-600 border-slate-100",
};

interface RequestCardProps {
  request: CertificateRequest;
  onViewQR?: (id: string) => void;
}

export function RequestCard({ request, onViewQR }: RequestCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <FileText size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{request.request_id}</p>
            <p className="text-xs text-slate-400">{request.certificate_type_display}</p>
          </div>
        </div>
        <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusColors[request.status] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
          {request.status_display}
        </span>
      </div>

      {request.purpose && (
        <p className="mt-3 text-sm text-slate-500 line-clamp-2">
          <span className="font-medium text-slate-600">Purpose:</span> {request.purpose}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        <span className="text-xs text-slate-400">
          {new Date(request.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          {request.qr_code_image && onViewQR && (
            <button
              onClick={() => onViewQR(request.id)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <Eye size={12} />
              QR Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
