import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xem đơn đã gửi",
  description: "Xem các đơn đã gửi",
};

import ApplicationManage from "./application-manage";

export default function Page() {
  return <ApplicationManage />;
}
