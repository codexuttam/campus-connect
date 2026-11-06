import { create } from 'zustand';

interface UIState {
  activeTab: string;
  isComponentShowcaseOpen: boolean;
  setActiveTab: (tab: string) => void;
  setComponentShowcaseOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'index',
  isComponentShowcaseOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setComponentShowcaseOpen: (open) => set({ isComponentShowcaseOpen: open }),
}));

