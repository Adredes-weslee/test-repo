import { create } from 'zustand';

// Replicating types from context
export interface ToastAction {
    label: string;
    onClick: () => void;
}
export interface ToastMessage {
    id: number;
    message: string;
    action?: ToastAction;
    type?: 'default' | 'error';
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, options?: { action?: ToastAction; type?: 'default' | 'error' }) => void;
  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, options) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { id, message, ...options }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
