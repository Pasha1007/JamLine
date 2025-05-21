import axiosInstance from "../global/axiosInstance";

export const separateFile = async (formData) => {
  try {
    const response = await axiosInstance.post("/separate", formData);
    return response.data;
  } catch (error) {
    console.log("Error while file record:", error);
    throw error;
  }
};

export const getSeparatedFiles = async () => {
  try {
    const response = await axiosInstance.get("/separate");
    return response.data;
  } catch (error) {
    console.log("Error while fetching separated files:", error);
    throw error;
  }
};
