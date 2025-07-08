import api from "@/hooks/axiosInstance";

export const manageDashboard = {
  companyDashboard: () => api.get(`/dashboard/company`),
  adminDashboard: () => api.get(`/dashboard/admin`),
};
