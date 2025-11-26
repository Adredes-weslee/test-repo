import React from 'react';
import { Button } from '../../../../components/ui';

export type Layout = 'terminal' | 'webapp';

interface OutputPanelProps {
    layout: Layout;
    onLayoutChange: (layout: Layout) => void;
    children: React.ReactNode;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ layout, onLayoutChange, children }) => {
    return (
        <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col text-white font-mono text-sm overflow-hidden">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs ml-2 text-slate-500">Layout:</span>
                    <Button onClick={() => onLayoutChange('terminal')} variant={layout === 'terminal' ? 'primary' : 'secondary'} className="!py-1 !px-3 !text-xs">Terminal</Button>
                    <Button onClick={() => onLayoutChange('webapp')} variant={layout === 'webapp' ? 'primary' : 'secondary'} className="!py-1 !px-3 !text-xs">Web</Button>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                     <span>CPU: <span className="font-semibold">5%</span></span>
                     <span>Memory: <span className="font-semibold">256MB / 2GB</span></span>
                     <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="font-semibold text-green-700">Ready</span></span>
                </div>
            </div>
            {children}
        </div>
    );
};
