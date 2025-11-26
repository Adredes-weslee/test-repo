import React from 'react';

interface LoadingSpinnerProps {
    title: string;
    message: string;
    progress?: number;
    onCancel?: () => void;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ title, message, progress, onCancel }) => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-slate-500 mt-2">{message}</p>
            {progress !== undefined && (
                <>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-6 overflow-hidden">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">This may take a moment</p>
                </>
            )}
            {onCancel && (
                <div className="mt-6">
                    <button
                        onClick={onCancel}
                        className="bg-red-100 text-red-700 font-bold py-2 px-6 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    </div>
);