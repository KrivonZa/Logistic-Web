"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/stores";
import { profile } from "@/stores/accountManager/thunk";
import { useAccount } from "@/hooks/useAccount";

export default function ClientHome() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAccount();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchDataAndRedirect = async () => {
      try {
        await dispatch(profile()).unwrap();

        const role = localStorage.getItem("role");

        if (!role) {
          toast.error("Thông tin quyền truy cập không đầy đủ", {
            description: "Vui lòng đăng nhập lại để cập nhật quyền.",
            duration: 3000,
          });
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
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
      } catch (err) {
        console.error("Failed to fetch profile or invalid token:", err);
        toast.error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ", {
          description: "Vui lòng đăng nhập lại.",
          duration: 3000,
        });
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        router.replace("/login");
      } finally {
        setInitialLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchDataAndRedirect();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [router, dispatch]);

  const isLoading = initialLoading || loading;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/30"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          className="w-20 h-20 text-white"
        >
          <Loader2 className="w-full h-full animate-spin-slow" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-extrabold tracking-tight text-shadow-lg"
        >
          {isLoading ? "Đang vào..." : "Chuyển hướng..."}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="text-lg text-white/80"
        >
          {isLoading
            ? "Đang xác thực thông tin tài khoản."
            : "Bạn sắp được chuyển hướng."}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: "-100vh" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full mix-blend-overlay opacity-50"
        style={{ x: "10%", y: "15%" }}
      />
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
        className="absolute top-1/4 right-0 w-40 h-40 bg-purple-300/15 rounded-full mix-blend-overlay opacity-50"
        style={{ x: "-20%", y: "40%" }}
      />
    </div>
  );
}
