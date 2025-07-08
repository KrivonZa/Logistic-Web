"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Users, LogOut, X, ChevronLeft, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const sidebarVariants = {
  hidden: { x: -260, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -260, opacity: 0 },
};

type SidebarLink = {
  href: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[]; // optional: if present, only these roles can see it
};

const allSidebarLinks: SidebarLink[] = [
  {
    href: "/profile",
    icon: <Home className="h-5 w-5" />,
    label: "Thông tin người dùng",
  },
  {
    href: "/changePassword",
    icon: <Users className="h-5 w-5" />,
    label: "Thay đổi mật khẩu",
  },
  {
    href: "/wallet",
    icon: <Wallet className="h-5 w-5" />,
    label: "Ví người dùng",
    roles: ["Company"], // Chỉ hiện nếu role là Company
  },
];

const Sidebar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    }
  }, []);

  const filteredLinks = allSidebarLinks.filter(
    (link) => !link.roles || (role && link.roles.includes(role))
  );

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const handleBack = () => {
    if (!role) return;
    switch (role) {
      case "Admin":
        router.push("/admin/dashboard");
        break;
      case "Company":
        router.push("/company/dashboard");
        break;
      default:
        router.push("/");
        break;
    }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full sm:w-64 min-h-screen bg-primary border-r p-4 space-y-6 shadow-sm fixed top-0 left-0 z-40 flex flex-col"
    >
      <div className="flex items-center sm:justify-start justify-between">
        <ChevronLeft
          onClick={handleBack}
          className="h-10 w-10 text-white hover:bg-blue-400/30 rounded-full p-2 duration-200 active:scale-90 transition ease-in-out cursor-pointer"
        />
        <Image
          src="/logo/white_logo_small.png"
          alt="Flipship White Logo"
          width={150}
          height={150}
        />
        <X
          className="h-10 w-10 text-white hover:bg-blue-400/30 rounded-full p-2 duration-200 active:scale-90 transition ease-in-out cursor-pointer block sm:hidden"
          onClick={toggleSidebar}
        />
      </div>

      <nav className="space-y-2 flex-grow">
        {filteredLinks.map((link) => {
          const isActive =
            (link.href === "/profile" &&
              ["/profile", "/edit-profile"].includes(pathname)) ||
            pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white transition duration-200 ${
                isActive ? "bg-secondary" : "hover:bg-secondary/80"
              }`}
            >
              {link.icon}
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-3 py-2 rounded-lg text-white hover:bg-red-600 transition duration-200"
      >
        <LogOut className="h-5 w-5" />
        <span className="text-sm font-medium">Đăng xuất</span>
      </button>
    </motion.aside>
  );
};

export default Sidebar;
