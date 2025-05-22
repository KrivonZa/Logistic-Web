"use client";

import Sidebar from "@/components/layout/admin/sidebar";
import Header from "@/components/layout/admin/header";
import { ReactNode, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //Nhận diện kích cỡ màn hình để điều chỉnh sidebar
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const handleChange = () => {
      setIsSidebarOpen(mediaQuery.matches);
    };

    handleChange(); // Gọi lúc đầu khi component mount
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar key="sidebar" toggleSidebar={toggleSidebar} />
        )}
      </AnimatePresence>

      {/* Khu vực còn lại */}
      <div
        className={clsx(
          "transition-all duration-300",
          isSidebarOpen ? "sm:ml-64 ml-0" : "ml-0"
        )}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
