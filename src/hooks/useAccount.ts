import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useAccount = () => {
  const { loading, info } = useSelector(
    (state: RootState) => state.manageAccount
  );
  return { loading, info };
};
