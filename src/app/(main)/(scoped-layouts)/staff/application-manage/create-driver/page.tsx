import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đơn tài xế",
  description: "Xét duyệt các tài xế của doanh nghiệp",
};

import CreateDriver from "./create-driver";

export default function Page() {
  return <CreateDriver />;
}
