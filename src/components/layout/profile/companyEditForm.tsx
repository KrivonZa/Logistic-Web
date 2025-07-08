"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EditableAvatar from "./editableAvatar";
import { useAppDispatch } from "@/stores";
import { updateAccount } from "@/stores/accountManager/thunk";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 🧩 Zod schema
const formSchema = z.object({
  companyName: z.string().min(2, "Tên doanh nghiệp tối thiểu 2 ký tự"),
  taxCode: z.string().min(10, "Mã số thuế không hợp lệ"),
  legalRep: z.string().min(2, "Vui lòng nhập tên người đại diện"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ quá ngắn"),
  bankName: z.string().min(1, "Vui lòng chọn ngân hàng"),
  bankAccount: z.string().min(10, "Số tài khoản không hợp lệ"),
  license: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanyDetail {
  taxCode: string;
  legalRep: string;
  phoneNumber: string;
  address: string;
  bankName: string;
  bankAccount: string;
  license?: string;
}

interface CompanyInfo {
  fullName: string;
  email: string;
  avatar?: string | null;
  detail: CompanyDetail;
}

interface Props {
  info: CompanyInfo;
}

export default function CompanyEditForm({ info }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const avatarFileRef = useRef<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(info.avatar || null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Set initial values from props
  useEffect(() => {
    const d = info.detail;
    setValue("companyName", info.fullName || "");
    setValue("taxCode", d?.taxCode || "");
    setValue("legalRep", d?.legalRep || "");
    setValue("email", info.email || "");
    setValue("phoneNumber", d?.phoneNumber || "");
    setValue("address", d?.address || "");
    setValue("bankName", d?.bankName || "");
    setValue("bankAccount", d?.bankAccount || "");
    setAvatar(info.avatar || null);
  }, [info, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.companyName);
      formData.append("email", data.email);
      formData.append("company[taxCode]", data.taxCode);
      formData.append("company[legalRep]", data.legalRep);
      formData.append("company[phoneNumber]", data.phoneNumber);
      formData.append("company[address]", data.address);
      formData.append("company[bankName]", data.bankName);
      formData.append("company[bankAccount]", data.bankAccount);

      // 🛠️ Chỉ gửi nếu user chọn file mới
      if (data.license instanceof File) {
        formData.append("company[license]", data.license);
      }

      if (avatarFileRef.current) {
        formData.append("file", avatarFileRef.current);
      }

      await dispatch(updateAccount(formData)).unwrap();
      toast.success("✅ Cập nhật thành công!");
      router.push("/profile");
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Avatar */}
      <EditableAvatar
        name={info.fullName}
        avatarUrl={avatar ?? undefined}
        onChange={(file) => {
          setAvatar(URL.createObjectURL(file));
          avatarFileRef.current = file;
        }}
      />

      {/* Input fields */}
      {[
        { label: "Tên doanh nghiệp", name: "companyName" },
        { label: "Mã số thuế", name: "taxCode" },
        { label: "Người đại diện", name: "legalRep" },
        { label: "Email", name: "email", type: "email" },
        { label: "Số điện thoại", name: "phoneNumber" },
        { label: "Địa chỉ", name: "address" },
        { label: "Ngân hàng", name: "bankName" },
        { label: "Số tài khoản", name: "bankAccount" },
      ].map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.type ?? "text"}
            {...register(field.name as keyof FormData)}
          />
          {errors[field.name as keyof FormData] && (
            <p className="text-red-500 text-sm">
              {errors[field.name as keyof FormData]?.message as string}
            </p>
          )}
        </div>
      ))}

      {/* License upload */}
      <div className="space-y-1.5">
        <Label htmlFor="license">Giấy phép kinh doanh</Label>
        <Input
          id="license"
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setValue("license", file, { shouldValidate: true });
            }
          }}
        />
        {errors.license && (
          <p className="text-red-500 text-sm">{errors.license.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
