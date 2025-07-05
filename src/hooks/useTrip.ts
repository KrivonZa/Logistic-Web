import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useTrip = () => {
  const { loading } = useSelector((state: RootState) => state.manageTrip);

  return {
    loading,
  };
};
