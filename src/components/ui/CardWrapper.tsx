import React from 'react';

interface CardWrapperProps {
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({ children, onClick, isActive, className }) => {
    const Component = onClick ? 'button' : 'div';
    return (
        <Component
            onClick={onClick}
            className={`relative bg-white p-6 rounded-lg border shadow-sm transition-all duration-300 group ${onClick ? 'cursor-pointer hover:bg-primary-lightest hover:border-primary-medium' : ''} ${
                isActive
                    ? 'border-2 border-primary shadow-lg'
                    : 'border-slate-200 border-2'
            } ${className || ''}`}
        >
            {isActive && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
            )}
            {children}
        </Component>
    );
};