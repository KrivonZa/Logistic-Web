import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Users",
  description: "Users Management page for Administrator",
};

import Users from "./users";

export default function Page() {
  return <Users />;
}
