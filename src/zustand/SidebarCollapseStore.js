import { create } from "zustand";

export const useSidebarCollapse = create((set) => ({
  isSidebarCollapse: false,
  toggleSidebarCollapse: () =>
    set((state) => ({ isSidebarCollapse: !state.isSidebarCollapse })),
}));
