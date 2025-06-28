import api from "@/hooks/axiosInstance";

export const manageOrder = {
  getOrder: (params: { page: number; limit: number }) =>
    api.get(`/delivery-order/company/orders`, { params }),
};
