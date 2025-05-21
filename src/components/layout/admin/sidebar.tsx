"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, Users, Settings, X } from "lucide-react";
import { usePathname } from "next/navigation";

const sidebarVariants = {
  hidden: { x: -260, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -260, opacity: 0 },
};

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", icon: <Home className="h-5 w-5" />, label: "Báo cáo" },
    { href: "/admin/users", icon: <Users className="h-5 w-5" />, label: "Users" },
    { href: "/admin/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full sm:w-64 h-screen bg-primary border-r p-4 space-y-6 shadow-sm absolute top-0 left-0 z-40"
    >
      <div className="flex items-center justify-between">
        <Image
          src="/logo/white_logo_small.png"
          alt="Flipship White Logo"
          width={150}
          height={150}
          className=""
        />
        <X
          className="h-10 w-10 text-white hover:bg-blue-400/30 rounded-full p-2 duration-200 active:scale-90 transition ease-in-out cursor-pointer block sm:hidden"
          onClick={toggleSidebar}
        />
      </div>
      <nav className="space-y-2">
        {links.map(({ href, icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white transition duration-200 ${
                isActive ? "bg-secondary" : "hover:bg-secondary/80"
              }`}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
