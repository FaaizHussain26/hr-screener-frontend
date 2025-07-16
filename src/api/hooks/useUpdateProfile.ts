import { ProfileFormData } from "@/components/settings/profile-page";
import { updateProfile } from "../requests/update-profile-api";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: ProfileFormData) => updateProfile(data),
  });
};
