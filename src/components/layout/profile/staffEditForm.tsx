import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditableAvatar from "./editableAvatar";

type StaffFormData = {
  fullName: string;
  email: string;
  employeeCode: string;
  department: string;
};

export default function StaffEditForm({ info }: { info: any }) {
  const { register, handleSubmit } = useForm<StaffFormData>({
    defaultValues: {
      fullName: info.fullName || "",
      email: info.email || "",
      employeeCode: info.detail?.employeeCode || "",
      department: info.detail?.department || "",
    },
  });

  const [avatar, setAvatar] = useState<string | null>(info.avatar || null);
  const avatarFileRef = useRef<File | null>(null);

  const onSubmit = (data: StaffFormData) => {
    console.log("📝 Staff form submitted:", data);
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
        <Label htmlFor="employeeCode">Mã nhân viên</Label>
        <Input id="employeeCode" {...register("employeeCode")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="department">Đơn vị công tác</Label>
        <Input id="department" {...register("department")} />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">Lưu thay đổi</Button>
      </div>
    </form>
  );
}
