import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { X, Lock } from '../icons';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (password: string) => Promise<void>;
    isSaving: boolean;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!newPassword || !confirmPassword) {
            setError("Both fields are required.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        await onSave(newPassword);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" role="dialog" aria-modal="true" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close">
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Reset Password</h2>
                <p className="text-slate-600 mb-6">Enter and confirm your new password below. Your new password must be at least 6 characters long.</p>

                {error && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
                
                <div className="space-y-4">
                    <Input
                        label="New Password"
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        icon={Lock}
                        required
                        autoComplete="new-password"
                    />
                    <Input
                        label="Confirm New Password"
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={Lock}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save New Password'}
                    </Button>
                </div>
            </form>
        </div>
    );
};