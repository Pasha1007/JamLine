import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;
export const authUser = async (email, password) => {
  try {
    const response = await axios.post(`${url}/auth`, {
      email,
      password,
    });
    const { token } = response.data;
    if (token) {
      localStorage.setItem("accessToken", token);
    }
    return response.data;
  } catch (error) {
    console.error("Authorization error:", error);
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
