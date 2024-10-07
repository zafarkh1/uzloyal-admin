import { create } from "zustand";

export const useTokenStore = create((set) => ({
  token: localStorage.getItem("token-uzloyal") || null,
  setToken: (newToken) => {
    localStorage.setItem("token-uzloyal", newToken);
    set({ token: newToken });
  },
  clearToken: () => {
    localStorage.removeItem("token-uzloyal");
    set({ token: null });
  },
}));
