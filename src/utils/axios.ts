import axios from "axios";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 10000,
});

// 🔹 Attach token (keep it simple)
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Minimal error handling
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");
    }

    return Promise.reject(
      error.response?.data || { message: "Something went wrong" }
    );
  }
);

export default API;