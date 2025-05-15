import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Homepage",
  description: "Homepage description",
};

export default function Home() {
  redirect("/login");
}
