"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserStatus = "Active" | "Inactive";

interface User {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  status: UserStatus;
}

const allUsers: User[] = Array.from({ length: 20 }).map((_, i) => ({
  id: (i + 1).toString(),
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  fullName: `Nhân viên ${i + 1}`,
  email: `driver${i + 1}@example.com`,
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

const STATUSES = [
  { label: "Tất cả", value: "all" },
  { label: "Đang hoạt động", value: "Active" },
  { label: "Ngưng hoạt động", value: "Inactive" },
];

function getStatusLabel(status: UserStatus) {
  return status === "Active" ? "Đang hoạt động" : "Ngưng hoạt động";
}

function getBadgeColor(
  status: UserStatus | string
): "destructive" | "secondary" | "default" {
  switch (status) {
    case "Active":
      return "default";
    case "Inactive":
      return "destructive";
    default:
      return "secondary";
  }
}

function paginate<T>(array: T[], pageSize: number, pageNumber: number): T[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

const Drivers = () => {
  const [page, setPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredUsers =
    statusFilter === "all"
      ? allUsers
      : allUsers.filter((user) => user.status === statusFilter);

  const pageSize = 10;
  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const currentPageData = paginate(filteredUsers, pageSize, page);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-7xl mx-auto p-6 w-full"
    >
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Quản lý Tài xế</h1>

      {/* Filter */}
      <div className="flex justify-start items-center mb-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STATUSES.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table Layout (md+) */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
              <TableHead>Khác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map(({ id, avatar, fullName, email, status }) => (
                <TableRow key={id} className="hover:bg-muted">
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={avatar} alt={fullName} />
                      <AvatarFallback>{fullName[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{fullName}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeColor(status)}>
                      {getStatusLabel(status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Sửa
                    </Button>
                    <Button variant="destructive" size="sm">
                      Xóa
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card Layout (<md) */}
      <div className="md:hidden flex flex-col gap-4">
        {currentPageData.length === 0 ? (
          <p className="text-center py-6">Không có dữ liệu</p>
        ) : (
          currentPageData.map(({ id, avatar, fullName, email, status }) => (
            <div
              key={id}
              className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Avatar>
                <AvatarImage src={avatar} alt={fullName} />
                <AvatarFallback>{fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{fullName}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {email}
                </p>
                <Badge className="mt-2" variant={getBadgeColor(status)}>
                  {getStatusLabel(status)}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                <Button variant="outline" size="sm" className="w-20">
                  Chi tiết
                </Button>
                <Button variant="outline" size="sm" className="w-20">
                  Sửa
                </Button>
                <Button variant="destructive" size="sm" className="w-20">
                  Chặn
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (bên dưới bảng) */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Trước
          </Button>

          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={page === pageCount}
            onClick={() => setPage(page + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default isAuth(Drivers, ["Admin"]);
