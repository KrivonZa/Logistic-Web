import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Nhân viên Nền tảng",
  description: "Quản lý danh sách Nhân viên Nền tảng",
};

import Staffs from "./staff";

export default function Page() {
  return <Staffs />;
}
