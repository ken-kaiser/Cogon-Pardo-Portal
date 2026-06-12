"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Applicant, PaginatedResponse } from "@/lib/types";

export function useApplicants() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PaginatedResponse<Applicant>>({
    queryKey: ["applicants"],
    queryFn: async () => {
      const { data } = await api.get("/applicants/list/");
      return data;
    },
  });

  const updateApplicantStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/applicants/${id}/`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });

  const deleteApplicant = useMutation({
    mutationFn: (id: string) => api.delete(`/applicants/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
    },
  });

  return {
    applicants: data?.results ?? [],
    total: data?.count ?? 0,
    isLoading,
    updateApplicantStatus,
    deleteApplicant,
  };
}
