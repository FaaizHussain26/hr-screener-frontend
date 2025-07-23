import { ProfileFormData } from "@/components/settings/profile-page";
import { AuthResponse } from "./auth-api";
import axiosInstance from "../axiosInstance";

export const updateProfile = async (
  data: ProfileFormData
): Promise<AuthResponse> => {
  const response = await axiosInstance.put(`/auth/update-profile`, data);
  return response.data;
};

export const getProfile = async (): Promise<ProfileFormData> => {
  const response = await axiosInstance.get("/me");
  return response.data;
};
