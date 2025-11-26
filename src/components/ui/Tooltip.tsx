import React from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'bottom' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group/tooltip flex items-center">
      {React.cloneElement(children)}
      <div
        className={`absolute ${positionClasses[position]} w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-10`}
      >
        {text}
      </div>
    </div>
  );
};
