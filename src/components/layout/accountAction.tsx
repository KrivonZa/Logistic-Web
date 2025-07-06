"use client";

import { useState } from "react";
import { useAppDispatch } from "@/stores";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateStatus } from "@/stores/accountManager/thunk";
import { toast } from "sonner";

type AccountStatus = "active" | "inactive" | "pending";

interface Props {
  accountID: string;
  fullName: string;
  currentStatus: AccountStatus;
  onSuccess?: () => void;
}

type TargetStatus = Extract<AccountStatus, "active" | "inactive">;

export default function ConfirmStatusActions({
  accountID,
  fullName,
  currentStatus,
  onSuccess,
}: Props) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TargetStatus | null>(null);

  const handleConfirm = async () => {
    if (!targetStatus) return;

    try {
      await dispatch(
        updateStatus({ accountID, status: targetStatus })
      ).unwrap();
      toast.success(`Đã cập nhật trạng thái cho ${fullName}`);
      onSuccess?.();
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setOpen(false);
    }
  };

  const renderActionButtons = () => {
    if (currentStatus === "pending") {
      return (
        <>
          <Button
            size="sm"
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

    const isCurrentlyActive = currentStatus === "active";
    const nextStatus: TargetStatus = isCurrentlyActive ? "inactive" : "active";

    return (
      <Button
        size="sm"
        variant={isCurrentlyActive ? "destructive" : "default"}
        onClick={() => {
          setTargetStatus(nextStatus);
          setOpen(true);
        }}
      >
        {isCurrentlyActive ? "Ngưng hoạt động" : "Kích hoạt"}
      </Button>
    );
  };

  const confirmMessage =
    targetStatus === "active"
      ? "kích hoạt / chấp thuận"
      : "ngưng hoạt động / từ chối";

  return (
    <>
      <div className="flex gap-2">{renderActionButtons()}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc muốn <strong>{confirmMessage}</strong> tài khoản{" "}
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
}
