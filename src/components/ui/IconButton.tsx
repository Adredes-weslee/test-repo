


import React from 'react';
import { Tooltip } from './Tooltip';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ElementType;
    tooltipText: string;
    variant?: 'default' | 'primary' | 'danger';
}

const variantClasses = {
    default: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
    primary: 'text-primary bg-primary-lightest hover:bg-primary-lighter hover:text-primary-dark',
    danger: 'text-red-600 hover:bg-red-50',
};
const baseClasses = "flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon: Icon, tooltipText, variant = 'default', className, ...props }, ref) => {
        return (
            <Tooltip text={tooltipText} position="top">
                <button
                    ref={ref}
                    className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
                    {...props}
                >
                    <Icon className="w-5 h-5" />
                </button>
            </Tooltip>
        );
    }
);