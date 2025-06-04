import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Business",
  description: "Register Business Screen for Companies",
};

import RegisterBusiness from "./register-business";

export default function Page() {
  return <RegisterBusiness />;
}
