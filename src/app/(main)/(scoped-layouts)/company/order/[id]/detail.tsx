"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useAppDispatch } from "@/stores";
import { useOrder } from "@/hooks/useOrder";
import { companyOrder } from "@/stores/orderManager/thunk";

const OrderDetail = () => {
  const dispatch = useAppDispatch();
  //   const { driverInfo } = useAccount();

  //   useEffect(() => {
  //     dispatch(driverCompanyAcc({ page: 1, limit: 10 }));
  //   }, []);

  //   console.log(driverInfo);

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex sm:items-center justify-center sm:py-8 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div>OrderDetail</div>
    </motion.div>
  );
};

export default isAuth(OrderDetail, ["Company"]);
