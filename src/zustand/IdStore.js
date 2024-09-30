import { create } from "zustand";

export const useIdStore = create((set) => ({
  categoryId: "",
  setCategoryId: (id) => set({ categoryId: id }),

  brandId: "",
  setBrandId: (id) => set({ brandId: id }),

  modelId: "",
  setModelId: (id) => set({ modelId: id }),

  cityId: "",
  setCityId: (id) => set({ cityId: id }),
}));
