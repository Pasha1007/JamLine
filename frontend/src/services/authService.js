import axios from "axios";

const url = import.meta.env.VITE_BASE_URL;
export const authUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${url}/auth`,
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
