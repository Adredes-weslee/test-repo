import { create } from 'zustand';
import type { TabName } from '../types';

interface NavigationState {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  navigateTo: (tab: TabName) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'Trending',
  setActiveTab: (tab) => set({ activeTab: tab }),
  navigateTo: (tab) => set({ activeTab: tab }),
}));