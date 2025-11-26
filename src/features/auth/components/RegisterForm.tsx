import React, { useState } from 'react';
import { Input, Button } from '../../../components/ui';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock } from '../../../components/icons';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading, error } = useAuth();
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
        return;
    }

    register({ email, password, options: { data: { full_name: name } } });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Sign Up</h2>
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      {passwordError && <p className="text-red-500 text-sm text-center mb-4">{passwordError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Full Name"
          icon={User}
        />
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email Address"
          icon={Mail}
        />
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Password"
          icon={Lock}
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Confirm Password"
          icon={Lock}
        />
        <Button type="submit" className="w-full !mt-6 !py-3" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      <div className="text-center mt-6 text-sm">
        <p className="text-slate-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold text-primary-text hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
