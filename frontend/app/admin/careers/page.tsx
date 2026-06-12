"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useApplicants } from "@/hooks/use-applicants";
import type { Applicant, ApplicationStatus } from "@/lib/types";
import api from "@/lib/api";
import { SkeletonTable } from "@/components/ui/skeleton";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  UserPlus, 
  FileText, 
  Lock, 
  ShieldAlert, 
  ChevronRight, 
  Building2, 
  GraduationCap, 
  AlertTriangle 
} from "lucide-react";

const statusColors: Record<ApplicationStatus, { bg: string; text: string; border: string; label: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", label: "Pending Review" },
  interview_scheduled: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", label: "Interview Scheduled" },
  approved: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", label: "Approved" },
  rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100", label: "Rejected" },
  hired: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", label: "Hired" },
};

export default function AdminCareersPage() {
  const { applicants, isLoading, updateApplicantStatus, deleteApplicant } = useApplicants();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sitioFilter, setSitioFilter] = useState<string>("all");

  // Password confirmation states
  const [isVerifying, setIsVerifying] = useState(false);
  const [password, setPassword] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [pendingAction, setPendingAction] = useState<{
    type: "status" | "delete";
    applicantId: string;
    targetStatus?: string;
  } | null>(null);

  // Filter applicants
  const filteredApplicants = applicants.filter((app) => {
    const fullName = `${app.first_name} ${app.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSitio = sitioFilter === "all" || app.sitio === sitioFilter;
    return matchesSearch && matchesStatus && matchesSitio;
  });

  const uniqueSitios = Array.from(new Set(applicants.map((a) => a.sitio)));

  // Initiate sensitive action
  const triggerSensitiveAction = (action: { type: "status" | "delete"; applicantId: string; targetStatus?: string }) => {
    // Non-sensitive: move to interview scheduled doesn't require password
    if (action.type === "status" && action.targetStatus === "interview_scheduled") {
      updateApplicantStatus.mutate(
        { id: action.applicantId, status: "interview_scheduled" },
        {
          onSuccess: (res) => {
            // Update local state if the detailed modal is open
            if (selectedApplicant && selectedApplicant.id === action.applicantId) {
              setSelectedApplicant({ ...selectedApplicant, status: "interview_scheduled" });
            }
          }
        }
      );
      return;
    }

    // Sensitive actions (Approve, Reject, Hire, Delete) require verification
    setPendingAction(action);
    setIsVerifying(true);
    setPassword("");
    setVerificationError("");
  };

  // Perform secure verification check
  const handleVerifyAndCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");

    if (!password) {
      setVerificationError("Password is required to authenticate.");
      return;
    }

    try {
      // Call endpoint to verify password
      await api.post("/accounts/verify-password/", { password });

      // Password verified! Execute the pending action
      if (pendingAction) {
        if (pendingAction.type === "status" && pendingAction.targetStatus) {
          updateApplicantStatus.mutate(
            { id: pendingAction.applicantId, status: pendingAction.targetStatus },
            {
              onSuccess: () => {
                if (selectedApplicant && selectedApplicant.id === pendingAction.applicantId) {
                  setSelectedApplicant({ 
                    ...selectedApplicant, 
                    status: pendingAction.targetStatus as ApplicationStatus 
                  });
                }
                setIsVerifying(false);
                setPendingAction(null);
              }
            }
          );
        } else if (pendingAction.type === "delete") {
          deleteApplicant.mutate(pendingAction.applicantId, {
            onSuccess: () => {
              if (selectedApplicant?.id === pendingAction.applicantId) {
                setSelectedApplicant(null);
              }
              setIsVerifying(false);
              setPendingAction(null);
            }
          });
        }
      }
    } catch (err: any) {
      setVerificationError(err.response?.data?.error || "Invalid administrator password. Access denied.");
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-blue-600" />
            Recruitment & Careers Manager
          </h1>
          <p className="mt-1 text-sm text-slate-400">Review staff applications, schedule interviews, and manage portal recruitment</p>
        </div>
      </div>

      {/* ── Filters Card ────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidates"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="all">All Pipeline Stages</option>
              <option value="pending">Pending Review</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>

          <div>
            <select
              value={sitioFilter}
              onChange={(e) => setSitioFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="all">All Puroks / Sitios</option>
              {uniqueSitios.map((sitio) => (
                <option key={sitio} value={sitio}>{sitio}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Dashboard Content Layout ───────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/Middle Column: Applicants Table List */}
        <div className="col-span-1 lg:col-span-2">
          {isLoading ? (
            <SkeletonTable cols={4} rows={6} />
          ) : filteredApplicants.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden py-24 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-sm font-bold text-slate-700">No applicants found</h3>
              <p className="mt-1 text-xs text-slate-400">Try modifying your search or status query filters</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/40">
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Candidate</th>
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Sitio</th>
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.map((app) => (
                    <tr 
                      key={app.id} 
                      className={`hover:bg-slate-50/40 cursor-pointer transition ${selectedApplicant?.id === app.id ? "bg-blue-50/20" : ""}`}
                      onClick={() => setSelectedApplicant(app)}
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{app.first_name} {app.last_name}</p>
                          <p className="text-xs font-medium text-slate-400">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-600">{app.sitio}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${statusColors[app.status]?.bg} ${statusColors[app.status]?.text} ${statusColors[app.status]?.border}`}>
                          {statusColors[app.status]?.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                            title="View Applicant Profile"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => triggerSensitiveAction({ type: "delete", applicantId: app.id })}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete Applicant Profile"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Candidate View Panel */}
        <div className="col-span-1">
          {selectedApplicant ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sticky top-6">
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">{selectedApplicant.first_name} {selectedApplicant.last_name}</h2>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{selectedApplicant.email}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{selectedApplicant.phone_number}</p>
                  </div>
                  <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${statusColors[selectedApplicant.status]?.bg} ${statusColors[selectedApplicant.status]?.text} ${statusColors[selectedApplicant.status]?.border}`}>
                    {statusColors[selectedApplicant.status]?.label}
                  </span>
                </div>
              </div>

              {/* Personal Details */}
              <div className="mt-5 space-y-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sitio Address</p>
                    <p className="text-sm font-bold text-slate-700">{selectedApplicant.sitio}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Education Details</p>
                    <p className="text-sm font-bold text-slate-700">{selectedApplicant.education_level_display}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{selectedApplicant.school_institution} ({selectedApplicant.year_graduated})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Background Checks</p>
                    {selectedApplicant.has_criminal_record ? (
                      <div className="mt-1 rounded-xl bg-red-50/50 border border-red-100 p-2.5 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-red-800 font-medium leading-relaxed">{selectedApplicant.background_details || "Records detected."}</span>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-emerald-600 mt-0.5">Clean Background (Declared)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="mt-5 border-b border-slate-100 pb-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Supporting Documentation</h3>
                {selectedApplicant.documents && selectedApplicant.documents.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedApplicant.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.file_url || doc.file}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3 hover:bg-slate-50 hover:border-slate-200 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{doc.document_type_display}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Click to view/download file</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-slate-400 italic">No supporting files uploaded.</p>
                )}
              </div>

              {/* Action Pipeline Buttons */}
              <div className="mt-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Recruitment Pipeline Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={selectedApplicant.status === "interview_scheduled"}
                    onClick={() => triggerSensitiveAction({ type: "status", applicantId: selectedApplicant.id, targetStatus: "interview_scheduled" })}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-150 py-2.5 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] disabled:opacity-50"
                  >
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Interview
                  </button>

                  <button
                    disabled={selectedApplicant.status === "approved"}
                    onClick={() => triggerSensitiveAction({ type: "status", applicantId: selectedApplicant.id, targetStatus: "approved" })}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-150 py-2.5 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Approve
                  </button>

                  <button
                    disabled={selectedApplicant.status === "hired"}
                    onClick={() => triggerSensitiveAction({ type: "status", applicantId: selectedApplicant.id, targetStatus: "hired" })}
                    className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 px-4 text-xs font-extrabold text-white shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/15 transition active:scale-[0.98] disabled:opacity-50"
                  >
                    <UserPlus className="h-4 w-4" />
                    Hire Candidate
                  </button>

                  <button
                    disabled={selectedApplicant.status === "rejected"}
                    onClick={() => triggerSensitiveAction({ type: "status", applicantId: selectedApplicant.id, targetStatus: "rejected" })}
                    className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50/20 py-2 px-4 text-xs font-extrabold text-red-600 hover:bg-red-50 transition active:scale-[0.98] disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 border-dashed bg-slate-50/20 p-8 text-center sticky top-6">
              <Eye className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs font-semibold text-slate-400 leading-relaxed">Select a candidate from the table list to inspect their files, checks, and update pipeline status.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Admin Password Verification Guard Modal Popup ────────── */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsVerifying(false)} />

          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 shadow-sm mb-4">
              <Lock className="h-6 w-6 text-amber-600" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">Admin Security Verification</h3>
            <p className="mt-1.5 text-xs font-medium text-slate-400 leading-relaxed">
              You are performing a sensitive administrative database change. Please enter your portal password to verify credentials and proceed.
            </p>

            <form onSubmit={handleVerifyAndCommit} className="mt-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Administrator Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                  required
                />
              </div>

              {verificationError && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-700 font-bold leading-relaxed">
                  {verificationError}
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVerifying(false)}
                  className="flex-1 rounded-xl border border-slate-150 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-extrabold text-white hover:bg-slate-800 transition shadow-sm"
                >
                  Confirm Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
