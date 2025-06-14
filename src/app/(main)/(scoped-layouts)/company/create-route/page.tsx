import type { Metadata } from "next";
import isAuth from "@/components/isAuth";

export const metadata: Metadata = {
  title: "Tạo tuyến đường",
  description: "Tạo tuyến đường và các địa điểm",
};

import CreateRoute from "./createRoute";

export default function Page() {
  return <CreateRoute />;
}
