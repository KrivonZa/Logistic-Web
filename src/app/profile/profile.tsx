"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const user = {
    avatar: "/avatar.png",
    fullName: "Đặng Văn Lâm",
    email: "lam@example.com",
    roles: ["Coordinator", "Staff"],
    company: {
      companyPic: "/company.png",
      companyName: "Công ty TNHH ABC",
      taxCode: "0123456789",
      contactEmail: "contact@abc.com",
    },
    coordinator: {
      employeeCode: "COORD123",
      phoneNumber: "0123456789",
    },
    staff: {
      employeeCode: "STAFF456",
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Avatar + tên */}
      <div className="flex items-center gap-6">
        <Avatar className="w-28 h-28 border-4 border-primary">
          <AvatarImage src={user.avatar} alt={user.fullName} />
          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-primary">{user.fullName}</h1>
          <p className="text-subtle text-lg">{user.email}</p>
          <div className="flex gap-2 mt-2">
            {user.roles.map((role) => (
              <Badge
                key={role}
                className="uppercase text-sm font-semibold"
                variant="outline"
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Thông tin công ty */}
      <Card>
        <CardContent className="flex gap-6 items-center">
          <img
            src={user.company.companyPic}
            alt={user.company.companyName}
            className="w-24 h-24 object-cover rounded"
          />
          <div>
            <h2 className="text-2xl font-semibold text-secondary">
              {user.company.companyName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Mã số thuế: {user.company.taxCode}
            </p>
            <p className="text-sm text-muted-foreground">
              Email liên hệ: {user.company.contactEmail}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin Coordinator */}
      {user.roles.includes("Coordinator") && (
        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold text-tertiary mb-2">
              Thông tin Coordinator
            </h3>
            <p>
              Mã nhân viên: <span className="font-medium">{user.coordinator.employeeCode}</span>
            </p>
            <p>
              Số điện thoại: <span className="font-medium">{user.coordinator.phoneNumber}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Thông tin Staff */}
      {user.roles.includes("Staff") && (
        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold text-tertiary mb-2">
              Thông tin Staff
            </h3>
            <p>
              Mã nhân viên: <span className="font-medium">{user.staff.employeeCode}</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
