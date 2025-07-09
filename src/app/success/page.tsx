import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán thành công",
  description: "Thanh toán thành công",
};

import Success from "./success";

export default function Page() {
  return <Success />;
}
