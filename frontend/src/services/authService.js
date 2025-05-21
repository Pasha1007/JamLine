import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${url}/reg`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${url}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem("accessToken");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
