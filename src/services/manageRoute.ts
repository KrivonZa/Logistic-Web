import api from "@/hooks/axiosInstance";
import { createRoute } from "@/types/route";

export const manageRoute = {
  createRoute: (req: createRoute) => api.post(`/route-planning/route`, req),
  getRouteByCompany: (params: { page: number; limit: number }) =>
    api.get(`/route-planning/company`, { params }),
};
