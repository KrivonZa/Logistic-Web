"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Failed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-red-50 via-white to-white"
    >
      <Image
        src="/logo/blue_logo_small.png"
        alt="FlipShip Logo"
        width={200}
        height={100}
        className="mb-6"
        priority
      />

      <Card className="w-full max-w-lg shadow-2xl border border-red-200 rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="bg-red-100 p-4 rounded-full shadow-md">
            <XCircle size={64} className="text-red-500" />
          </div>

          <CardTitle className="text-3xl font-bold text-red-600 text-center">
            Thanh toán thất bại
          </CardTitle>
          <Separator className="w-2/3 bg-red-200" />
        </CardHeader>

        <CardContent className="px-8 pb-8 text-center">
          <p className="text-gray-700 text-base leading-relaxed">
            Rất tiếc, giao dịch của bạn chưa được xử lý thành công.
            <br />
            Vui lòng kiểm tra lại phương thức thanh toán hoặc thử lại sau ít
            phút.
          </p>

          <div className="mt-10 text-xs text-gray-400">© 2025 – Flipship</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Failed;
