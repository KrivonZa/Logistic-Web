"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Success = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-green-50 via-white to-white"
    >
      <Image
        src="/logo/blue_logo_small.png"
        alt="FlipShip Logo"
        width={200}
        height={100}
        className="mb-6"
        priority
      />

      <Card className="w-full max-w-lg shadow-2xl border border-green-200 rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="bg-green-100 p-4 rounded-full shadow-md">
            <CheckCircle size={64} className="text-green-500" />
          </div>

          <CardTitle className="text-3xl font-bold text-green-600 text-center">
            Thanh toán thành công
          </CardTitle>
          <Separator className="w-2/3 bg-green-200" />
        </CardHeader>

        <CardContent className="px-8 pb-8 text-center">
          <p className="text-gray-700 text-base leading-relaxed">
            Cảm ơn bạn đã thanh toán! Giao dịch của bạn đã được xử lý thành
            công.
            <br />
            Bạn sẽ sớm nhận được thông tin xác nhận đơn hàng.
          </p>

          <div className="mt-10 text-xs text-gray-400">© 2025 – Flipship</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Success;
