"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactNode } from "react";
import {
  Home,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  MapPinned,
  Bell,
  ClipboardList,
  Package,
} from "lucide-react";
import { usePathname } from "next/navigation";

const sidebarVariants = {
  hidden: { x: -260, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -260, opacity: 0 },
};

const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

type SidebarLink = {
  href?: string;
  icon: ReactNode;
  label: string;
  children?: { href: string; label: string }[];
};

const sidebarLinks: Record<string, SidebarLink[]> = {
  Admin: [
    {
      href: "/admin/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Báo cáo",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Người dùng",
      children: [
        { href: "/admin/users/customers", label: "Khách hàng" },
        { href: "/admin/users/companies", label: "Công ty" },
        { href: "/admin/users/drivers", label: "Tài xế" },
      ],
    },
  ],
  Company: [
    {
      href: "/company/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Trang chủ",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Quản lý",
      children: [{ href: "/company/users/drivers", label: "Tài xế" }],
    },
    {
      href: "/company/route",
      icon: <MapPinned className="h-5 w-5" />,
      label: "Quản lý tuyến đường",
    },
    // {
    //   href: "/company/application-manage",
    //   icon: <ClipboardList className="h-5 w-5" />,
    //   label: "Đơn đã gửi",
    // },
    {
      href: "/company/order",
      icon: <Package className="h-5 w-5" />,
      label: "Quản lý đơn hàng",
    },
  ],
};

const commonLinks: SidebarLink[] = [
  {
    href: "/notification",
    icon: <Bell className="h-5 w-5" />,
    label: "Thông báo",
  },
  {
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    label: "Cài đặt",
  },
];

const Sidebar = ({
  toggleSidebar,
  role,
}: {
  toggleSidebar: () => void;
  role: keyof typeof sidebarLinks;
}) => {
  const pathname = usePathname();
  const links = [...(sidebarLinks[role] || []), ...commonLinks];

  const [openDropdown, setOpenDropdown] = useState<string | null>(() => {
    const match = links.find((link) =>
      link.children?.some((child) => pathname.startsWith(child.href))
    );
    return match?.label || null;
  });

  const handleToggle = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full sm:w-64 min-h-screen bg-primary border-r p-4 space-y-6 shadow-sm fixed top-0 left-0 z-40"
    >
      <div className="flex items-center justify-between">
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

      <nav className="space-y-2">
        {links.map((link) => {
          const isDropdown = !!link.children;

          if (!isDropdown && link.href) {
            const isActive = pathname === link.href;
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
          }

          const isOpen = openDropdown === link.label;
          const isChildActive = link.children?.some((child) =>
            pathname.startsWith(child.href)
          );

          return (
            <div key={link.label}>
              <button
                onClick={() => handleToggle(link.label)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-white transition duration-200 ${
                  isChildActive ? "bg-secondary" : "hover:bg-secondary/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span className="text-sm font-medium">{link.label}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="mt-2 ml-6 flex flex-col space-y-2 overflow-hidden"
                  >
                    {link.children?.map((child) => {
                      const isActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block text-sm px-3 py-2 rounded-lg text-white transition duration-200 hover:bg-secondary/60 ${
                            isActive ? "bg-secondary" : ""
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
