"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/stores";
import { useOrder } from "@/hooks/useOrder";
import { companyOrder } from "@/stores/orderManager/thunk";

import isAuth from "@/components/isAuth";
import OrderStatusActions from "@/components/layout/orderAction";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIMIT = 10;

const STATUS_LIST = [
  "all",
  "pending",
  "unpaid",
  "in_progress",
  "delivered",
  "canceled",
  "reject",
];

const statusMapping: Record<string, string> = {
  all: "Tất cả",
  pending: "Chờ xác nhận",
  unpaid: "Chưa thanh toán",
  in_progress: "Đang giao",
  delivered: "Đã giao",
  canceled: "Đã hủy",
  reject: "Đã từ chối",
};

const Order = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, orders } = useOrder();
  console.log(orders);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const total = orders?.page || 0;
  const totalPages = Math.ceil(total / LIMIT);
  const orderList = orders?.data || [];

  useEffect(() => {
    const params: any = { page, limit: LIMIT };
    if (status !== "all") params.status = status;
    dispatch(companyOrder(params));
  }, [dispatch, page, status]);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Danh sách đơn hàng</h2>
        <div className="w-[200px]">
          <Select value={status} onValueChange={(val) => setStatus(val)}>
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
      ) : orderList.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          Không có đơn hàng nào thuộc trạng thái "{statusMapping[status]}"
        </div>
      ) : (
        <div className="overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList.map((order) => (
                <TableRow key={order.orderID}>
                  <TableCell>{order.orderID.slice(0, 8)}...</TableCell>
                  <TableCell>{order.payloadNote || "—"}</TableCell>
                  <TableCell>{order.price.toLocaleString()}₫</TableCell>
                  <TableCell>
                    <span className="capitalize font-medium text-yellow-600">
                      {statusMapping[order.status] || order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant={"outline"}
                        onClick={() =>
                          router.push(`/company/order/${order.orderID}`)
                        }
                      >
                        Chi tiết
                      </Button>
                      <OrderStatusActions
                        status={order.status}
                        orderID={order.orderID}
                        onStatusUpdated={() => {
                          const params: any = { page, limit: LIMIT };
                          if (status !== "all") params.status = status;
                          dispatch(companyOrder(params));
                        }}
                      />
                    </div>
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

export default isAuth(Order, ["Company"]);
