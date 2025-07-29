import { skillsApi } from "@/api/requests/job-module-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Fetch skills
export const useSkills = (search?: string) => {
  return useQuery({
    queryKey: ["skills", search],
    queryFn: () => skillsApi.getSkills(search),
    enabled: search !== undefined && search.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => data.skills || [],
  });
};

// Create skill
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillsApi.createSkill,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success(data.message || "Skill created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create skill"
      );
    },
  });
};
