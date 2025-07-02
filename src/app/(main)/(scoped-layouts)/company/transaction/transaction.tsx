"use client";

import { motion } from "framer-motion";

import isAuth from "@/components/isAuth";
import { useAccount } from "@/hooks/useAccount";

const Transaction = () => {
  const { info } = useAccount();
  console.log(info?.balance);
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center px-4 py-10 sm:py-12 sm:px-6 lg:px-8 min-h-screen"
    >
      <h1 className="text-2xl sm:text-3xl text-primary font-bold mb-6 text-center">
        Giao dịch
      </h1>
    </motion.div>
  );
};

export default isAuth(Transaction, ["Company"]);
