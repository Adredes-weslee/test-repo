import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => (
    <div className="flex items-center">
        <input 
            id={id} 
            type="checkbox" 
            {...props} 
            className="appearance-none h-5 w-5 cursor-pointer transition-colors rounded shadow border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-focus checked:bg-primary-focus"
        />
        <label htmlFor={id} className="ml-2 block text-sm text-slate-700">{label}</label>
    </div>
);