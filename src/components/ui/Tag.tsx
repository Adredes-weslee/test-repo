import React from 'react';

export const Tag: React.FC<{ children: React.ReactNode; onClick?: () => void; }> = ({ children, onClick }) => (
  <button onClick={onClick} className="px-3 py-1.5 text-sm bg-primary-lightest text-primary-text rounded-full hover:bg-primary-lighter transition-colors cursor-pointer">
    {children}
  </button>
);