import api from "@/hooks/axiosInstance";

export const manageVehicle = {
  getVehicle: (params: { page?: number; limit?: number; status?: string }) =>
    api.get(`/vehicle`, { params }),
  createVehicle: (formData: FormData) =>
    api.post(`/vehicle`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateVehicle: (req: string, formData: FormData) =>
    api.patch(`/vehicle/${req}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
