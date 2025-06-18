import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn nhân viên điều phối",
  description: "Xét duyệt các nhân viên điều phối của doanh nghiệp",
};

import CreateCoordinator from "./create-coordinator";

export default function Page() {
  return <CreateCoordinator />;
}
