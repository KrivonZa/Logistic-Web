"use client";

import { useState } from "react";
import { useAppDispatch } from "@/stores";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { reviewApplication } from "@/stores/applicationManager/thunk";

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
  const [adminNote, setAdminNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (!targetStatus || !adminNote.trim()) {
      toast.error("Vui lòng nhập ghi chú");
      return;
    }

    const formData = new FormData();
    formData.append("applicationID", applicationID);
    formData.append("applicationStatus", targetStatus);
    formData.append("adminNote", adminNote);
    if (file) formData.append("senderFile", file);

    try {
      await dispatch(reviewApplication(formData)).unwrap();
      toast.success("Cập nhật trạng thái thành công");
      onReload();
      resetState();
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  const resetState = () => {
    setOpen(false);
    setAdminNote("");
    setFile(null);
    setTargetStatus(null);
  };

  if (status !== "PENDING") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
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

      <DialogContent className="max-w-md space-y-5">
        <DialogHeader>
          <DialogTitle>
            {targetStatus === "APPROVED" ? "Chấp thuận đơn" : "Từ chối đơn"}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          Bạn có chắc muốn{" "}
          <strong className="text-foreground">
            {targetStatus === "APPROVED" ? "chấp thuận" : "từ chối"}
          </strong>{" "}
          đơn của <strong className="text-foreground">{fullName}</strong>?
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="adminNote">
              Ghi chú <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="adminNote"
              placeholder="Nhập lý do xử lý đơn..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="file">Tệp đính kèm (nếu có)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={resetState}>
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
