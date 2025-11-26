import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'text' | 'danger' | 'danger-secondary';
    size?: 'default' | 'small' | 'xs';
    children: React.ReactNode;
    icon?: React.ElementType;
}

const baseClasses = "flex items-center justify-center font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer disabled:cursor-not-allowed";

const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary-focus/20 focus:ring-primary-focus disabled:bg-slate-400 disabled:shadow-none',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-semibold focus:ring-slate-400',
    text: 'text-primary-text hover:underline p-0 font-semibold !rounded-none !shadow-none !ring-offset-0 focus:ring-primary-focus',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/20 disabled:bg-slate-400 disabled:shadow-none',
    'danger-secondary': 'bg-white text-red-600 border border-red-300 hover:bg-red-50 font-semibold focus:ring-red-500',
};

const sizeClasses = {
    default: 'py-3 px-4 text-sm',
    small: 'py-2 px-4 text-sm',
    xs: 'py-1 px-3 text-xs',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = 'primary', size = 'default', children, icon: Icon, className, ...props }, ref) => {
    
    const sizeClass = variant === 'text' ? '' : sizeClasses[size];

    return (
        <button
            ref={ref}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClass} ${className || ''}`}
            {...props}
        >
            {Icon && <Icon className="w-5 h-5 mr-2" />}
            <span className="flex items-center">
                {children}
            </span>
        </button>
    );
});