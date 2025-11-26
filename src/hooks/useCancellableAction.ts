
import { useState, useCallback } from 'react';

export const useCancellableAction = (onConfirmAction: () => void) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const open = useCallback(() => setIsModalOpen(true), []);
    const close = useCallback(() => setIsModalOpen(false), []);
    
    const confirm = useCallback(() => {
        onConfirmAction();
        close();
    }, [onConfirmAction, close]);

    return {
        isModalOpen,
        open,
        close,
        confirm,
    };
};
