import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông báo",
  description: "Danh sách thông báo",
};

import Notification from "./notification";

export default function Page() {
  return <Notification />;
}
