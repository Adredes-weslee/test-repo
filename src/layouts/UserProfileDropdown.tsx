import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Moon, Sun, LogOut, Lock } from '../components/icons/index';

interface UserProfile {
  name: string;
  email: string;
  organization: string;
  avatarUrl: string;
}

interface UserProfileDropdownProps {
  userProfile: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAccountModal: () => void;
  onOpenResetPasswordModal: () => void;
  onLogout: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ userProfile, isDarkMode, onToggleDarkMode, onOpenAccountModal, onOpenResetPasswordModal, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInitials, setUserInitials] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initials = userProfile.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    setUserInitials(initials);
  }, [userProfile.name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAccountModalWithClose = () => {
    onOpenAccountModal();
    setIsDropdownOpen(false);
  }

  const handleOpenResetPasswordModalWithClose = () => {
    onOpenResetPasswordModal();
    setIsDropdownOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(prev => !prev)}
        className="flex items-center justify-center w-9 h-9 bg-primary-light text-primary-dark rounded-full font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus overflow-hidden"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        {userProfile.avatarUrl ? (
          <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
        ) : (
          userInitials
        )}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-slate-200 z-40 animate-fadeIn origin-top-right">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-slate-800 truncate">{userProfile.name}</p>
              <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
              <p className="text-xs text-slate-500 truncate mt-1">{userProfile.organization}</p>
            </div>
            <div className="border-t border-slate-200"></div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleOpenAccountModalWithClose(); }}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              role="menuitem"
            >
              <User className="w-4 h-4 mr-3 text-slate-500" />
              My Account
            </a>
            <button
              onClick={() => onToggleDarkMode()}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              role="menuitem"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 mr-3 text-slate-500" />
              ) : (
                <Moon className="w-4 h-4 mr-3 text-slate-500" />
              )}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
             <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleOpenResetPasswordModalWithClose(); }}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              role="menuitem"
            >
              <Lock className="w-4 h-4 mr-3 text-slate-500" />
              Reset Password
            </a>
            <div className="border-t border-slate-200"></div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onLogout(); setIsDropdownOpen(false); }}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};