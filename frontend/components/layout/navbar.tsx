"use client";

import { useAuth } from "@/context/auth-context";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useUIStore } from "@/lib/store/ui-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadSnapshotIds, setUnreadSnapshotIds] = useState<string[]>([]);
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);

  if (!user) return null;

  const handleToggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      // Capture unread IDs at the moment of opening to preserve visual unread styling in list
      const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
      setUnreadSnapshotIds(unreadIds);
      
      // Instantly mark all read on backend to clear the notification badge count
      if (unreadCount > 0) {
        markAllAsRead.mutate();
      }
    }
  };

  const handleItemClick = (id: string) => {
    // Clear highlight indicator for this specific item on click
    setUnreadSnapshotIds((prev) => prev.filter((x) => x !== id));
    markAsRead.mutate(id);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 px-4 md:px-6 backdrop-blur-xl transition-all">
      {/* ── Mobile Hamburger Menu Toggle ── */}
      <button
        onClick={toggleMobileSidebar}
        className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/50 dark:border-slate-800/40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-[0.98] lg:hidden"
        aria-label="Toggle Navigation Sidebar"
      >
        <Menu size={18} />
      </button>

      {/* ── Search Bar (Responsive sizing) ── */}
      <div className="relative max-w-xs md:max-w-md flex-1 min-w-0 mr-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search requests..."
          className="h-9 w-full rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 pl-9 pr-4 text-xs md:text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition duration-200 focus:border-blue-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-950 focus:ring-4 focus:ring-blue-100/30"
        />
      </div>

      {/* ── Right side actions ── */}
      <div className="flex items-center gap-2.5 md:gap-4 shrink-0">
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Panel bell */}
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-600 dark:hover:text-cyan-400"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm shadow-red-500/30">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification drawer overlay dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 md:w-80 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-950 shadow-xl shadow-slate-200/20 dark:shadow-black/40">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 px-4 py-3 bg-slate-50/30 dark:bg-slate-950/20">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllAsRead.mutate();
                      setUnreadSnapshotIds([]);
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-900/10">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-slate-400 font-medium">
                    No notifications yet
                  </p>
                ) : (
                  notifications.slice(0, 10).map((n) => {
                    const isUnread = unreadSnapshotIds.includes(n.id) || !n.is_read;
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleItemClick(n.id)}
                        className={cn(
                          "flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/40",
                          isUnread && "bg-blue-50/20 dark:bg-cyan-950/10"
                        )}
                      >
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{n.message}</span>
                        <span className="text-[9px] text-slate-300 font-medium">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User initials circle */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 text-xs font-extrabold text-white shadow-inner">
          {user.first_name?.[0]}
          {user.last_name?.[0]}
        </div>
      </div>
    </header>
  );
}
