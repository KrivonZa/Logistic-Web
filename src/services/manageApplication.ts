import api from "@/hooks/axiosInstance";

export const manageApplication = {
  viewApplication: (params: { page: number; limit: number }) =>
    api.get(`/service/application/sent`, { params }),
};
