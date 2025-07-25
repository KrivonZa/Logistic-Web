import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useAccount = () => {
  const {
    loading,
    info,
    driverInfo,
    customerAccounts,
    companyAccounts,
    driverAccounts,
  } = useSelector((state: RootState) => state.manageAccount);
  return {
    loading,
    info,
    driverInfo,
    customerAccounts,
    companyAccounts,
    driverAccounts,
  };
};
