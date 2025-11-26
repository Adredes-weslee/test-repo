import { supabase } from '../core/api/supabase';
import type { SignUpWithPasswordCredentials, SignInWithPasswordCredentials, UserAttributes, Session } from '@supabase/supabase-js';

class AuthService {
  async signUp(credentials: SignUpWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) throw error;
    return data;
  }

  async signIn(credentials: SignInWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async updateUser(attributes: UserAttributes) {
    const { data, error } = await supabase.auth.updateUser(attributes);
    if (error) throw error;
    return data;
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  }

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  }
}

export const authService = new AuthService();