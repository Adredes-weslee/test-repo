import React, { useState, useEffect } from 'react';
import { MyAccountModal, ResetPasswordModal } from '../components/ui';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Logo } from '../components/icons';
import { useAuthStore, useToastStore } from '../store';
import { useAuth } from '../features/auth/hooks/useAuth';
import { authService } from '../services';

interface UserProfile {
  name: string;
  email: string;
  organization: string;
  avatarUrl: string;
}


const Header: React.FC = () => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.user_metadata?.full_name || 'Elice User',
    email: user?.email || '',
    organization: user?.user_metadata?.organization || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  });

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.user_metadata?.full_name || 'Elice User',
        email: user.email || '',
        organization: user.user_metadata?.organization || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
      });
    }
  }, [user]);
  
  const handleOpenAccountModal = () => {
    setIsAccountModalOpen(true);
  };
  
  const handleAccountUpdate = async (newProfile: UserProfile) => {
    const dataToUpdate: import('@supabase/supabase-js').UserAttributes = {
      data: {
        full_name: newProfile.name,
        organization: newProfile.organization,
        avatar_url: newProfile.avatarUrl,
      }
    };
    if (newProfile.email !== user?.email) {
        dataToUpdate.email = newProfile.email;
    }
    try {
        await authService.updateUser(dataToUpdate);
        addToast('Profile updated successfully!', { type: 'default' });
        setIsAccountModalOpen(false);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        addToast(`Error updating profile: ${message}`, { type: 'error' });
    }
  };

  const handlePasswordUpdate = async (newPassword: string) => {
    setIsSavingPassword(true);
    try {
        await authService.updateUser({ password: newPassword });
        addToast('Password updated successfully!', { type: 'default' });
        setIsResetPasswordModalOpen(false);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        addToast(`Error updating password: ${message}`, { type: 'error' });
    } finally {
        setIsSavingPassword(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
              <h1 className="text-xl font-bold text-slate-800 ml-3">Creator AI</h1>
              <span className="ml-2 bg-primary-lighter text-primary-text text-xs font-semibold px-2.5 py-0.5 rounded-full">Beta</span>
            </div>
            <div className="flex items-center">
              <UserProfileDropdown
                userProfile={userProfile}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
                onOpenAccountModal={handleOpenAccountModal}
                onOpenResetPasswordModal={() => setIsResetPasswordModalOpen(true)}
                onLogout={logout}
              />
            </div>
          </div>
        </div>
      </header>
      <MyAccountModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        userProfile={userProfile}
        onSave={handleAccountUpdate}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSave={handlePasswordUpdate}
        isSaving={isSavingPassword}
      />
    </>
  );
};

export default Header;