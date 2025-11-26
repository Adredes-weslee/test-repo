


import React from 'react';
import { Sparkles } from '../icons';
import { Tooltip } from './Tooltip';

interface RegenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isPopoverOpen?: boolean;
}

export const RegenerateButton = React.forwardRef<HTMLButtonElement, RegenerateButtonProps>(
  ({ className, isPopoverOpen, ...props }, ref) => {
    return (
      <div className={`w-fit z-10 ${className || ''}`}>
        <Tooltip text="Generate" position="top">
          <button
            ref={ref}
            className={`flex items-center justify-center w-8 h-8 bg-primary-lightest rounded-full text-primary-text hover:bg-primary-lighter shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    );
  }
);