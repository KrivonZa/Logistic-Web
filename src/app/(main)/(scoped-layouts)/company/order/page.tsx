import type { Metadata } from "next";
import isAuth from "@/components/isAuth";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng",
  description: "Quản lý các đơn hàng",
};

import Order from "./order";

export default function Page() {
  return <Order />;
}
