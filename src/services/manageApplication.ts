import api from "@/hooks/axiosInstance";
import { CreateApplication } from "@/types/application";

export const manageApplication = {
  viewApplication: (params: { page: number; limit: number }) =>
    api.get(`/service/application/sent`, { params }),
  createApplication: (req: CreateApplication) =>
    api.post(`/service/application`, req),
  viewAllApplication: (params: {
    page: number;
    limit: number;
    applicationStatus?: string;
  }) => api.get(`/service/application/all`, { params }),
  viewApplicationDetail: (req: string) =>
    api.get(`/service/application/${req}`),
};
