import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { X } from '../icons';

interface UserProfile {
  name: string;
  email: string;
  organization: string;
  avatarUrl: string;
}

interface MyAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: UserProfile;
    onSave: (newProfile: UserProfile) => void;
}

export const MyAccountModal: React.FC<MyAccountModalProps> = ({ isOpen, onClose, userProfile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
    const [userInitials, setUserInitials] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsEditing(false);
            setEditedProfile(userProfile);
        }
    }, [isOpen, userProfile]);

    useEffect(() => {
        const nameForInitials = isEditing ? editedProfile.name : userProfile.name;
        const initials = nameForInitials
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setUserInitials(initials);
    }, [userProfile.name, editedProfile.name, isEditing]);

    if (!isOpen) return null;

    const handleInputChange = (field: keyof UserProfile, value: string) => {
      setEditedProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile(userProfile);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedProfile);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close">
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">My Account</h2>

                <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-primary-light text-primary-dark rounded-full font-bold text-3xl flex items-center justify-center overflow-hidden">
                            {(isEditing ? editedProfile.avatarUrl : userProfile.avatarUrl) ? (
                                <img src={isEditing ? editedProfile.avatarUrl : userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                            ) : (
                                userInitials
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">{userProfile.name}</h3>
                        <p className="text-sm text-slate-500">{userProfile.email}</p>
                        <p className="text-sm text-slate-500 mt-1">{userProfile.organization}</p>
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                id="fullName"
                                value={editedProfile.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                            <Input
                                label="Email Address"
                                id="email"
                                type="email"
                                value={editedProfile.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                            <Input
                                label="Organization"
                                id="organization"
                                value={editedProfile.organization}
                                onChange={(e) => handleInputChange('organization', e.target.value)}
                                placeholder="e.g., Elice"
                            />
                             <Input
                                label="Avatar URL"
                                id="avatarUrl"
                                value={editedProfile.avatarUrl}
                                onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                                placeholder="https://example.com/avatar.png"
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                            <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                            <Button type="submit" variant="primary">Save Changes</Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
                        <Button type="button" variant="secondary" onClick={handleEdit}>Edit Profile</Button>
                    </div>
                )}
            </div>
        </div>
    );
};