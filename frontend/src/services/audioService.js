import axiosInstance from "../global/axiosInstance";

const url = import.meta.env.VITE_BASE_URL;

export const saveRecord = async (name, file) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("audio", file, name);

    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error while uploading record:", error);
    throw error;
  }
};

export const getMyRecords = async () => {
  try {
    const response = await axiosInstance.get("/audio");
    return response.data;
  } catch (error) {
    console.log("Error while fetching records:", error);
    throw error;
  }
};
