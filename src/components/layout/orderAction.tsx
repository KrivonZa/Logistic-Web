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
import { useAppDispatch } from "@/stores";
import { updateOrder } from "@/stores/orderManager/thunk";
import { delivery_status } from "@/types/order";

interface Props {
  status: string;
  orderID: string;
}

type ActionType = "accept" | "reject" | "cancel";

const statusMap: Record<ActionType, delivery_status> = {
  accept: delivery_status.unpaid,
  reject: delivery_status.reject,
  cancel: delivery_status.canceled,
};

export default function OrderStatusActions({ status, orderID }: Props) {
  const dispatch = useAppDispatch();

  const handleAction = (actionType: ActionType) => {
    const newStatus = statusMap[actionType];
    if (newStatus) {
      dispatch(updateOrder({ orderID, status: newStatus }));
    }
  };

  const renderDialog = (
    title: string,
    description: string,
    actionLabel: string,
    actionType: ActionType,
    variant: "default" | "destructive" | "outline" = "default"
  ) => (
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
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleAction(actionType)}>
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

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

    case delivery_status.unpaid:
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
