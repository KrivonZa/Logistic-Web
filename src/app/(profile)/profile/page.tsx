import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description: "Thông tin cá nhân của người dùng",
};

import Profile from "./profile";

export default function Page() {
  return <Profile />;
}
