"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useAppDispatch } from "@/stores";
import { useOrder } from "@/hooks/useOrder";
import { companyOrder } from "@/stores/orderManager/thunk";
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
import { useRouter } from "next/navigation";

const LIMIT = 10;

const Order = () => {
  const dispatch = useAppDispatch();
  const { loading, orders } = useOrder();
  const router = useRouter();

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(companyOrder({ page, limit: LIMIT }));
  }, [dispatch, page]);

  const orderList = orders?.data || [];
  const total = orders?.page || 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold">Danh sách đơn hàng</h2>

      <div className="w-full overflow-auto border rounded-md">
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
                <TableCell>{order.payloadNote}</TableCell>
                <TableCell>{order.price.toLocaleString()}₫</TableCell>
                <TableCell>
                  <span className="capitalize font-medium text-yellow-600">
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/company/order/${order.orderID}`)
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
