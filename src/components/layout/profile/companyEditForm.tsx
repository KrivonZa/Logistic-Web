import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EditableAvatar from "./editableAvatar";

const formSchema = z.object({
  companyName: z.string().min(2, "Tên doanh nghiệp tối thiểu 2 ký tự"),
  taxCode: z.string().min(10, "Mã số thuế không hợp lệ"),
  legalRep: z.string().min(2, "Vui lòng nhập tên người đại diện"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ quá ngắn"),
  bankName: z.string().min(1, "Vui lòng chọn ngân hàng"),
  bankAccount: z.string().min(12, "Số tài khoản không hợp lệ"),
  license: z
    .instanceof(File, { message: "Vui lòng tải lên giấy phép" })
    .refine((file) => file.size > 0, {
      message: "Tệp không được để trống",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function CompanyEditForm({ info }: { info: any }) {
  const [avatar, setAvatar] = useState<string | null>(info.avatar || null);
  const avatarFileRef = useRef<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const detail = info.detail;
    setValue("companyName", info.fullName || "");
    setValue("taxCode", detail?.taxCode || "");
    setValue("legalRep", detail?.legalRep || "");
    setValue("email", info.email || "");
    setValue("phoneNumber", detail?.phoneNumber || "");
    setValue("address", detail?.address || "");
    setValue("bankName", detail?.bankName || "");
    setValue("bankAccount", detail?.bankAccount || "");
    setAvatar(info.avatar || null);
  }, [info, setValue]);

  const onSubmit = (data: FormData) => {
    console.log("📝 Company form submitted:", data);
    alert("Lưu thành công!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <EditableAvatar
        name={info.fullName}
        avatarUrl={avatar ?? undefined}
        onChange={(file) => {
          setAvatar(URL.createObjectURL(file));
          avatarFileRef.current = file;
        }}
      />

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

      <div className="space-y-1.5">
        <Label htmlFor="license">Giấy phép kinh doanh</Label>
        <Input
          id="license"
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue("license", file);
          }}
        />
        {errors.license && (
          <p className="text-red-500 text-sm">{errors.license.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
