"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useAppDispatch } from "@/stores";
import { useOrder } from "@/hooks/useOrder";
import { companyOrderDetail } from "@/stores/orderManager/thunk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Package,
  MapPin,
  Calendar,
  ImageOff,
  ArrowLeft,
} from "lucide-react";
import OrderStatusActions from "@/components/layout/orderAction";

const statusMapping: Record<string, string> = {
  pending: "Chờ xác nhận",
  unpaid: "Chưa thanh toán",
  in_progress: "Đang giao",
  delivered: "Đã giao",
  canceled: "Đã hủy",
  reject: "Đã từ chối",
};

const OrderDetail = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orderDetail, loading } = useOrder();
  const params = useParams();
  const orderID = params?.id as string;

  useEffect(() => {
    if (orderID) {
      dispatch(companyOrderDetail(orderID));
    }
  }, [orderID]);

  if (loading || !orderDetail) {
    return <div className="text-center py-10 text-gray-500">Đang tải...</div>;
  }

  const {
    customer,
    route,
    package: pkg,
    pickUpPoint,
    dropDownPoint,
    price,
    pickUpImage,
    dropDownImage,
    payloadNote,
    status,
    createdAt,
  } = orderDetail;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => router.push("/company/order")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Trở về
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">
          Chi tiết đơn hàng
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mã đơn hàng: {orderID}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-semibold">{customer.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {customer.phoneNumber} – {customer.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <p>{route.routeName}</p>
          </div>

          <div className="flex items-center gap-4">
            <Package className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-4 items-start">
              <img
                src={pkg.packageImage}
                alt="Package"
                className="w-28 h-28 rounded object-cover border"
              />
              <div>
                <p className="font-semibold">{pkg.packageName}</p>
                <p>Khối lượng: {pkg.packageWeight} kg</p>
                <p className="text-sm text-muted-foreground">
                  Ghi chú: {pkg.note}
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Điểm lấy hàng:</p>
              <p>{pickUpPoint.location}</p>
              {pickUpImage ? (
                <img
                  src={pickUpImage}
                  alt="Pickup"
                  className="mt-2 rounded-md border object-cover w-full h-32"
                />
              ) : (
                <div className="mt-2 flex items-center justify-center border rounded-md h-32 text-muted-foreground bg-muted">
                  <ImageOff className="w-5 h-5 mr-2" />
                  Chưa có hình ảnh
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold mb-1">Điểm trả hàng:</p>
              <p>{dropDownPoint.location}</p>
              {dropDownImage ? (
                <img
                  src={dropDownImage}
                  alt="Dropoff"
                  className="mt-2 rounded-md border object-cover w-full h-32"
                />
              ) : (
                <div className="mt-2 flex items-center justify-center border rounded-md h-32 text-muted-foreground bg-muted">
                  <ImageOff className="w-5 h-5 mr-2" />
                  Chưa có hình ảnh
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="font-semibold">Ghi chú vận chuyển:</p>
            <p>{payloadNote}</p>
          </div>

          <div>
            <p className="font-semibold">Giá:</p>
            <p>{price.toLocaleString("vi-VN")} ₫</p>
          </div>

          <div className="flex gap-4 items-center">
            <p className="font-semibold">Trạng thái:</p>
            <Badge variant="outline" className="capitalize">
              {statusMapping[status] || status}
            </Badge>
          </div>

          <div className="flex gap-4 items-center">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <p>{new Date(createdAt).toLocaleString("vi-VN")}</p>
          </div>

          <OrderStatusActions status={status} orderID={orderID} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default isAuth(OrderDetail, ["Company"]);
