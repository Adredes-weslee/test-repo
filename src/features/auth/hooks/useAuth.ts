import { useState } from 'react';
import { authService } from '../../../services';
import { useToastStore } from '../../../store';
import type { SignUpWithPasswordCredentials, SignInWithPasswordCredentials } from '@supabase/supabase-js';


export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);

  const login = async (credentials: SignInWithPasswordCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signIn(credentials);
      addToast('Successfully signed in!', { type: 'default' });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: SignUpWithPasswordCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signUp(credentials);
      addToast('Registration successful! Please check your email to verify your account.', { type: 'default' });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signOut();
      addToast('You have been signed out.', { type: 'default' });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred during sign out.';
        setError(message);
        addToast('Logout failed. Please try again.', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, register, logout, isLoading, error };
};