import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register space for company",
};

import Register from "./register";

export default function Page() {
  return <Register />;
}
