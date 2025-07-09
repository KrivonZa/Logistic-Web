"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import isAuth from "@/components/isAuth";
import { useAccount } from "@/hooks/useAccount";
import { useApplication } from "@/hooks/useApplication";
import { useAppDispatch } from "@/stores";
import { createApplication } from "@/stores/applicationManager/thunk";
import { uploadFile } from "@/stores/fileManager/thunk";

const Wallet = () => {
  const { info } = useAccount();
  const { loading } = useApplication();
  const dispatch = useAppDispatch();

  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleSubmit = async () => {
    const amount = Number(withdrawAmount);

    if (!note || !file || !withdrawAmount || isNaN(amount) || amount <= 0) {
      toast.error("Vui lòng nhập đầy đủ và hợp lệ các thông tin.");
      return;
    }

    try {
      const uploadRes = await dispatch(uploadFile(file)).unwrap();
      const senderFileUrl = uploadRes?.data;

      if (!info?.accountID) {
        toast.error("Không tìm thấy tài khoản người dùng.");
        return;
      }

      await dispatch(
        createApplication({
          senderID: info.accountID,
          senderNote: note,
          senderFileUrl,
          type: "REQUEST_TO_WITHDRAW",
          withdrawAmount: amount,
        })
      ).unwrap();

      toast.success("Yêu cầu rút tiền đã được gửi thành công.");

      // Reset form
      setNote("");
      setFile(null);
      setWithdrawAmount("");
      setOpen(false);
    } catch {
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center px-4 py-10 sm:py-12 sm:px-6 lg:px-8 min-h-screen"
    >
      <h1 className="text-2xl sm:text-3xl text-primary font-bold mb-6 text-center">
        Ví người dùng
      </h1>

      <div className="bg-white shadow rounded-2xl p-6 w-full max-w-md text-center">
        <p className="text-muted-foreground mb-2">Số dư hiện tại</p>
        <p className="text-3xl font-semibold text-green-600">
          {(info?.balance ?? 0).toLocaleString("vi-VN")}₫
        </p>
      </div>

      {info?.role === "Company" && (
        <div className="mt-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Yêu cầu rút tiền</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Gửi yêu cầu rút tiền</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Số tiền muốn rút
                  </label>
                  <Input
                    type="number"
                    min={1000}
                    placeholder="Nhập số tiền (VND)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Ghi chú</label>
                  <Textarea
                    placeholder="Nhập ghi chú cho admin"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Tập tin đính kèm
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                  {file && (
                    <p className="text-xs text-muted-foreground">{file.name}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </motion.div>
  );
};

export default isAuth(Wallet, ["Company"]);
