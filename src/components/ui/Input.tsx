import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  required?: boolean;
  icon?: React.ElementType;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, containerClassName, required, icon: Icon, ...props }, ref) => (
  <div className={containerClassName}>
    {label && <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
      {label}{required && <span className="text-primary ml-1">*</span>}
    </label>}
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input 
        ref={ref} 
        id={id} 
        {...props} 
        className={`w-full py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-focus focus:border-primary-focus placeholder-slate-400 ${Icon ? 'pl-10 pr-3' : 'px-3'}`} 
      />
    </div>
  </div>
));