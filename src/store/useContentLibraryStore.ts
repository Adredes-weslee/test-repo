import { create } from 'zustand';
import type { ContentItem } from '../types';
import { contentLibraryService } from '../services/ContentLibraryService';

interface ContentLibraryState {
  isInitialized: boolean;
  isLoading: boolean;
  contentLibrary: ContentItem[];
  activeContentItem: ContentItem | null;
  initialize: () => Promise<void>;
  addContentItem: (item: Omit<ContentItem, 'id' | 'created'> & { created?: string }) => Promise<ContentItem | undefined>;
  updateContentItem: (item: ContentItem) => Promise<void>;
  deleteContentItem: (id: number) => Promise<void>;
  setActiveContentItem: (item: ContentItem | null) => void;
  reset: () => void;
}

export const useContentLibraryStore = create<ContentLibraryState>((set, get) => ({
  isInitialized: false,
  isLoading: false,
  contentLibrary: [],
  activeContentItem: null,

  initialize: async () => {
    if (get().isInitialized || get().isLoading) return;
    set({ isLoading: true });
    try {
      const items = await contentLibraryService.getAllContentItems();
      set({ contentLibrary: items, isInitialized: true });
    } catch (error) {
      console.error("Failed to initialize content library store:", error);
      set({ isInitialized: true }); // Mark as initialized even on error to prevent re-fetching
    } finally {
      set({ isLoading: false });
    }
  },

  addContentItem: async (item) => {
    try {
      const itemToInsert = {
        ...item,
        created: item.created || new Date().toISOString(),
      };
      const newItem = await contentLibraryService.addContentItem(itemToInsert);
      set((state) => ({ contentLibrary: [newItem, ...state.contentLibrary] }));
      return newItem;
    } catch (error) {
      console.error("Failed to add content item:", error);
      return undefined;
    }
  },

  updateContentItem: async (updatedItem) => {
    try {
      const savedItem = await contentLibraryService.updateContentItem(updatedItem);
      set((state) => ({
        contentLibrary: state.contentLibrary.map((item) =>
          item.id === savedItem.id ? savedItem : item
        ),
      }));
    } catch (error) {
      console.error("Failed to update content item:", error);
    }
  },

  deleteContentItem: async (id) => {
    try {
      await contentLibraryService.deleteContentItem(id);
      set((state) => ({
        contentLibrary: state.contentLibrary.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete content item:", error);
    }
  },

  setActiveContentItem: (item) => set({ activeContentItem: item }),
  
  reset: () => set({ contentLibrary: [], activeContentItem: null, isInitialized: false, isLoading: false }),
}));
