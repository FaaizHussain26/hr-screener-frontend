import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../requests/login-api";
import { LoginFormData } from "@/utils/validations/login-schema";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: LoginFormData) => {
      const data = await loginApi(payload);

      const expiry = Date.now() + 30 * 60 * 1000; // 30 minutes
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("tokenExpiry", expiry.toString());

      return data;
    },
  });
};
