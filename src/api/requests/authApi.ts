import { RegisterFormData } from "@/utils/validations/register-schema";
import axiosInstance from "../axiosInstance";
import { ForgotPasswordData } from "@/utils/validations/forget-password-schema";
import { ResetPasswordFormData } from "@/utils/validations/reset-password-schema";



export interface AuthResponse {
  message: string;
}

export const registerUser = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/signup', data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/forgotpassword', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordFormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/resetpassword', data);
  return response.data;
};