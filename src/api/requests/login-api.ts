import { LoginFormData } from "@/utils/validations/login-schema";
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface LoginApiResponse {
  user: {
    id: number | string;
    first_name: string;
    last_name: string;
    email: string;
  };
  access_token: string;
}

export const loginApi = async (
  data: LoginFormData
): Promise<LoginApiResponse> => {
  const response = await axios.post<LoginApiResponse>(
    `${apiBaseUrl}/auth/signin`,
    data
  );
  return response.data;
};
