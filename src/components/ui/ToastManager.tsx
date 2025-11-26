import React from 'react';
import { Toast } from './Toast';
import { useToastStore } from '../../store';

export const ToastManager: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-8 right-8 z-[100] space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};
