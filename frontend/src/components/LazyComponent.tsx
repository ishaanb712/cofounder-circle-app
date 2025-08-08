'use client';

import { Suspense, lazy, ComponentType } from 'react';

interface LazyComponentProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

const defaultFallback = (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

export default function LazyComponent({ 
  component: Component, 
  fallback = defaultFallback,
  ...props 
}: LazyComponentProps) {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

// Pre-defined lazy components for common use cases
export const LazySignInModal = lazy(() => import('./SignInModal'));
export const LazyUserProfileSetup = lazy(() => import('./UserProfileSetup'));
export const LazyGoogleSignInButton = lazy(() => import('./GoogleSignInButton'));
export const LazyStudentLandingPage = lazy(() => import('./StudentLandingPage'));
export const LazyFounderLandingPage = lazy(() => import('./FounderLandingPage'));
export const LazyMentorLandingPage = lazy(() => import('./MentorLandingPage'));
export const LazyVendorLandingPage = lazy(() => import('./VendorLandingPage')); 