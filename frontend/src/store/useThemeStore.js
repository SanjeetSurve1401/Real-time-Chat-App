import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("appTheme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("appTheme", theme),
    set({ theme})
  },
}));
