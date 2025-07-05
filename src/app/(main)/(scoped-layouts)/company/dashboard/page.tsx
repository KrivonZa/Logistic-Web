import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Báo cáo",
  description: "Dashboard for Administrator",
};

import Dashboard from "./dashboard";

export default function Page() {
  return <Dashboard />;
}
