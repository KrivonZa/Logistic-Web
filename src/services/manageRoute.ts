import api from "@/hooks/axiosInstance";
import { createRoute, Page } from "@/types/route";

export const manageRoute = {
  createRoute: (req: createRoute) => api.post(`/route-planning/route`, req),
  getRouteByCompany: (req: Page) =>
    api.get(`/route-planning/company?page=${req.page}&limit=${req.limit}`),
};
