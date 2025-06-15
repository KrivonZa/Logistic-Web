import api from "@/hooks/axiosInstance";

export const manageAccount = {
  profile: () => api.get(`/account`),
};
