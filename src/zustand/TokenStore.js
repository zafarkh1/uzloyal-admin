import { create } from "zustand";

export const useTokenStore = create((set) => ({
  token: localStorage.getItem("token-autozoom") || null,
  setToken: (newToken) => {
    localStorage.setItem("token-autozoom", newToken);
    set({ token: newToken });
  },
  clearToken: () => {
    localStorage.removeItem("token-autozoom");
    set({ token: null });
  },
}));
