import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Báo cáo",
  description: "Trang Dashboard cho Admin",
};

import Dashboard from "./dashboard";

export default function Page() {
  return <Dashboard />;
}
