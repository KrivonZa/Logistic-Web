import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý phương tiện",
  description: "Quản lý phương tiện",
};

import Vehicle from "./vehicle";

export default function Page() {
  return <Vehicle />;
}
