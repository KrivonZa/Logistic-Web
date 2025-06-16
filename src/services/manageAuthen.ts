import api from "@/hooks/axiosInstance";
import { Login, BusinessRegister } from "@/types/account";

export const manageAuthen = {
  login: (req: Login) => api.post(`/auth/login`, req),
  googleLogin: (code?: string) => {
    if (code) {
      return api.get(`/auth/google?code=${code}`);
    }
    return api.get(`/auth/google`);
  },
  registerBusiness: (req: BusinessRegister) =>
    api.post(`/auth/register-company`, req),
};
