import React, { useEffect, useRef } from 'react';
import type { ToastMessage } from '../../store';
import { appConfig } from '../../config';

interface ToastProps {
    toast: ToastMessage;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        timerRef.current = window.setTimeout(() => {
            onDismiss();
        }, appConfig.UI_SETTINGS.toastDuration);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [onDismiss]);

    const handleActionClick = () => {
        if (toast.action) {
            toast.action.onClick();
        }
        onDismiss();
    };

    const isError = toast.type === 'error';
    const backgroundClass = isError ? 'bg-red-600' : 'bg-slate-800';
    const actionClass = isError 
        ? 'text-white font-bold hover:text-red-100 underline' 
        : 'text-primary-light hover:text-primary-lighter font-bold';

    return (
        <div className={`flex items-center justify-between max-w-sm w-full text-white rounded-lg shadow-2xl p-4 animate-fadeIn ${backgroundClass}`} role="status" aria-live="polite">
            <span className="text-sm">{toast.message}</span>
            {toast.action && (
                <button
                    onClick={handleActionClick}
                    className={`ml-4 flex-shrink-0 text-sm focus:outline-none focus:ring-2 focus:ring-white rounded ${actionClass}`}
                >
                    {toast.action.label}
                </button>
            )}
        </div>
    );
};