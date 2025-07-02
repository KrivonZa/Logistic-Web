import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý giao dịch",
  description: "Quản lý giao dịch",
};

import Transaction from "./transaction";

export default function Page() {
  return <Transaction />;
}
