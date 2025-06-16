import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useFile = () => {
  const { loading } = useSelector((state: RootState) => state.manageFile);
  return { loading };
};
