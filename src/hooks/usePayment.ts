import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const usePayment = () => {
  const { loading } = useSelector((state: RootState) => state.managePayment);
  return { loading };
};
