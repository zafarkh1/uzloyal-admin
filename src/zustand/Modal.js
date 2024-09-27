import { create } from "zustand";

export const useModal = create((set) => ({
  isCreateCategoryOpen: false,
  isEditCategoryOpen: false,
  openCreateCategoryModal: () => set({ isCreateCategoryOpen: true }),
  openEditCategoryModal: () => set({ isEditCategoryOpen: true }),
  closeCreateCategoryModal: () => set({ isCreateCategoryOpen: false }),
  closeEditCategoryModal: () => set({ isEditCategoryOpen: false }),
}));
