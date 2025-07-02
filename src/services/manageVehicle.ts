import api from "@/hooks/axiosInstance";

export const manageVehicle = {
  getVehicle: (params: { page: number; limit: number }) =>
    api.get(`/vehicle`, { params }),
  createVehicle: (formData: FormData) =>
    api.post(`/vehicle`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
