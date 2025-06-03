import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Pasword",
  description: "Forgot Password Screen to Reset Password",
};

import ForgotPassword from "./forgotPassword";

export default function Page() {
  return <ForgotPassword />;
}
