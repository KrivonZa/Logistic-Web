import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ví cá nhân",
  description: "Ví của người dùng",
};

import Wallet from "./wallet";

export default function Page() {
  return <Wallet />;
}
