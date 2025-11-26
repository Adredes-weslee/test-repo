import React from 'react';

export const SkeletonBar: React.FC<{ width?: string; height?: string; className?: string }> = ({ width = '100%', height = '1rem', className = '' }) => (
    <div className={`bg-slate-200 rounded animate-pulse ${className}`} style={{ width, height }}></div>
);