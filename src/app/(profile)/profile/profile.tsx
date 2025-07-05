"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profile } from "@/stores/accountManager/thunk";
import { useAccount } from "@/hooks/useAccount";
import { useAppDispatch } from "@/stores";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import isAuth from "@/components/isAuth";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { loading, info } = useAccount();
  const router = useRouter();

  useEffect(() => {
    dispatch(profile());
  }, []);

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1.5">
      <Label className="text-base font-medium">{label}</Label>
      <Input value={value} disabled className="bg-muted/50 cursor-default" />
    </div>
  );

  const LinkField = ({ label, url }: { label: string; url: string }) => (
    <div className="space-y-1.5">
      <Label className="text-base font-medium">{label}</Label>
      {url ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(url, "_blank")}
        >
          Xem giấy phép kinh doanh
        </Button>
      ) : (
        <Input
          disabled
          value=""
          className="bg-muted/50 cursor-default"
          placeholder="Không có dữ liệu"
        />
      )}
    </div>
  );

  const renderDetailFields = () => {
    if (!info?.role) return null;

    const detail = info.detail;

    switch (info.role) {
      case "Company":
        return (
          <>
            <Field label="Tên công ty" value={info?.fullName ?? ""} />
            <Field label="Mã số thuế" value={detail?.taxCode ?? ""} />
            <Field
              label="Người đại diện hợp pháp"
              value={detail?.legalRep ?? ""}
            />
            <Field label="Email liên hệ" value={info?.email ?? ""} />
            <Field label="Số điện thoại" value={detail?.phoneNumber ?? ""} />
            <Field label="Địa chỉ" value={detail?.address ?? ""} />
            <Field label="Ngân hàng" value={detail?.bankName ?? ""} />
            <Field label="Số tài khoản" value={detail?.bankAccount ?? ""} />
            <LinkField
              label="Giấy phép kinh doanh"
              url={detail?.license ?? ""}
            />
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
        return (
          <>
            <Field label="Vai trò" value="Quản trị viên hệ thống" />
            <Field label="Họ và tên" value={info?.fullName ?? ""} />
            <Field label="Email" value={info?.email ?? ""} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6 md:p-8 space-y-8 min-h-[400px]">
      <CardContent className="space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Spinner className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Đang tải thông tin...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl text-primary text-center font-bold mb-6">
              Thông tin
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

            <div className="flex justify-end pt-4">
              <Button onClick={() => router.push("/edit-profile")}>
                Chỉnh sửa
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default isAuth(UserProfile, ["Admin", "Company"]);
