import { create } from "zustand";

export const useModal = create((set) => ({
  isCreateCategoryOpen: false,
  isEditCategoryOpen: false,
  openCreateCategoryModal: () => set({ isCreateCategoryOpen: true }),
  openEditCategoryModal: () => set({ isEditCategoryOpen: true }),
  closeCreateCategoryModal: () => set({ isCreateCategoryOpen: false }),
  closeEditCategoryModal: () => set({ isEditCategoryOpen: false }),

  isCreateBrandOpen: false,
  isEditBrandOpen: false,
  openCreateBrandModal: () => set({ isCreateBrandOpen: true }),
  openEditBrandModal: () => set({ isEditBrandOpen: true }),
  closeCreateBrandModal: () => set({ isCreateBrandOpen: false }),
  closeEditBrandModal: () => set({ isEditBrandOpen: false }),

  isCreateModelOpen: false,
  isEditModelOpen: false,
  openCreateModelModal: () => set({ isCreateModelOpen: true }),
  openEditModelModal: () => set({ isEditModelOpen: true }),
  closeCreateModelModal: () => set({ isCreateModelOpen: false }),
  closeEditModelModal: () => set({ isEditModelOpen: false }),

  isCreateCityOpen: false,
  isEditCityOpen: false,
  openCreateCityModal: () => set({ isCreateCityOpen: true }),
  openEditCityModal: () => set({ isEditCityOpen: true }),
  closeCreateCityModal: () => set({ isCreateCityOpen: false }),
  closeEditCityModal: () => set({ isEditCityOpen: false }),

  isCreateCarOpen: false,
  isEditCarOpen: false,
  openCreateCarModal: () => set({ isCreateCarOpen: true }),
  openEditCarModal: () => set({ isEditCarOpen: true }),
  closeCreateCarModal: () => set({ isCreateCarOpen: false }),
  closeEditCarModal: () => set({ isEditCarOpen: false }),
}));
