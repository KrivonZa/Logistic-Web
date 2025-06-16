import api from "@/hooks/axiosInstance";

export const manageFile = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/file/v1/public`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
