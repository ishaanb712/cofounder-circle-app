'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/firebase-secure';
import LoadingSpinner from './LoadingSpinner';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  className = '',
  variant = 'default',
  size = 'md'
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.error) {
        setIsLoading(false);
        onError?.(result.error);
      } else if (result.user) {
        // Popup flow succeeded
        setIsLoading(false);
        onSuccess?.();
      } else {
        // Redirect flow - user will be redirected, so we don't call onSuccess here
        // The success will be handled when they return via handleRedirectResult
        // Note: We don't set isLoading to false here because the page will redirect
      }
    } catch (error) {
      setIsLoading(false);
      onError?.('Failed to sign in with Google');
    }
  };

  const baseClasses = 'flex items-center justify-center gap-3 font-medium transition-all duration-200 rounded-lg';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <motion.button
      onClick={handleSignIn}
      disabled={isLoading}
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      )}
      <span
        style={{
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: 500
        }}
      >
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
      {isLoading && (
        <div className="text-xs text-gray-500 mt-1">
          Redirecting to Google...
        </div>
      )}
    </motion.button>
  );
} 