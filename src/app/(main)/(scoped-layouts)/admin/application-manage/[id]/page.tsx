import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết đơn",
  description: "Thông tin chi tiết của đơn",
};

import ApplicationDetail from "./detail";

export default function Page() {
  return <ApplicationDetail />;
}
