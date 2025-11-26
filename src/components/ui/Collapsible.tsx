import React, { useState } from 'react';
import { ChevronDown } from '../icons/index';
import { appConfig } from '../../config';

interface CollapsibleProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    containerClassName?: string;
    headerClassName?: string;
    contentClassName?: string;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
    title,
    children,
    defaultOpen = appConfig.UI_SETTINGS.defaultCollapsibleState,
    containerClassName = 'border rounded-lg border-slate-200',
    headerClassName = 'w-full flex justify-between items-center p-4 text-left bg-slate-50/50 hover:bg-slate-100/70',
    contentClassName = 'p-4 border-t border-slate-200',
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={containerClassName}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={headerClassName}
                aria-expanded={isOpen}
            >
                <div className="flex-grow">
                    {title}
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className={contentClassName}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
