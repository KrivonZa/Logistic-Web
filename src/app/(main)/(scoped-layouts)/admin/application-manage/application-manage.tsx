"use client";

import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/stores";
import { useApplication } from "@/hooks/useApplication";
import { viewCompanyApplication } from "@/stores/applicationManager/thunk";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STATUS_LIST = ["all", "PENDING", "APPROVED", "REJECTED"];

const statusMapping: Record<string, string> = {
  all: "Tất cả",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Đã từ chối",
};

const LIMIT = 10;

const ApplicationManage = () => {
  const dispatch = useAppDispatch();
  const { loading, applications } = useApplication();
  const router = useRouter();

  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const appList = applications?.data || [];
  const total = Number(applications?.page || 0);
  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    const params: any = { page, limit: LIMIT };
    if (status !== "all") params.status = status;
    dispatch(viewCompanyApplication(params));
  }, [dispatch, status, page]);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Danh sách đơn yêu cầu</h2>
        <div className="w-[200px]">
          <Select
            value={status}
            onValueChange={(val) => {
              setPage(1);
              setStatus(val);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusMapping[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : appList.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          Không có đơn nào thuộc trạng thái "{statusMapping[status]}"
        </div>
      ) : (
        <div className="overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người gửi</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appList.map((app) => (
                <TableRow key={app.applicationID}>
                  <TableCell>{app.applicationID.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{app.sender.fullName}</span>
                      <span className="text-sm text-muted-foreground">
                        {app.sender.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{app.senderNote || "—"}</TableCell>
                  <TableCell>
                    {app.senderFileUrl ? (
                      <a
                        href={app.senderFileUrl}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem file
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-yellow-600 capitalize">
                    {statusMapping[app.status]}
                  </TableCell>
                  <TableCell>
                    {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant={"outline"}
                      onClick={() =>
                        router.push(
                          `/company/application-manage/${app.applicationID}`
                        )
                      }
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
    </motion.div>
  );
};

export default isAuth(ApplicationManage, ["Admin"]);
