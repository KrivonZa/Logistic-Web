"use client";

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
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-16 w-full flex items-center justify-between px-6 border-b shadow-sm bg-white"
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
            <Bell className="h-10 w-10 text-primary hover:bg-blue-400/30 rounded-full p-2 duration-200 active:scale-90 transition ease-in-out cursor-pointer hidden sm:block" />
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
            <DropdownMenuItem>Thông tin cá nhân</DropdownMenuItem>
            <DropdownMenuItem className="block sm:hidden">
              Thông báo
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;
