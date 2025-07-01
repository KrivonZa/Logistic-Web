"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

const Wallet = () => {
  const { info } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!file || !note) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // TODO: call API gửi yêu cầu rút tiền
    console.log("Gửi yêu cầu rút tiền với:", { file, note });
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Yêu cầu rút tiền</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Gửi yêu cầu rút tiền</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
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
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit}>Gửi yêu cầu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </motion.div>
  );
};

export default isAuth(Wallet, ["Admin", "Company"]);
