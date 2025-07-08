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
    applicationType?: string;
  }) => api.get(`/service/application/all`, { params }),
  viewApplicationDetail: (req: string) =>
    api.get(`/service/application/${req}`),
  reviewApplication: (formData: FormData) =>
    api.post(`/service/application/reviewable`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  withdrawal: (formData: FormData) =>
    api.post(`/service/application/withdrawal`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  driverRequest: (formData: FormData) =>
    api.post(`/service/application/approve-driver-request`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
