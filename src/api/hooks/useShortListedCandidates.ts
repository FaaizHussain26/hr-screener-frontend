import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteShortListedCandidate,
  getShortListedCandidates,
  QueryParams,
} from "../requests/shortlisted-candidates-api";

export const useShortListedCandidates = (params: QueryParams) => {
  return useQuery({
    queryKey: ["short-listed-candidates", params],
    queryFn: () => getShortListedCandidates(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateId: string) =>
      deleteShortListedCandidate(candidateId),
    onSuccess: () => {
      // Invalidate to trigger re-fetch of candidates list
      queryClient.invalidateQueries({ queryKey: ["short-listed-candidates"] });
    },
  });
};
