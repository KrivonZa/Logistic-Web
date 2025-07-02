import api from "@/hooks/axiosInstance";
import { CreatePayment, CancelPayment } from "@/types/payment";

export const managePayment = {
  createPayment: (req: CreatePayment) => api.post(`/payment/create`, req),
  cancelPayment: (req: CancelPayment) =>
    api.put(`/payment/${req.orderId}`, {
      cancellationReason: req.cancellationReason,
    }),
};
