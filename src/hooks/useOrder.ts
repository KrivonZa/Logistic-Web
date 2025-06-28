import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useOrder = () => {
  const { loading, orders } = useSelector(
    (state: RootState) => state.manageOrder
  );
  return { loading, orders };
};
