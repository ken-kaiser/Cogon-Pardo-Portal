"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900" />
    );
  }

  const handleSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-cyan-400 active:scale-95"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white/90 dark:bg-slate-950/90 shadow-xl shadow-slate-200/20 dark:shadow-black/40 backdrop-blur-xl z-50">
          <div className="p-1.5 flex flex-col gap-0.5">
            <button
              onClick={() => handleSelect("light")}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200",
                theme === "light"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-cyan-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/50"
              )}
            >
              <Sun size={14} className={theme === "light" ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"} />
              Light
            </button>
            <button
              onClick={() => handleSelect("dark")}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200",
                theme === "dark"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-cyan-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/50"
              )}
            >
              <Moon size={14} className={theme === "dark" ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"} />
              Dark
            </button>
            <button
              onClick={() => handleSelect("system")}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200",
                theme === "system"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-cyan-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/50"
              )}
            >
              <Monitor size={14} className={theme === "system" ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"} />
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
