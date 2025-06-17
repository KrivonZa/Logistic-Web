import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditableAvatar from "./editableAvatar";

type CoordinatorFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  employeeCode: string;
};

export default function CoordinatorEditForm({ info }: { info: any }) {
  const { register, handleSubmit } = useForm<CoordinatorFormData>({
    defaultValues: {
      fullName: info.fullName || "",
      email: info.email || "",
      phoneNumber: info.detail?.phoneNumber || "",
      employeeCode: info.detail?.employeeCode || "",
    },
  });
  const [avatar, setAvatar] = useState<string | null>(info.avatar || null);
  const avatarFileRef = useRef<File | null>(null);

  const onSubmit = (data: CoordinatorFormData) => {
    console.log("📝 Coordinator form submitted:", data);
    alert("Lưu thành công!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <EditableAvatar
        name={info.fullName}
        avatarUrl={avatar}
        onChange={(file: File) => {
          setAvatar(URL.createObjectURL(file));
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
        <Label htmlFor="phoneNumber">Số điện thoại</Label>
        <Input id="phoneNumber" {...register("phoneNumber")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="employeeCode">Mã nhân viên</Label>
        <Input id="employeeCode" {...register("employeeCode")} />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">Lưu thay đổi</Button>
      </div>
    </form>
  );
}
