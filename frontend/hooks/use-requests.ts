"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { CertificateRequest, PaginatedResponse } from "@/lib/types";

export function useRequests() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedResponse<CertificateRequest>>({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data } = await api.get("/requests/");
      return data;
    },
  });

  const createRequest = useMutation({
    mutationFn: (payload: FormData | { certificate_type: string; purpose: string; notes?: string }) => {
      // If it's FormData, axios will automatically set the correct headers
      return api.post("/requests/create/", payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
  });

  const updateRequest = useMutation({
    mutationFn: ({ id, ...payload }: { id: string; status?: string; assigned_staff?: string; notes?: string; rejection_reason?: string }) =>
      api.patch(`/requests/${id}/update/`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
  });

  return {
    requests: data?.results ?? [],
    total: data?.count ?? 0,
    isLoading,
    createRequest,
    updateRequest,
  };
}
