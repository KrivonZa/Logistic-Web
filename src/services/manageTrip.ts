import api from "@/hooks/axiosInstance";
import { CreateTrip } from "@/types/trip";

export const manageTrip = {
  createTrip: (req: CreateTrip) => api.post(`/trip`, req),
};
