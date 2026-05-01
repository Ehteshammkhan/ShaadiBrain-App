import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: any;
  token: string | null;
  setAuth: (user: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: async (user, token) => {
    await AsyncStorage.setItem("token", token);

    set({
      user,
      token,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },
}));