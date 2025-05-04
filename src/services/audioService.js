import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("accessToken");

export const saveRecord = async (name, file) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("audio", file, name);

    const response = await axios.post(`${url}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
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
    const response = await axios.get(`${url}/audio`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error while fetching records:", error);
    throw error;
  }
};
