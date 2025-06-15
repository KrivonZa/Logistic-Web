import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thay đổi mật khẩu",
  description: "Thay đổi mật khẩu",
};

import ChangePassword from "./changePassword";

export default function Page() {
  return <ChangePassword />;
}
