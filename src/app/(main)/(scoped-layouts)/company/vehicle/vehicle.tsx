"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import isAuth from "@/components/isAuth";
import { useAccount } from "@/hooks/useAccount";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/stores";
import { getVehicle } from "@/stores/vehicleManager/thunk";
import { useVehicle } from "@/hooks/useVehicle";
import VehicleAction from "@/components/layout/vehicleAction";
import VehicleUpdateAction from "@/components/layout/vehicleUpdateAction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

const Vehicle = () => {
  const { info } = useAccount();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const dispatch = useAppDispatch();
  const { loading, vehicles, total } = useVehicle();

  useEffect(() => {
    dispatch(
      getVehicle({
        page,
        limit: ITEMS_PER_PAGE,
        status: status === "all" ? "" : status,
      })
    );
  }, [dispatch, page, status]);

  const totalPage = Math.ceil(total / ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPage) setPage(page + 1);
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col px-4 py-10 sm:py-12 sm:px-6 lg:px-8 min-h-screen"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách phương tiện</h2>
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
            </SelectContent>
          </Select>
          <VehicleAction />
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Tên công ty</TableHead>
              <TableHead>Biển số xe</TableHead>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tải trọng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v, index) => (
              <TableRow key={v.vehicleID}>
                <TableCell>{(page - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                <TableCell>{v.companyName}</TableCell>
                <TableCell>{v.vehicleNumber}</TableCell>
                <TableCell>
                  <img
                    src={v.vehicleImage}
                    alt="Vehicle"
                    className="w-20 h-auto rounded-md"
                  />
                </TableCell>
                <TableCell>{v.loadCapacity.toLocaleString()} kg</TableCell>
                <TableCell>
                  <span
                    className={`capitalize ${
                      v.status === "inactive"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {v.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}
                  </span>
                </TableCell>
                <TableCell>
                  <VehicleUpdateAction vehicle={v} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <Button onClick={handlePrev} disabled={page === 1}>
          Trước
        </Button>
        <span className="text-sm pt-2 text-muted-foreground">
          Trang {page}/{totalPage}
        </span>
        <Button onClick={handleNext} disabled={page === totalPage}>
          Tiếp
        </Button>
      </div>
    </motion.div>
  );
};

export default isAuth(Vehicle, ["Company"]);
