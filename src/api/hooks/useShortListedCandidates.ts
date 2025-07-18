import { useQuery } from "@tanstack/react-query";
import {
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
