"use client";

import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { useAppDispatch } from "@/stores";
import { getCustomer } from "@/stores/accountManager/thunk";
import { useAccount } from "@/hooks/useAccount";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmButton from "@/components/layout/accountAction";
import { motion } from "framer-motion";

const STATUS_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Ngưng hoạt động", value: "inactive" },
];

const CustomerManagement = () => {
  const dispatch = useAppDispatch();
  const { customerAccounts, loading } = useAccount();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const debouncedFetch = useMemo(
    () =>
      debounce((s: string, p: number, st: string) => {
        dispatch(
          getCustomer({
            page: p,
            limit: 10,
            search: s,
            status: st === "all" ? "" : st,
          })
        );
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedFetch(search, page, status);
    return () => debouncedFetch.cancel();
  }, [search, page, status, debouncedFetch]);

  const totalPages = useMemo(() => {
    return customerAccounts?.total ? Math.ceil(customerAccounts.total / 10) : 1;
  }, [customerAccounts]);

  const renderAccountRow = (acc: any) => (
    <TableRow key={acc.accountID}>
      <TableCell>
        <Avatar>
          <AvatarImage src={acc.avatar} />
          <AvatarFallback>{acc.fullName[0]}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>{acc.fullName}</TableCell>
      <TableCell>{acc.email}</TableCell>
      <TableCell>{acc.detail.phoneNumber}</TableCell>
      <TableCell>
        <Badge variant={acc.status === "active" ? "default" : "destructive"}>
          {acc.status === "active" ? "Đang hoạt động" : "Ngưng hoạt động"}
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
              <DialogTitle>Chi tiết khách hàng</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <strong>Họ tên:</strong> {acc.fullName}
              </p>
              <p>
                <strong>Email:</strong> {acc.email}
              </p>
              <p>
                <strong>Điện thoại:</strong> {acc.detail.phoneNumber}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {acc.detail.address}
              </p>
            </div>
          </DialogContent>
        </Dialog>
        {["active", "pending"].includes(acc.status) && (
          <ConfirmButton
            fullName={acc.fullName}
            currentStatus={acc.status}
            onConfirm={() => {
              console.log("Đổi trạng thái:", acc.accountID);
            }}
          />
        )}
      </TableCell>
    </TableRow>
  );

  const renderAccountCard = (acc: any) => (
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
          <h3 className="font-semibold">{acc.fullName}</h3>
          <p className="text-sm text-muted-foreground">{acc.email}</p>
        </div>
      </div>
      <p>
        <strong>Điện thoại:</strong> {acc.detail.phoneNumber}
      </p>
      <Badge variant={acc.status === "active" ? "default" : "destructive"}>
        {acc.status === "active" ? "Đang hoạt động" : "Ngưng hoạt động"}
      </Badge>
      <div className="flex gap-2 mt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex-1">
              Chi tiết
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chi tiết khách hàng</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <strong>Họ tên:</strong> {acc.fullName}
              </p>
              <p>
                <strong>Email:</strong> {acc.email}
              </p>
              <p>
                <strong>Điện thoại:</strong> {acc.detail.phoneNumber}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {acc.detail.address}
              </p>
            </div>
          </DialogContent>
        </Dialog>
        {["active", "pending"].includes(acc.status) && (
          <ConfirmButton
            fullName={acc.fullName}
            currentStatus={acc.status}
            onConfirm={() => {
              console.log("Đổi trạng thái:", acc.accountID);
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-4">Quản lý khách hàng</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Tìm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table layout (desktop) */}
      <div className="overflow-x-auto hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : Array.isArray(customerAccounts?.data) &&
              customerAccounts.data.length > 0 ? (
              customerAccounts.data.map(renderAccountRow)
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card layout (mobile) */}
      <div className="md:hidden space-y-4">
        {Array.isArray(customerAccounts?.data) &&
          customerAccounts.data.map(renderAccountCard)}
      </div>

      {/* Pagination */}
      {customerAccounts?.total > 10 && (
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

export default CustomerManagement;
