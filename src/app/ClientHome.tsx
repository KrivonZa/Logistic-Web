"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClientHome() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    const timeout = setTimeout(() => {
      if (!token) {
        router.replace("/login");
        return;
      }

      switch (role) {
        case "Admin":
          router.replace("/admin/dashboard");
          break;
        case "Company":
          router.replace("/company/dashboard");
          break;
        default:
          toast.error("Tài khoản không có quyền truy cập", {
            description: "Vui lòng đăng nhập bằng tài khoản hợp lệ.",
            duration: 3000,
          });
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
          router.replace("/login");
          break;
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/40 to-primary/70 text-gray-800">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin" />
        <h1 className="text-2xl font-semibold animate-pulse text-white">
          Đang tiến vào...
        </h1>
      </div>
    </div>
  );
}
