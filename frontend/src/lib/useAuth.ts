import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange, AuthUser, handleRedirectResult } from './firebase-secure';
import { AuthUtils } from './auth-utils';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    // Handle redirect result on mount
    const handleRedirect = async () => {
      const result = await handleRedirectResult();
      if (result.user) {
        setUser(result.user);
      }
    };
    
    handleRedirect();

    // Check current user on mount
    getCurrentUser().then(setUser);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    // Don't navigate immediately - let the component handle the post-sign-in flow
    // The component will check if user is authenticated and show the appropriate modal
    setPendingNavigation(null);
  };

  const handleSignInError = (error: string) => {
    console.error('Sign in error:', error);
  };

  const handleRegisterClick = (targetHref?: string, onSuccess?: () => void) => {
    if (user) {
      // User is authenticated, navigate to the target or dashboard
      if (targetHref) {
        window.location.href = targetHref;
      } else {
        // Call onSuccess callback if provided (e.g., to close mobile menu)
        onSuccess?.();
      }
    } else {
      // User is not authenticated, show sign-in modal
      if (targetHref) {
        setPendingNavigation(targetHref);
      }
      setShowSignInModal(true);
    }
  };

  const authUtils: AuthUtils = {
    user,
    setShowSignInModal,
    setPendingNavigation
  };

  return {
    user,
    showSignInModal,
    pendingNavigation,
    setShowSignInModal,
    setPendingNavigation,
    handleSignInSuccess,
    handleSignInError,
    handleRegisterClick,
    authUtils
  };
}; 