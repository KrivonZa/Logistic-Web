"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditableAvatar from "./editableAvatar";
import { useAppDispatch } from "@/stores";
import { updateAccount } from "@/stores/accountManager/thunk";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AdminFormData = {
  fullName: string;
  email: string;
};

type AdminInfo = {
  fullName: string;
  email: string;
  avatar?: string | null;
};

interface Props {
  info: AdminInfo;
}

export default function AdminEditForm({ info }: Props) {
  const { register, handleSubmit } = useForm<AdminFormData>({
    defaultValues: {
      fullName: info.fullName || "",
      email: info.email || "",
    },
  });

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    info.avatar || null
  );
  const avatarFileRef = useRef<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: AdminFormData) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);

      if (avatarFileRef.current) {
        formData.append("file", avatarFileRef.current);
      }

      await dispatch(updateAccount(formData)).unwrap();

      toast.success("Cập nhật thành công!");
      router.push("/profile");
    } catch (err) {
      toast.error("Cập nhật thất bại", {
        description: err instanceof Error ? err.message : String(err),
      });
      toast.error("Đã xảy ra lỗi khi cập nhật.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <EditableAvatar
        name={info.fullName}
        avatarUrl={avatarPreview ?? undefined}
        onChange={(file: File) => {
          setAvatarPreview(URL.createObjectURL(file));
          avatarFileRef.current = file;
        }}
      />

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input id="fullName" {...register("fullName")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
      </div>

      <div className="space-y-1.5">
        <Label>Vai trò</Label>
        <Input disabled value="Quản trị viên hệ thống" />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
