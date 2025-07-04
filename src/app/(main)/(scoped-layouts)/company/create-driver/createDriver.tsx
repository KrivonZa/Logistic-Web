"use client";

import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppDispatch } from "@/stores";
import { uploadFile } from "@/stores/fileManager/thunk";
import { createApplication } from "@/stores/applicationManager/thunk";
import { useFile } from "@/hooks/useFile";
import { useApplication } from "@/hooks/useApplication";
import { useAccount } from "@/hooks/useAccount";
import { useRouter } from "next/navigation";

const CreateDriver = () => {
  const [file, setFile] = useState<File | null>(null);
  const [senderNote, setSenderNote] = useState("");
  const dispatch = useAppDispatch();
  const { info } = useAccount();
  const { loading: loadingFile } = useFile();
  const { loading: loadingApplication } = useApplication();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file để gửi");
      return;
    }

    if (!senderNote.trim()) {
      toast.error("Vui lòng nhập ghi chú");
      return;
    }

    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Định dạng file không hợp lệ");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file vượt quá 5MB");
      return;
    }

    try {
      const uploadRes = await dispatch(uploadFile(file)).unwrap();
      const senderFileUrl = uploadRes.url;

      const applicationPayload = {
        senderID: info?.accountID as string,
        senderNote,
        type: "REQUEST_DRIVERS_ACCOUNT",
        senderFileUrl,
      };

      await dispatch(createApplication(applicationPayload)).unwrap();
      toast.success("Gửi đơn thành công!");
      setFile(null);
      setSenderNote("");
    } catch (err) {
      console.error(err);
      toast.error("Gửi đơn thất bại");
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-6 py-12 px-4 sm:px-6 lg:px-8"
    >
      <h1 className="text-2xl font-semibold">Nộp đơn đăng ký tài xế</h1>

      <a
        href="/files/template.xlsx"
        download
        className="text-blue-600 underline hover:text-blue-800"
      >
        Tải file mẫu tại đây
      </a>

      <Input
        type="file"
        accept=".xlsx,.xls,.pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full max-w-md"
      />

      <Textarea
        placeholder="Nhập ghi chú cho đơn đăng ký của bạn"
        value={senderNote}
        onChange={(e) => setSenderNote(e.target.value)}
        className="w-full max-w-md"
        rows={4}
      />

      <Button
        onClick={handleSubmit}
        disabled={loadingFile || loadingApplication}
        className="w-full max-w-md"
      >
        {loadingFile || loadingApplication ? "Đang gửi..." : "Gửi đơn"}
      </Button>

      <Button
        variant="outline"
        onClick={() => router.push("/company/users/drivers")}
        className="w-full max-w-md"
      >
        Trở về
      </Button>
    </motion.div>
  );
};

export default isAuth(CreateDriver, ["Company"]);
