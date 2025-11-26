import React from 'react';
import { ChevronDown } from '../icons/index';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    children: React.ReactNode;
    required?: boolean;
}
export const Select: React.FC<SelectProps> = ({ label, id, children, className, required, ...props }) => {
  const selectElement = (
    <div className="relative">
      <select 
        id={id} 
        {...props} 
        className={`w-full appearance-none px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-primary-focus pr-8 ${className || ''}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );

  if (label) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
          {label}{required && <span className="text-primary ml-1">*</span>}
        </label>
        {selectElement}
      </div>
    );
  }
  
  return selectElement;
};