export interface CreatePayment {
  description: string;
  returnUrl: string;
  cancelUrl: string;
  deliveryOrderId: string;
}

export interface CancelPayment {
  orderId: string;
  cancellationReason: string;
}
