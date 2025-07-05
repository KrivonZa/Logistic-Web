import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tạo tài khoản tài xế",
  description: "Tạo tài khoản cho tài xế",
};

import CreateDriver from "./createDriver";

export default function Page() {
  return <CreateDriver />;
}
