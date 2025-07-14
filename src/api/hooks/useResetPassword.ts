import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../requests/authApi";
import { ResetPasswordFormData } from "@/utils/validations/reset-password-schema";

export const useResetPasseord = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordFormData) => resetPassword(data),
  });
};
