import axiosInstance from "../global/axiosInstance";

export const createEnvironment = async (name, instrument) => {
  try {
    const response = await axiosInstance.post("/environment", {
      name,
      instrument,
    });
    return response.data;
  } catch (error) {
    console.log("Error while creating env:", error);
    throw error;
  }
};

export const deleteEnvironment = async (id) => {
  try {
    const response = await axiosInstance.delete(`/environment/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error while deleting env: ", error);
    throw error;
  }
};

export const getMyEnvs = async () => {
  try {
    const response = await axiosInstance.get("/environment");
    return response.data;
  } catch (error) {
    console.log("Error while getting envs:", error);
    throw error;
  }
};

export const getEnvById = async (id) => {
  try {
    const response = await axiosInstance.get(`/environment/${id}`);
    return response.data;
  } catch (error) {
    console.log(`Error while getting env ${id}:`, error);
    throw error;
  }
};
