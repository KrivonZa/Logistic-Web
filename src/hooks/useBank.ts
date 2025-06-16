import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useBank = () => {
  const { loading, bank } = useSelector((state: RootState) => state.manageBank);
  return { loading, bank };
};
