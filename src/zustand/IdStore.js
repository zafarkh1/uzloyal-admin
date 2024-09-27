import { create } from "zustand";

export const useIdStore = create((set) => ({
  categoryId: "",
  setCategoryId: (id) => set({ categoryId: id }),
}));
