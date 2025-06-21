import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useRoute = () => {
  const { loading, routes } = useSelector(
    (state: RootState) => state.manageRoute
  );
  return { loading, routes };
};
