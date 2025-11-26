import React, { useState, useEffect, useRef } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AuthLayout } from '../../layouts/AuthLayout';

const AuthFeature: React.FC = () => {
  const [visibleForm, setVisibleForm] = useState<'login' | 'register'>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loginAnimation, setLoginAnimation] = useState('animate-fadeIn');
  const [registerAnimation, setRegisterAnimation] = useState('hidden');

  const loginRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      const formRef = visibleForm === 'login' ? loginRef : registerRef;
    };
    
    const timer = setTimeout(updateHeight, 150);
    
    window.addEventListener('resize', updateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateHeight);
    };
  }, [visibleForm]);

  useEffect(() => {
    if (loginAnimation === 'animate-fadeIn') {
      const timer = setTimeout(() => {
        if (visibleForm === 'login') {
          setLoginAnimation('');
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loginAnimation, visibleForm]);

  const handleSwitchToRegister = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setLoginAnimation('animate-slideOutToLeft');
    setRegisterAnimation('animate-slideInFromRight -ml-[40vw]'); 
    
    setTimeout(() => {
      setLoginAnimation('hidden');
      setRegisterAnimation('ml-0');
      setVisibleForm('register');
      setIsTransitioning(false);
    }, 400);
  };

  const handleSwitchToLogin = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setRegisterAnimation('animate-slideOutToRight -ml-[40vw]');
    setLoginAnimation('animate-slideInFromLeft');
    
    setTimeout(() => {
      setRegisterAnimation('hidden')
      setLoginAnimation('');
      setVisibleForm('login');
      setIsTransitioning(false);
    }, 400);
  };

  const title = visibleForm === 'login' ? 'Welcome back!' : 'Create an Account';
  const subtitle = visibleForm === 'login'
    ? 'You can sign in to access with your existing account.'
    : 'Join us to start creating amazing content with the power of AI.';

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <div 
        className="relative transition-all duration-400 ease-out flex flex-row w-full" 
      >
        <div ref={loginRef} className={`w-full min-w-[40vw] ${loginAnimation}`}>
          <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        </div>
        <div ref={registerRef} className={`w-full min-w-[40vw] ${registerAnimation}`}>
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthFeature;
