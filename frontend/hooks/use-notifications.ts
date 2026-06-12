"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Notification } from "@/lib/types";

export function useNotifications() {
  const queryClient = useQueryClient();

  // Query notification lists
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications/");
      return data.results ?? data;
    },
    refetchInterval: 30000, // poll every 30s
  });

  // Calculate unread badge count from client cache state
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Single Item Mark Read - WITH HIGH-FIDELITY OPTIMISTIC UPDATE
  const markAsRead = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read/`),
    
    // Perform optimistic caching manipulation immediately
    onMutate: async (id: string) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic state
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot the current cache
      const previousNotifications = queryClient.getQueryData<Notification[]>(["notifications"]);

      // Optimistically overwrite the cache with updated status
      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          ["notifications"],
          previousNotifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          )
        );
      }

      // Return context for error rollback
      return { previousNotifications };
    },

    // Rollback cached state on async failure
    onError: (err, id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
    },

    // Invalidate and sync with server once request completes
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // All Items Mark Read - WITH HIGH-FIDELITY OPTIMISTIC UPDATE
  const markAllAsRead = useMutation({
    mutationFn: () => api.post("/notifications/read-all/"),

    // Perform optimistic caching manipulation immediately
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousNotifications = queryClient.getQueryData<Notification[]>(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          ["notifications"],
          previousNotifications.map((n) => ({ ...n, is_read: true }))
        );
      }

      return { previousNotifications };
    },

    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(["notifications"], context.previousNotifications);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return { notifications, isLoading, unreadCount, markAsRead, markAllAsRead };
}
