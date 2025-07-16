import { useQuery } from "@tanstack/react-query";
import { getShortListedCandidates } from "../requests/short-listed-candidates";

export const useShortListedCandidates = () => {
  return useQuery({
    queryKey: ["short-listed-candidates"],
    queryFn: getShortListedCandidates,
  });
};