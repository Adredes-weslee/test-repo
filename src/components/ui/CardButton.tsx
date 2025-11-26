import React from 'react';

interface CardButtonProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick: () => void;
}
export const CardButton: React.FC<CardButtonProps> = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-4 space-y-2 border rounded-lg w-full transition-colors duration-200 cursor-pointer ${active ? 'bg-primary-lightest border-primary-focus text-primary-text shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>
    <Icon className="w-6 h-6" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);