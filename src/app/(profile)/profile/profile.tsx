"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { profile } from "@/stores/accountManager/thunk";
import { useAccount } from "@/hooks/useAccount";
import { useAppDispatch } from "@/stores";
import { Loader2 } from "lucide-react";

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const { loading, info } = useAccount();

  useEffect(() => {
    dispatch(profile());
  }, []);

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1.5">
      <Label className="text-base font-medium">{label}</Label>
      <div className="relative">
        <Input
          value={value}
          disabled
          className="pr-10 bg-muted/50 cursor-default"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-600"
        >
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );

  const renderDetailFields = () => {
    if (!info?.role) return null;

    const detail = info.detail;

    switch (info.role) {
      case "Company":
        return (
          <>
            <Field label="Tên công ty" value={detail?.companyName ?? ""} />
            <Field label="Mã số thuế" value={detail?.taxCode ?? ""} />
            <Field label="Người đại diện" value={detail?.picFullName ?? ""} />
            <Field label="Email liên hệ" value={detail?.contactEmail ?? ""} />
            <Field
              label="Cập nhật lần cuối"
              value={
                detail?.updatedAt
                  ? new Date(detail.updatedAt).toLocaleDateString("vi-VN")
                  : ""
              }
            />
          </>
        );

      case "Coordinator":
        return (
          <>
            <Field
              label="Công ty trực thuộc"
              value={detail?.Company?.companyName ?? ""}
            />
            <Field label="Mã nhân viên" value={detail?.employeeCode ?? ""} />
            <Field label="Số điện thoại" value={detail?.phoneNumber ?? ""} />
            <Field
              label="Cập nhật lần cuối"
              value={
                detail?.updatedAt
                  ? new Date(detail.updatedAt).toLocaleDateString("vi-VN")
                  : ""
              }
            />
          </>
        );

      case "Staff":
        return (
          <>
            <Field label="Đơn vị công tác" value={detail?.department ?? ""} />
            <Field label="Mã nhân viên" value={detail?.phone ?? ""} />
            <Field
              label="Cập nhật lần cuối"
              value={
                detail?.updatedAt
                  ? new Date(detail.updatedAt).toLocaleDateString("vi-VN")
                  : ""
              }
            />
          </>
        );

      case "Admin":
        return <Field label="Vai trò" value="Quản trị viên hệ thống" />;

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6 md:p-8 space-y-8 min-h-[400px]">
      <CardContent className="space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Đang tải thông tin...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl text-primary text-center font-bold mb-6">
              Thông tin cá nhân
            </h1>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                <AvatarImage src={info?.avatar} />
                <AvatarFallback>{info?.fullName?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold">
                  {info?.fullName}
                </h2>
                <p className="text-sm text-muted-foreground truncate max-w-xs md:max-w-none">
                  {info?.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">{renderDetailFields()}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
