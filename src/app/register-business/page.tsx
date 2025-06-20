import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký doanh nghiệp",
  description: "Đăng ký doanh nghiệp",
};

import RegisterBusiness from "./register-business";

export default function Page() {
  return <RegisterBusiness />;
}
