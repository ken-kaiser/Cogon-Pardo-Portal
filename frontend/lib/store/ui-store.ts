import { create } from "zustand";

interface UIState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
}));
