import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Tài xế Công ty vận chuyển",
  description: "Quản lý danh sách Tài xế Công ty đã đăng ký",
};

import Drivers from "./driver";

export default function Page() {
  return <Drivers />;
}
