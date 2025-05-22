import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Nhân viên Công ty vận chuyển",
  description: "Quản lý danh sách Nhân viên Công ty đã đăng ký",
};

import Coordinators from "./coordinator";

export default function Page() {
  return <Coordinators />;
}
