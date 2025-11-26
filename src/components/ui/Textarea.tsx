
import React from 'react';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
    <textarea ref={ref} {...props} className={`w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-focus focus:border-primary-focus placeholder-slate-400 ${className || ''}`} />
));
