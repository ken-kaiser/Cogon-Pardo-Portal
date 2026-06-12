"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { useRequests } from "@/hooks/use-requests";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SkeletonTable, SkeletonPulse, SkeletonWidget } from "@/components/ui/skeleton";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Shield,
  MapPin,
  Award,
  Building,
  HeartHandshake,
  ChevronRight,
  Sparkles
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  under_review: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  ready_pickup: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  completed: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

export default function ResidentDashboard() {
  const { user } = useAuth();
  const { requests, isLoading } = useRequests();

  // Primary stats calculation
  const totalRequestsCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending" || r.status === "under_review").length;
  const approvedCount = requests.filter((r) => ["approved", "ready_printing", "ready_pickup", "completed"].includes(r.status)).length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const stats = [
    {
      label: "Total Requests",
      value: totalRequestsCount,
      icon: FileText,
      color: "text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100/30",
      accent: "from-blue-500 to-cyan-400",
    },
    {
      label: "Awaiting Action",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100/30",
      accent: "from-amber-500 to-orange-500",
    },
    {
      label: "Approved Items",
      value: approvedCount,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100/30",
      accent: "from-emerald-500 to-green-500",
    },
    {
      label: "Rejected Requests",
      value: rejectedCount,
      icon: AlertCircle,
      color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100/30",
      accent: "from-red-500 to-pink-500",
    },
  ];

  // Citizen Quick Action list
  const quickActions = [
    { label: "Barangay Clearance", icon: Shield, href: "/resident/requests/new/barangay-clearance", color: "from-blue-500 to-indigo-500", delay: "duration-300" },
    { label: "Certificate of Residency", icon: MapPin, href: "/resident/requests/new/residency", color: "from-cyan-500 to-blue-500", delay: "duration-500" },
    { label: "Certificate of Indigency", icon: Award, href: "/resident/requests/new/indigency", color: "from-amber-500 to-orange-500", delay: "duration-700" },
    { label: "Business Permit", icon: Building, href: "/resident/requests/new/business-permit", color: "from-purple-500 to-pink-500", delay: "duration-1000" },
    { label: "Burial Assistance", icon: HeartHandshake, href: "/resident/requests/new/burial-assistance", color: "from-rose-500 to-red-500", delay: "duration-1000" },
  ];

  // Latest single active request for timeline visualization
  const latestRequest = requests && requests.length > 0 ? requests[0] : null;

  return (
    <DashboardLayout allowedRoles={["resident"]}>
      {/* ── Welcome Greeting ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/40 bg-blue-50/50 px-3 py-1 text-xs font-semibold text-blue-600 backdrop-blur-md dark:border-blue-800/30 dark:bg-blue-950/20 dark:text-cyan-400 mb-2">
            <Sparkles size={12} className="animate-pulse" />
            Citizen Console Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl leading-none">
            Welcome back, {user?.first_name}
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Manage your certificate applications and track real-time queue updates.
          </p>
        </div>

        {/* Quick Apply Action Button */}
        <Link
          href="/resident/requests/new"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-5 text-xs font-bold uppercase tracking-wider text-white dark:text-slate-950 shadow-md shadow-slate-950/10 hover:bg-blue-600 dark:hover:bg-cyan-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          New Application
        </Link>
      </div>

      {/* ── Quick Action Hub ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Application Hub</h2>
          <Link
            href="/resident/requests/new"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition flex items-center gap-1"
          >
            See all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group relative overflow-hidden glass-card glass-card-hover p-4 flex flex-col justify-between h-[120px] border-slate-100/50"
            >
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-sm`}>
                <action.icon size={16} className="transition-transform group-hover:scale-110" />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mt-3">
                <span className="line-clamp-2 leading-snug">{action.label}</span>
                <ChevronRight size={14} className="shrink-0 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden glass-card glass-card-hover p-5 border-slate-100/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
                {isLoading ? (
                  <SkeletonPulse className="mt-2 h-7 w-12" />
                ) : (
                  <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                    {stat.value}
                  </p>
                )}
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border border-transparent ${stat.color} shadow-sm`}>
                <stat.icon size={18} />
              </div>
            </div>
            {/* Pulsing ambient glowing baseline */}
            <div className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r ${stat.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Request List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Requests List</h2>
            <Link
              href="/resident/requests"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition flex items-center gap-1"
            >
              See All Requests <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-hidden glass-card border-slate-100/50 shadow-sm">
            {isLoading ? (
              <SkeletonTable cols={4} rows={3} />
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center px-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 mb-4">
                  <FileText size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No requests yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                  Submit your first certificate application using the Quick Action Hub above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto w-full min-w-0">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100/50 dark:border-slate-800/30 bg-slate-50/30 dark:bg-slate-950/20">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Request ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Document Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Filed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-900/20">
                    {requests.slice(0, 5).map((req) => (
                      <tr
                        key={req.id}
                        className="transition hover:bg-slate-50/40 dark:hover:bg-slate-900/10 cursor-pointer"
                      >
                        <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-200">{req.request_id}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {req.certificate_type_display}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${statusColors[req.status] || "bg-slate-500/10 text-slate-600"}`}>
                            {req.status_display}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                          {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Timeline Tracker & Community updates */}
        <div className="lg:col-span-4 space-y-8">

          {/* Live request timeline tracking */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Request Tracker</h2>
            {isLoading ? (
              <SkeletonWidget />
            ) : (
              <div className="glass-card border-slate-100/50 p-5 space-y-5">
                {!latestRequest ? (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    No active tracking timelines at this time.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">{latestRequest.certificate_type_display}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{latestRequest.request_id}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${statusColors[latestRequest.status]}`}>
                        {latestRequest.status_display}
                      </span>
                    </div>

                    {/* High Fidelity Visual Steps Timeline */}
                    <div className="space-y-4 pt-2">
                      <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800">
                        <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Submitted Successfully</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Files and details correctly filed.</span>
                      </div>

                      <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800">
                        <div className={cn(
                          "absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full",
                          ["under_review", "approved", "ready_printing", "ready_pickup", "completed"].includes(latestRequest.status)
                            ? "bg-blue-500 shadow-sm"
                            : "bg-slate-200 dark:bg-slate-800"
                        )} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Staff Verification</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Information verified by admin.</span>
                      </div>

                      <div className="relative pl-6">
                        <div className={cn(
                          "absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full",
                          ["ready_pickup", "completed"].includes(latestRequest.status)
                            ? "bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse"
                            : "bg-slate-200 dark:bg-slate-800"
                        )} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Ready for Pickup</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Document physically signed and sealed.</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Barangay Announcements Widget */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Community Announcements</h2>
            <div className="glass-card border-slate-100/50 p-5 space-y-4">
              <div className="border-b border-slate-100/50 dark:border-slate-800/20 pb-3 space-y-1">
                <span className="inline-block rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-100/30 px-1.5 py-0.5 text-[8px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wide">
                  General Meeting
                </span>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">Purok 4 Monthly Assemble</h4>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">Schedule: May 24, 2026, 6:00 PM at Barangay Gymnasium.</p>
              </div>

              <div className="space-y-1">
                <span className="inline-block rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-100/30 px-1.5 py-0.5 text-[8px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  Health Program
                </span>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">Free Pediatric Dental Checkup</h4>
                <p className="text-[10px] text-slate-400 leading-normal font-medium">Free oral diagnostic checkups at the Cogon Health Center.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
