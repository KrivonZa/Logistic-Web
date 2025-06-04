import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile detail of user",
};

import Profile from "./profile";

export default function Page() {
  return <Profile />;
}
