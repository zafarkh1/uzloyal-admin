import { create } from "zustand";

export const useIdStore = create((set) => ({
  categoryId: "",
  setCategoryId: (id) => set({ categoryId: id }),

  faqId: "",
  setFaqId: (id) => set({ faqId: id }),

  newsId: "",
  setNewsId: (id) => set({ newsId: id }),

  blogsId: "",
  setBlogsId: (id) => set({ blogsId: id }),

  serviceId: "",
  setServiceId: (id) => set({ serviceId: id }),

  sourceId: "",
  setSourceId: (id) => set({ sourceId: id }),
}));
