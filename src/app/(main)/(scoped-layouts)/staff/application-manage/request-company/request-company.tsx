"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface Application {
  applicationID: string;
  status: ApplicationStatus;
  senderNote: string;
  senderFileUrl?: string;
  staffNote?: string;
  staffFileUrl?: string;
  createdAt: string;
  account: {
    accountID: string;
    email: string;
    fullName: string;
    avatar?: string;
    status: string;
    role: string;
    createdAt: string;
  };
  company: {
    taxCode: string;
    legalRep: string;
    phoneNumber: string;
    address: string;
    bankName: string;
    bankAccount: string;
    license: string;
  };
}

const statusColor: Record<ApplicationStatus, string> = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-600",
  REJECTED: "bg-red-600",
};

// Sample data
const mockApplications: Application[] = [
  {
    applicationID: "a1",
    status: "PENDING",
    senderNote: "Chúng tôi muốn trở thành đối tác vận chuyển.",
    senderFileUrl: "https://example.com/license.pdf",
    createdAt: "2025-06-17T10:00:00Z",
    account: {
      accountID: "acc1",
      email: "company1@example.com",
      fullName: "Công ty TNHH ABC",
      avatar: "",
      status: "pending",
      role: "Company",
      createdAt: "2025-06-10T09:30:00Z",
    },
    company: {
      taxCode: "123456789",
      legalRep: "Nguyễn Văn A",
      phoneNumber: "0909000111",
      address: "123 Đường Lê Lợi, TP. Hồ Chí Minh",
      bankName: "Vietcombank",
      bankAccount: "0123456789",
      license: "ABC123XYZ",
    },
  },
  {
    applicationID: "a2",
    status: "APPROVED",
    senderNote: "Muốn hoạt động với tư cách là doanh nghiệp vận tải.",
    staffNote: "Đã xem giấy phép, hợp lệ.",
    staffFileUrl: "https://example.com/confirm.pdf",
    createdAt: "2025-06-16T13:20:00Z",
    account: {
      accountID: "acc2",
      email: "company2@example.com",
      fullName: "Công ty TNHH XYZ",
      avatar: "",
      status: "active",
      role: "Company",
      createdAt: "2025-06-08T14:00:00Z",
    },
    company: {
      taxCode: "987654321",
      legalRep: "Trần Thị B",
      phoneNumber: "0909111222",
      address: "456 Nguyễn Huệ, TP. Hồ Chí Minh",
      bankName: "Techcombank",
      bankAccount: "9876543210",
      license: "XYZ789ABC",
    },
  },
];

const RequestCompany = () => {
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");

  const filtered = filter === "ALL"
    ? mockApplications
    : mockApplications.filter((app) => app.status === filter);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="w-full max-w-6xl space-y-6">
        <Tabs defaultValue="ALL" onValueChange={(v: any) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="ALL">Tất cả</TabsTrigger>
            <TabsTrigger value="PENDING">Chờ duyệt</TabsTrigger>
            <TabsTrigger value="APPROVED">Đã duyệt</TabsTrigger>
            <TabsTrigger value="REJECTED">Từ chối</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="">
          {filtered.map((app) => (
            <Card key={app.applicationID} className="my-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Yêu cầu trở thành công ty</CardTitle>
                  <Badge className={`${statusColor[app.status]} text-white`}>
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Info */}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={app.account.avatar} />
                    <AvatarFallback>{app.account.fullName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{app.account.fullName}</p>
                    <p className="text-sm text-gray-500">{app.account.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>MST:</strong> {app.company.taxCode}</p>
                    <p><strong>Đại diện:</strong> {app.company.legalRep}</p>
                    <p><strong>Điện thoại:</strong> {app.company.phoneNumber}</p>
                    <p><strong>Địa chỉ:</strong> {app.company.address}</p>
                  </div>
                  <div>
                    <p><strong>Ngân hàng:</strong> {app.company.bankName}</p>
                    <p><strong>Tài khoản:</strong> {app.company.bankAccount}</p>
                    <p><strong>GP kinh doanh:</strong> {app.company.license}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(app.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                {/* Ghi chú người gửi */}
                <div className="text-sm">
                  <p><strong>Ghi chú:</strong> {app.senderNote}</p>
                  {app.senderFileUrl && (
                    <a
                      href={app.senderFileUrl}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem file đính kèm
                    </a>
                  )}
                </div>

                {/* Ghi chú staff (nếu có) */}
                {app.staffNote && (
                  <div className="text-sm border-t pt-4">
                    <p><strong>Ghi chú từ nhân viên:</strong> {app.staffNote}</p>
                    {app.staffFileUrl && (
                      <a
                        href={app.staffFileUrl}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        File phản hồi
                      </a>
                    )}
                  </div>
                )}

                {/* Staff input nếu là PENDING */}
                {app.status === "PENDING" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid gap-2">
                      <Label>Ghi chú của nhân viên</Label>
                      <Textarea placeholder="Ghi chú phản hồi..." />
                    </div>
                    <div className="grid gap-2">
                      <Label>File đính kèm</Label>
                      <Input type="file" />
                    </div>
                    <div className="flex gap-4">
                      <Button variant="default">Phê duyệt</Button>
                      <Button variant="destructive">Từ chối</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </motion.div>
  );
};

export default isAuth(RequestCompany, ["Staff"]);
