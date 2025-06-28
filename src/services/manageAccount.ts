import api from "@/hooks/axiosInstance";

export const manageAccount = {
  profile: () => api.get(`/account`),
  getCompanyDriverAcc: (params: { page: number; limit: number }) =>
    api.get(`/account/company/drivers`, { params }),
};
