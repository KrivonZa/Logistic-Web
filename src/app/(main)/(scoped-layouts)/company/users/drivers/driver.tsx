"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/stores";
import { useAccount } from "@/hooks/useAccount";
import { useRouter } from "next/navigation";
import { driverCompanyAcc } from "@/stores/accountManager/thunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Driver } from "@/types/account";
import isAuth from "@/components/isAuth";
import ConfirmStatusActions from "@/components/layout/accountAction";
import { Plus } from "lucide-react";
import { AccountStatus } from "@/types/account";

const LIMIT = 10;

const formatDateVN = (value?: string | number | Date): string => {
  if (!value) return "N/A";
  const date = new Date(value);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Drivers = () => {
  const dispatch = useAppDispatch();
  const { driverInfo } = useAccount();
  const [page, setPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const router = useRouter();

  useEffect(() => {
    dispatch(driverCompanyAcc({ page, limit: LIMIT }));
  }, [dispatch, page]);

  const drivers = driverInfo?.data || [];
  const total = driverInfo?.page || 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh sách tài xế</h2>
        <Button onClick={() => router.push("/company/create-driver")}>
          <Plus /> Tạo tài xế mới
        </Button>
      </div>

      <div className="w-full overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>CMND</TableHead>
              <TableHead>GPLX</TableHead>
              <TableHead>Hạn GPLX</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.driverID}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={driver.account.avatar} />
                    <AvatarFallback>
                      {driver.account.fullName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{driver.account.fullName}</span>
                </TableCell>
                <TableCell>{driver.account.email}</TableCell>
                <TableCell>{driver.phoneNumber}</TableCell>
                <TableCell>{driver.identityNumber}</TableCell>
                <TableCell>
                  {driver.licenseNumber} ({driver.licenseLevel})
                </TableCell>
                <TableCell>{formatDateVN(driver.licenseExpiry)}</TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDriver(driver)}
                      >
                        Chi tiết
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Thông tin tài xế</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Họ tên:</strong>{" "}
                          {selectedDriver?.account.fullName}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {selectedDriver?.account.email}
                        </p>
                        <p>
                          <strong>SĐT:</strong> {selectedDriver?.phoneNumber}
                        </p>
                        <p>
                          <strong>Số CMND:</strong>{" "}
                          {selectedDriver?.identityNumber}
                        </p>
                        <p>
                          <strong>GPLX:</strong> {selectedDriver?.licenseNumber}{" "}
                          ({selectedDriver?.licenseLevel})
                        </p>
                        <p>
                          <strong>Hạn GPLX:</strong>{" "}
                          {formatDateVN(selectedDriver?.licenseExpiry)}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <ConfirmStatusActions
                    accountID={driver.account.accountID}
                    fullName={driver.account.fullName}
                    currentStatus={driver.account.status as AccountStatus}
                    onSuccess={() =>
                      dispatch(driverCompanyAcc({ page, limit: LIMIT }))
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default isAuth(Drivers, ["Company"]);
