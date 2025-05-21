import api from "@/hooks/axiosInstance";
import { Login } from "@/types/account";

export const manageAuthen = {
  login: (req: Login) => api.post(`/auth/login`, req),
};
