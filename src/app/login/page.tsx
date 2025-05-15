import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Next-level login experience for Business Management",
};

import Login from "./login";

export default function Page() {
  return <Login />;
}
