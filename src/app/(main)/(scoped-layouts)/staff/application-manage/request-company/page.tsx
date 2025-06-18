import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn chấp thuận doanh nghiệp",
  description: "Xét duyệt các doanh nghiệp",
};

import RequestCompany from "./request-company";

export default function Page() {
  return <RequestCompany />;
}
