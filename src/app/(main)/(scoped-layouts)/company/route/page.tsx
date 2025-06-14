import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý tuyến đường",
  description: "Quản lý tuyến đường",
};

import RouteManagement from "./routeManagement";

export default function Page() {
  return <RouteManagement />;
}
