"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type AccountStatus = "active" | "inactive" | "pending";

interface Props {
  fullName: string;
  currentStatus: AccountStatus;
  onConfirm: () => void;
}

const ConfirmStatusButton = ({ fullName, currentStatus, onConfirm }: Props) => {
  const [open, setOpen] = useState(false);

  const { label, variant, confirmText } = (() => {
    switch (currentStatus) {
      case "active":
        return {
          label: "Ngưng hoạt động",
          variant: "destructive",
          confirmText: "ngưng hoạt động",
        };
      case "inactive":
        return {
          label: "Kích hoạt",
          variant: "default",
          confirmText: "kích hoạt lại",
        };
      case "pending":
        return {
          label: "Chấp thuận",
          variant: "default",
          confirmText: "chấp thuận tài khoản",
        };
      default:
        return {
          label: "Hành động",
          variant: "secondary",
          confirmText: "cập nhật trạng thái",
        };
    }
  })();

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={variant as any}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận</DialogTitle>
        </DialogHeader>
        <p>
          Bạn có chắc muốn <strong>{confirmText}</strong> cho tài khoản{" "}
          <strong>{fullName}</strong>?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button variant={variant as any} onClick={handleConfirm}>
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmStatusButton;
