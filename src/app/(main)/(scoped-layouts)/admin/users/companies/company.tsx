"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useAppDispatch } from "@/stores";
import { getCompany } from "@/stores/accountManager/thunk";
import { useAccount } from "@/hooks/useAccount";

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
import { CompanyDetail } from "@/types/account";

const STATUS_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Ngưng hoạt động", value: "inactive" },
  { label: "Chờ duyệt", value: "pending" },
];

const CompanyManagement = () => {
  const dispatch = useAppDispatch();
  const { companyAccounts, loading } = useAccount();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setPage(1);
        setSearch(val);
      }, 500),
    []
  );

  useEffect(() => {
    dispatch(
      getCompany({
        page,
        limit: 10,
        search,
        status: status === "all" ? "" : status,
      })
    );
  }, [dispatch, page, search, status]);

  const totalPages = useMemo(() => {
    return companyAccounts?.total ? Math.ceil(companyAccounts.total / 10) : 1;
  }, [companyAccounts]);

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

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-7xl mx-auto p-6 w-full"
    >
      <h1 className="text-2xl font-bold mb-6">Quản lý công ty</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Tìm theo tên công ty"
          className="w-full sm:w-72"
          onChange={(e) => debouncedSearch(e.target.value)}
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
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Tên công ty</TableHead>
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
            ) : companyAccounts?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              companyAccounts?.data.map((acc) => {
                const detail = acc.detail as CompanyDetail;
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
                            <DialogTitle>Chi tiết công ty</DialogTitle>
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
                              <strong>Địa chỉ:</strong> {detail.address}
                            </p>
                            <p>
                              <strong>Mã số thuế:</strong> {detail.taxCode}
                            </p>
                            <p>
                              <strong>Người đại diện:</strong> {detail.legalRep}
                            </p>
                            <p>
                              <strong>Ngân hàng:</strong> {detail.bankName}
                            </p>
                            <p>
                              <strong>Số tài khoản:</strong>{" "}
                              {detail.bankAccount}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {["active", "pending", "inactive"].includes(
                        acc.status
                      ) && (
                        <ConfirmStatusButton
                          accountID={acc.accountID}
                          fullName={acc.fullName}
                          currentStatus={acc.status}
                          onSuccess={() =>
                            dispatch(
                              getCompany({
                                page,
                                limit: 10,
                                search,
                                status: status === "all" ? "" : status,
                              })
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {companyAccounts?.data.map((acc) => {
          const detail = acc.detail as CompanyDetail;
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
                      <DialogTitle>Chi tiết công ty</DialogTitle>
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
                        <strong>Địa chỉ:</strong> {detail.address}
                      </p>
                      <p>
                        <strong>Mã số thuế:</strong> {detail.taxCode}
                      </p>
                      <p>
                        <strong>Người đại diện:</strong> {detail.legalRep}
                      </p>
                      <p>
                        <strong>Ngân hàng:</strong> {detail.bankName}
                      </p>
                      <p>
                        <strong>Số tài khoản:</strong> {detail.bankAccount}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
                {["active", "pending", "inactive"].includes(acc.status) && (
                  <ConfirmStatusButton
                    accountID={acc.accountID}
                    fullName={acc.fullName}
                    currentStatus={acc.status}
                    onSuccess={() =>
                      dispatch(
                        getCompany({
                          page,
                          limit: 10,
                          search,
                          status: status === "all" ? "" : status,
                        })
                      )
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {companyAccounts?.total > 10 && (
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

export default isAuth(CompanyManagement, ["Admin"]);
