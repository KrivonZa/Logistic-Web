import api from "@/hooks/axiosInstance";

export const manageAccount = {
  profile: () => api.get(`/account`),
  getCompanyDriverAcc: (params: { page: number; limit: number }) =>
    api.get(`/account/company/drivers`, { params }),
  getCustomerAcc: (params: {
    status?: string;
    search?: string;
    page: number;
    limit: number;
  }) => api.get(`/account/customer/filter`, { params }),
  getDriverAcc: (params: {
    status?: string;
    search?: string;
    companyName?: string;
    page: number;
    limit: number;
  }) => api.get(`/account/driver/filter`, { params }),
  getCompanyAcc: (params: {
    status?: string;
    search?: string;
    page: number;
    limit: number;
  }) => api.get(`/account/company/filter`, { params }),
};
