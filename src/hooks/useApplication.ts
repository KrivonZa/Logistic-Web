import { useSelector } from "react-redux";
import { RootState } from "@/stores";

export const useApplication = () => {
  const { loading, applications } = useSelector(
    (state: RootState) => state.manageApplication
  );
  return { loading, applications };
};
