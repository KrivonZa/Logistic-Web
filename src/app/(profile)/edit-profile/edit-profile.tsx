"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAccount } from "@/hooks/useAccount";
import CompanyEditForm from "@/components/layout/profile/companyEditForm";
import AdminEditForm from "@/components/layout/profile/adminEditForm";

export default function EditProfile() {
  const { loading, info } = useAccount();

  const renderEditForm = () => {
    if (!info?.role) return null;

    switch (info.role) {
      case "Company":
        return <CompanyEditForm info={info} />;
      case "Admin":
        return <AdminEditForm info={info} />;
      default:
        return (
          <p className="text-muted-foreground">
            Không có form phù hợp để chỉnh sửa.
          </p>
        );
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6 md:p-8 space-y-8">
      <CardContent className="space-y-8">
        <h1 className="text-2xl md:text-3xl text-primary text-center font-bold">
          Chỉnh sửa thông tin
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Spinner className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Đang tải thông tin...</p>
          </div>
        ) : (
          renderEditForm()
        )}
      </CardContent>
    </Card>
  );
}
