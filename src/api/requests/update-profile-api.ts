import { ProfileFormData } from "@/components/settings/profile-page";
import { AuthResponse } from "./auth-api";
import axios from "axios";

export const updateProfile = async (
  data: ProfileFormData
): Promise<AuthResponse> => {
  const response = await axios.put(`/update-profile/${data.id}`, data);
  return response.data;
};

export const getProfile = async (): Promise<ProfileFormData> => {
  const response = await axios.get("/me");
  return response.data;
};
