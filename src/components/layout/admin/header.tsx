"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Bell, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scroll down
        setShowHeader(false);
      } else {
        // Scroll up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  //Log out
  const handleLogout = () => {
    sessionStorage.clear();
    router.replace("/login");
  };

  const handleNotification = () => {
    router.push("/notification");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: showHeader ? 0 : -80, opacity: showHeader ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 sm:left-64 right-0 h-16 flex items-center justify-between px-6 border-b shadow-sm bg-white/90 z-10"
    >
      {/* Sidebar toggle */}
      <div className="flex items-center gap-2 text-sm sm:text-xl font-semibold text-gray-800">
        <Menu
          className="h-10 w-10 text-primary hover:bg-blue-400/30 rounded-full p-1 sm:p-2 duration-200 active:scale-90 transition ease-in-out cursor-pointer"
          onClick={toggleSidebar}
        />
        <span>Hệ thống quản lý điện tử</span>
      </div>

      {/* Notification + User */}
      <div className="flex items-center gap-6">
        {/* Notification icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Bell
              className="h-10 w-10 text-primary hover:bg-blue-400/30 rounded-full p-2 duration-200 active:scale-90 transition ease-in-out cursor-pointer hidden sm:block"
              onClick={handleNotification}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Thông báo</p>
          </TooltipContent>
        </Tooltip>

        {/* User dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none hover:bg-blue-400/20 duration-200 px-2 py-1 rounded">
                <Avatar className="h-8 w-8">
                  {/*Avatar */}
                  {/* <AvatarImage src="/avatar.png" alt="@admin" /> */}
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700 hidden sm:inline">
                  Đặng Văn Lâm
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Đặng Văn Lâm</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleProfile}>Thông tin cá nhân</DropdownMenuItem>
            <DropdownMenuItem className="block sm:hidden">
              Thông báo
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;
