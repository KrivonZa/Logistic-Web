"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/admin/header";
import { ReactNode, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const mediaQuery = window.matchMedia("(min-width: 640px)");
    const handleChange = () => {
      setIsSidebarOpen(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {isSidebarOpen && role && (
          <Sidebar
            key="sidebar"
            toggleSidebar={toggleSidebar}
            role={role as any}
          />
        )}
      </AnimatePresence>

      <div
        className={clsx(
          "transition-all duration-300",
          isSidebarOpen ? "sm:ml-64 ml-0" : "ml-0"
        )}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="p-6 pt-20">{children}</main>
      </div>
    </div>
  );
}
