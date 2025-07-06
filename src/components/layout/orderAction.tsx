"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/stores";
import { updateOrder } from "@/stores/orderManager/thunk";
import { createPayment, cancelPayment } from "@/stores/paymentManager/thunk";
import { delivery_status } from "@/types/order";
import { useState } from "react";
import TripAction from "./tripAction";

interface Props {
  status: string;
  orderID: string;
  onStatusUpdated?: () => void;
}

type ActionType = "accept" | "reject" | "cancel";

const statusMap: Record<ActionType, delivery_status> = {
  accept: delivery_status.unpaid,
  reject: delivery_status.reject,
  cancel: delivery_status.canceled,
};

export default function OrderStatusActions({
  status,
  orderID,
  onStatusUpdated,
}: Props) {
  const dispatch = useAppDispatch();
  const [cancelReason, setCancelReason] = useState("");

  const handleAction = async (actionType: ActionType) => {
    const newStatus = statusMap[actionType];
    if (!newStatus) return;

    if (actionType === "cancel" && !cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    await dispatch(updateOrder({ orderID, status: newStatus }));

    if (actionType === "accept") {
      await dispatch(
        createPayment({
          description: `Thanh toán #${orderID.slice(0, 6)}`,
          returnUrl: "https://facebook.com",
          cancelUrl: "https://wikipedia.org",
          deliveryOrderId: orderID,
        })
      );
    }

    if (actionType === "cancel") {
      await dispatch(
        cancelPayment({
          orderId: orderID,
          cancellationReason: cancelReason.trim(),
        })
      );
      setCancelReason("");
    }

    onStatusUpdated?.();
  };

  const renderDialog = (
    title: string,
    description: string,
    actionLabel: string,
    actionType: ActionType,
    variant: "default" | "destructive" | "outline" = "default"
  ) => {
    const isCancel = actionType === "cancel";

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={variant} size="sm">
            {actionLabel}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          {isCancel && (
            <div className="my-4">
              <label className="block text-sm font-medium mb-1">
                Lý do hủy đơn <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy đơn hàng..."
                className="min-h-[100px]"
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleAction(actionType)}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  switch (status) {
    case delivery_status.pending:
      return (
        <div className="flex gap-2">
          {renderDialog(
            "Xác nhận chấp thuận",
            "Bạn có chắc chắn muốn chấp thuận đơn hàng này không?",
            "Chấp thuận",
            "accept"
          )}
          {renderDialog(
            "Xác nhận từ chối",
            "Bạn có chắc chắn muốn từ chối đơn hàng này không?",
            "Từ chối",
            "reject",
            "destructive"
          )}
        </div>
      );

    case delivery_status.paid:
      return <TripAction orderID={orderID} onSuccess={onStatusUpdated} />;

    case delivery_status.unpaid:
    case delivery_status.scheduled:
    case delivery_status.in_progress:
      return (
        <div>
          {renderDialog(
            "Hủy đơn hàng",
            "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            "Hủy đơn",
            "cancel",
            "outline"
          )}
        </div>
      );

    default:
      return null;
  }
}
