"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

export default function UserProfile() {
  const user = {
    fullName: "Đặng Văn Lâm",
    email: "lam@example.com",
    phone: "0987654321",
    gender: "Nam",
    birthday: "1995-03-15",
    joinDate: "2022-01-10",
    address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    avatarUrl: "https://i.pravatar.cc/150",
  };

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

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6 md:p-8 space-y-8">
      <CardContent className="space-y-8">
        {/* Avatar + Name */}
        <h1 className="text-2xl md:text-3xl text-primary text-center font-bold mb-6">
          Thông tin cá nhân
        </h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          <Avatar className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>
              {user.fullName
                .split(" ")
                .slice(-2)
                .map((word) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-semibold">{user.fullName}</h2>
            <p className="text-sm text-muted-foreground truncate max-w-xs md:max-w-none">
              {user.email}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Field label="Số điện thoại" value={user.phone} />
          <Field label="Giới tính" value={user.gender} />
          <Field label="Ngày sinh" value={user.birthday} />
          <Field label="Ngày tham gia" value={user.joinDate} />
          <Field label="Địa chỉ" value={user.address} />
        </div>
      </CardContent>
    </Card>
  );
}
