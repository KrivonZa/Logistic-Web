import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Công ty vận chuyển",
  description: "Quản lý danh sách Công ty đã đăng ký",
};

import Companies from "./company";

export default function Page() {
  return <Companies />;
}
