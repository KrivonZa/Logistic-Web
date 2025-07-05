"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppDispatch } from "@/stores";
import { updateStatus } from "@/stores/accountManager/thunk";

type AccountStatus = "active" | "inactive" | "pending";

interface Props {
  accountID: string;
  fullName: string;
  currentStatus: AccountStatus;
  onSuccess?: () => void;
}

const ConfirmStatusActions = ({
  accountID,
  fullName,
  currentStatus,
  onSuccess,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<
    "active" | "inactive" | null
  >(null);
  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (!targetStatus) return;
    await dispatch(updateStatus({ accountID, status: targetStatus }));
    onSuccess?.();
    setOpen(false);
  };

  const renderButtons = () => {
    if (currentStatus === "pending") {
      return (
        <>
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              setTargetStatus("active");
              setOpen(true);
            }}
          >
            Chấp thuận
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setTargetStatus("inactive");
              setOpen(true);
            }}
          >
            Từ chối
          </Button>
        </>
      );
    }

    const singleAction =
      currentStatus === "active"
        ? {
            label: "Ngưng hoạt động",
            status: "inactive",
            variant: "destructive",
          }
        : { label: "Kích hoạt", status: "active", variant: "default" };

    return (
      <Button
        size="sm"
        variant={singleAction.variant as any}
        onClick={() => {
          setTargetStatus(singleAction.status as any);
          setOpen(true);
        }}
      >
        {singleAction.label}
      </Button>
    );
  };

  const confirmText =
    targetStatus === "active"
      ? "kích hoạt / chấp thuận"
      : targetStatus === "inactive"
      ? "ngưng hoạt động / từ chối"
      : "";

  return (
    <>
      <div className="flex gap-2">{renderButtons()}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc muốn <strong>{confirmText}</strong> tài khoản{" "}
            <strong>{fullName}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button
              variant={targetStatus === "inactive" ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmStatusActions;
