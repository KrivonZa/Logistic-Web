import api from "@/hooks/axiosInstance";
import { UpdateOrder } from "@/types/order";

export const manageOrder = {
  getOrder: (params: { page: number; limit: number }) =>
    api.get(`/delivery-order/company/orders`, { params }),
  getOrderDetail: (req: string) => api.get(`/delivery-order/order/${req}`),
  updateOrder: (req: UpdateOrder) =>
    api.post(`/delivery-order/update/${req.orderID}?status=${req.status}`),
};
