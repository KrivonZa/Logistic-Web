"use client";

import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";

const ApplicationManage = () => {
  //constant for Library

  //constant for State

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex sm:items-center justify-center sm:py-8 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div>Application Manage</div>
    </motion.div>
  );
};

export default isAuth(ApplicationManage, ["Coordinator"]);
