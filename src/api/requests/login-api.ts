import { LoginFormData } from "@/pages/login";
import axios from "axios";

export const LoginInputData = (data: LoginFormData) => {
  axios.post("", {
    email: data.email,
    password: data.password,
  });
};
