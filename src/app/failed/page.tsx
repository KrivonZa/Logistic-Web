import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán thất bại",
  description: "Thanh toán thất bại",
};

import Failed from "./failed";

export default function Page() {
  return <Failed />;
}
