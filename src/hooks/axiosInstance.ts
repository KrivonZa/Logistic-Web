import axios, { AxiosError, AxiosInstance } from "axios";

interface AuthContext {
  setUser: (user: any) => void; // Có thể thay `any` bằng kiểu user cụ thể nếu bạn có
  router: {
    push: (path: string) => void;
  };
}

let authContext: AuthContext | null = null;

export const setAuthContext = (context: AuthContext) => {
  authContext = context;
};

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("[Auth Debug] Token expired, logging out...");

      if (authContext) {
        authContext.setUser(null);
        authContext.router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
