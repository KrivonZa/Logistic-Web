import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useAuth = () => {
  const { loading } = useSelector((state: RootState) => state.manageAuthen);
  return { loading };
};
