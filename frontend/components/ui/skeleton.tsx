import React from "react";
import { cn } from "@/lib/utils";

export function SkeletonPulse({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800/40",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <SkeletonPulse className="h-3 w-2/5" />
          <SkeletonPulse className="h-7 w-1/4" />
        </div>
        <SkeletonPulse className="h-10 w-10 shrink-0" />
      </div>
      <div className="mt-5 space-y-2">
        <SkeletonPulse className="h-2.5 w-full" />
        <SkeletonPulse className="h-2.5 w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 3, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 shadow-sm">
      {/* Table Header Skeleton */}
      <div className="flex border-b border-slate-100/50 dark:border-slate-800/30 bg-slate-50/30 dark:bg-slate-950/20 px-6 py-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={`th-${i}`} className="flex-1">
            <SkeletonPulse className="h-3.5 w-2/3" />
          </div>
        ))}
      </div>
      {/* Table Rows Skeleton */}
      <div className="divide-y divide-slate-50 dark:divide-slate-900/20">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`row-${r}`} className="flex items-center px-6 py-4 gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={`col-${r}-${c}`} className="flex-1">
                <SkeletonPulse className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 p-6 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-100/50 dark:border-slate-800/30 pb-4">
        <SkeletonPulse className="h-5 w-1/3 mb-2" />
        <SkeletonPulse className="h-3 w-2/3" />
      </div>
      
      {/* Input Sections */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <SkeletonPulse className="h-3 w-1/4" />
            <SkeletonPulse className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonPulse className="h-3 w-1/3" />
            <SkeletonPulse className="h-11 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-3 w-1/5" />
          <SkeletonPulse className="h-24 w-full" />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end pt-4">
        <SkeletonPulse className="h-11 w-32" />
      </div>
    </div>
  );
}

export function SkeletonWidget() {
  return (
    <div className="glass-card p-5 border-slate-100/50 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-4 w-1/3" />
        <SkeletonPulse className="h-5 w-16" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <SkeletonPulse className="h-3.5 w-1/2" />
          <SkeletonPulse className="h-3.5 w-8" />
        </div>
        <div className="flex justify-between items-center">
          <SkeletonPulse className="h-3.5 w-2/5" />
          <SkeletonPulse className="h-3.5 w-10" />
        </div>
        <div className="flex justify-between items-center">
          <SkeletonPulse className="h-3.5 w-3/5" />
          <SkeletonPulse className="h-3.5 w-6" />
        </div>
      </div>
    </div>
  );
}
