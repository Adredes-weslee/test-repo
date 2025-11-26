

import React, { useRef, useEffect } from 'react';

interface ContextMenuOption {
    label: string;
    action: () => void;
    disabled?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    options: ContextMenuOption[];
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="absolute z-50 bg-white rounded-md shadow-lg border border-slate-200 py-1 min-w-[120px]"
            style={{ top: y, left: x }}
        >
            {options.map((option, index) => (
                <button
                    key={index}
                    className="block w-full text-left px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:bg-transparent"
                    onClick={() => {
                        option.action();
                        onClose();
                    }}
                    disabled={option.disabled}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};