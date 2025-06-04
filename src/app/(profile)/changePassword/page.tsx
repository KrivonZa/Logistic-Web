import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Pasword",
  description: "Change Password",
};

import ChangePassword from "./changePassword";

export default function Page() {
  return <ChangePassword />;
}
