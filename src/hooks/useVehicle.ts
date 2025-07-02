import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useVehicle = () => {
  const { loading, vehicles } = useSelector(
    (state: RootState) => state.manageVehicle
  );

  return {
    loading,
    vehicles: vehicles?.data || [],
    total: vehicles?.total || 0,
  };
};
