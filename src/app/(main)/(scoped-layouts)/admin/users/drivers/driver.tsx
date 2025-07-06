"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useAppDispatch } from "@/stores";
import { getDriver } from "@/stores/accountManager/thunk";
import { useAccount } from "@/hooks/useAccount";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmStatusButton from "@/components/layout/accountAction";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DriverDetail } from "@/types/account";
import { AccountStatus } from "@/types/account";

const STATUS_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Ngưng hoạt động", value: "inactive" },
  { label: "Chờ duyệt", value: "pending" },
];

const DriverManagement = () => {
  const dispatch = useAppDispatch();
  const { driverAccounts, loading } = useAccount();

  const [page, setPage] = useState(1);
  const [driverName, setDriverName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("all");

  const debouncedFetch = useMemo(
    () =>
      debounce((driverName, companyName, page, status) => {
        dispatch(
          getDriver({
            page,
            limit: 10,
            search: driverName,
            companyName,
            status: status === "all" ? "" : status,
          })
        );
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch(driverName, companyName, page, status);
    return () => debouncedFetch.cancel();
  }, [driverName, companyName, page, status, debouncedFetch]);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "inactive":
        return "Ngưng hoạt động";
      case "pending":
        return "Chờ duyệt";
      default:
        return status;
    }
  };

  const totalPages = useMemo(() => {
    return driverAccounts?.total ? Math.ceil(driverAccounts.total / 10) : 1;
  }, [driverAccounts]);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-7xl mx-auto p-6 w-full"
    >
      <h1 className="text-2xl font-bold mb-6">Quản lý tài xế</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Tìm theo tên tài xế"
          className="w-full sm:w-72"
          onChange={(e) => setDriverName(e.target.value)}
        />
        <Input
          placeholder="Tìm theo tên công ty"
          className="w-full sm:w-72"
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Select value={status} onValueChange={(val) => setStatus(val)}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto hidden md:block">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : driverAccounts?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              driverAccounts?.data.map((acc) => {
                const detail = acc.detail as DriverDetail;
                return (
                  <TableRow key={acc.accountID} className="hover:bg-muted">
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={acc.avatar} />
                        <AvatarFallback>{acc.fullName[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{acc.fullName}</TableCell>
                    <TableCell>{acc.email}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeColor(acc.status)}>
                        {getStatusLabel(acc.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Chi tiết tài xế</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Họ tên:</strong> {acc.fullName}
                            </p>
                            <p>
                              <strong>Email:</strong> {acc.email}
                            </p>
                            <p>
                              <strong>Điện thoại:</strong> {detail.phoneNumber}
                            </p>
                            <p>
                              <strong>Công ty:</strong> {detail.companyName}
                            </p>
                            <p>
                              <strong>Số GPLX:</strong> {detail.licenseNumber}
                            </p>
                            <p>
                              <strong>Loại bằng:</strong> {detail.licenseLevel}
                            </p>
                            <p>
                              <strong>Ngày hết hạn:</strong>{" "}
                              {detail.licenseExpiry
                                ? new Date(
                                    detail.licenseExpiry
                                  ).toLocaleDateString("vi-VN")
                                : "Không rõ"}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <ConfirmStatusButton
                        accountID={acc.accountID}
                        fullName={acc.fullName}
                        currentStatus={acc.status as AccountStatus}
                        onSuccess={() =>
                          debouncedFetch(driverName, companyName, page, status)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {driverAccounts?.data.map((acc) => {
          const detail = acc.detail as DriverDetail;
          return (
            <div
              key={acc.accountID}
              className="border rounded-xl p-4 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={acc.avatar} />
                  <AvatarFallback>{acc.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg truncate">
                    {acc.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {acc.email}
                  </p>
                  <Badge className="mt-2" variant={getBadgeColor(acc.status)}>
                    {getStatusLabel(acc.status)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1">
                      Chi tiết
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chi tiết tài xế</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Họ tên:</strong> {acc.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {acc.email}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong> {detail.phoneNumber}
                      </p>
                      <p>
                        <strong>Công ty:</strong> {detail.companyName}
                      </p>
                      <p>
                        <strong>Số GPLX:</strong> {detail.licenseNumber}
                      </p>
                      <p>
                        <strong>Loại bằng:</strong> {detail.licenseLevel}
                      </p>
                      <p>
                        <strong>Ngày hết hạn:</strong>{" "}
                        {detail.licenseExpiry
                          ? new Date(detail.licenseExpiry).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Không rõ"}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
                <ConfirmStatusButton
                  accountID={acc.accountID}
                  fullName={acc.fullName}
                  currentStatus={acc.status as AccountStatus}
                  onSuccess={() =>
                    debouncedFetch(driverName, companyName, page, status)
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {driverAccounts && driverAccounts?.total > 10 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Trang trước
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <Button
                key={pageNumber}
                variant={page === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default isAuth(DriverManagement, ["Admin"]);
