import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useRoute = () => {
  const { loading } = useSelector((state: RootState) => state.manageRoute);
  return { loading };
};
