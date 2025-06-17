import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa thông tin cá nhân",
  description: "Chỉnh sửa thông tin cá nhân của người dùng",
};

import EditProfile from "./edit-profile";

export default function Page() {
  return <EditProfile />;
}
