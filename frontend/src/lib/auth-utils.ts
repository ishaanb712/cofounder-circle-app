import { AuthUser } from './firebase-secure';

export interface AuthUtils {
  user: AuthUser | null;
  setShowSignInModal: (show: boolean) => void;
  setPendingNavigation?: (href: string | null) => void;
}

export const handleRegisterClick = (authUtils: AuthUtils, targetHref?: string) => {
  const { user, setShowSignInModal, setPendingNavigation } = authUtils;
  
  if (user) {
    // User is authenticated, navigate to the target or dashboard
    if (targetHref) {
      window.location.href = targetHref;
    } else {
      window.location.href = '/dashboard';
    }
  } else {
    // User is not authenticated, show sign-in modal
    if (setPendingNavigation && targetHref) {
      setPendingNavigation(targetHref);
    }
    setShowSignInModal(true);
  }
};

export const isAuthenticated = (user: AuthUser | null): boolean => {
  return user !== null;
}; 