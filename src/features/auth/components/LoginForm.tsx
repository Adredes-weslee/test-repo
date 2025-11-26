import React from 'react';
import { Input, Button, Checkbox } from '../../../components/ui';
import { useAuth } from '../hooks/useAuth';
import { User, Lock } from '../../../components/icons';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    login({ email, password });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Sign In</h2>
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Username or email"
          icon={User}
          value="joseph.woo.elicer@gmail.com"
        />
        <Input
          id="password"
          name="password"
          type="password"
          value="Elicer#123"
          required
          autoComplete="current-password"
          placeholder="Password"
          icon={Lock}
        />
        <div className="flex items-center justify-between">
            <Checkbox id="remember-me" label="Remember me" />
            <a href="#" className="text-sm font-medium text-primary-text hover:underline">Forgot password?</a>
        </div>
        <Button type="submit" className="w-full !py-3" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      <div className="text-center mt-6 text-sm">
        <p className="text-slate-600">
          New here?{' '}
          <button onClick={onSwitchToRegister} className="font-semibold text-primary-text hover:underline">
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};
