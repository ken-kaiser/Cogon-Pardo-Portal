"use client";

import { useEffect, useState } from "react";

export function AmbientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-slate-50/40 dark:bg-slate-950/20">
      {/* Dynamic Aurora Ambient Blobs */}
      <div className="absolute -left-1/4 -top-1/4 h-[700px] w-[700px] animate-blob rounded-full bg-blue-400/15 dark:bg-blue-900/10 blur-[130px] filter mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute -right-1/4 -bottom-1/4 h-[700px] w-[700px] animate-blob-slow rounded-full bg-cyan-400/15 dark:bg-cyan-900/10 blur-[130px] filter mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute left-1/3 top-1/4 h-[600px] w-[600px] animate-blob rounded-full bg-indigo-300/10 dark:bg-indigo-900/5 blur-[120px]" />
      
      {/* Subtle Dot Grid Overlay */}
      <div className="dot-grid absolute inset-0 opacity-70" />
      
      {/* Custom Noise Textures (Optional vector styling) */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none" />
    </div>
  );
}
