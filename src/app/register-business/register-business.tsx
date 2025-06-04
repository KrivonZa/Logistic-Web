"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const RegisterBusiness = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen flex sm:items-center justify-center sm:py-8 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-primary to-secondary"
    >
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-secondary transition-colors duration-200"
        onClick={() => router.push("/login")}
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại đăng nhập
      </Button>

      {/* Hình khối mờ màu trắng */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-5%] w-64 h-64 bg-white/15 rotate-45 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/20 rounded-xl rotate-12 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Nội dung chính */}
      <div className="relative z-10 text-white text-2xl font-semibold select-none">
        Register Business
      </div>
    </motion.div>
  );
};

export default RegisterBusiness;
