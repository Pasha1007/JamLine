import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("accessToken");

export const createEnvironment = async (name, instrument) => {
  try {
    const response = await axios.post(
      `${url}/environment`,
      {
        name,
        instrument,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error while creating env:", error);
    throw error;
  }
};

export const deleteEnvironment = async (id) => {
  try {
    const response = await axios.delete(`${url}/environment/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while deleting env: ", error);
    throw error;
  }
};

export const getMyEnvs = async () => {
  try {
    const response = await axios.get(`${url}/environment`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error while getting envs:", error);
    throw error;
  }
};

export const getEnvById = async (id) => {
  try {
    const response = await axios.get(`${url}/environment/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.log(`Error while getting env ${id}:`, error);
    throw error;
  }
};
