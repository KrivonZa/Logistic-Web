import type { Metadata } from "next";
import isAuth from "@/components/isAuth";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng",
  description: "Thông tin chi tiết của đơn hàng",
};

import OrderDetail from "./detail";

export default function Page() {
  return <OrderDetail />;
}
