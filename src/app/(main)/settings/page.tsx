import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cài đặt",
  description: "Quản lý cài đặt",
};

import Settings from "./settings";

export default function Page() {
  return <Settings />;
}
