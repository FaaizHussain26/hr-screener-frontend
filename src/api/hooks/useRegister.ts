import { useMutation } from '@tanstack/react-query';
import { RegisterFormData } from '@/utils/validations/register-schema';
import { registerUser } from '../requests/authApi';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
  });
};