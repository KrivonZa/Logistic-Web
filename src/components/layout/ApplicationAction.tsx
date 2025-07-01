"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAppDispatch } from "@/stores";
// import { updateApplicationStatus } from "@/stores/applicationManager/thunk"; // thunk này bạn phải tạo

interface Props {
  applicationID: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  fullName: string;
  onReload: () => void;
}

const ApplicationAction = ({
  applicationID,
  status,
  fullName,
  onReload,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);
  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (!targetStatus) return;
    console.log(applicationID, targetStatus);
    // await dispatch(updateApplicationStatus({ applicationID, status: targetStatus }));
    setOpen(false);
    onReload();
  };

  if (status !== "PENDING") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            setTargetStatus("APPROVED");
            setOpen(true);
          }}
        >
          Chấp thuận
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            setTargetStatus("REJECTED");
            setOpen(true);
          }}
        >
          Từ chối
        </Button>
      </div>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận</DialogTitle>
        </DialogHeader>
        <p>
          Bạn có chắc muốn{" "}
          <strong>
            {targetStatus === "APPROVED" ? "chấp thuận" : "từ chối"}
          </strong>{" "}
          đơn của <strong>{fullName}</strong>?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            variant={targetStatus === "REJECTED" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationAction;
