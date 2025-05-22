import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý khách hàng",
  description: "Quản lý danh sách Khách hàng đã đăng ký",
};

import Customers from "./customer";

export default function Page() {
  return <Customers />;
}
