import axios, { AxiosError, AxiosInstance } from "axios";

interface AuthContext {
  setUser: (user: any) => void;
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

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem("authToken") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
