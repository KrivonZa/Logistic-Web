import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useDashboard = () => {
  const { loading, company, admin } = useSelector(
    (state: RootState) => state.manageDashboard
  );
  return {
    loading,
    company,
    admin,
  };
};
