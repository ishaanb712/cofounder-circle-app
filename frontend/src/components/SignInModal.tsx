'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SignInModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onError 
}: SignInModalProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md mx-4"
            style={{
              maxWidth: 'calc(100vw - 32px)',
              margin: '16px'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Lock className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 
                    className="text-lg md:text-2xl font-bold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 900
                    }}
                  >
                    Sign In Required
                  </h2>
                  <p 
                    className="text-sm md:text-base text-gray-600"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 500
                    }}
                  >
                    Please sign in to access this section of our platform
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              {/* Sign In Options */}
              <div className="space-y-4">
                <GoogleSignInButton
                  onSuccess={onSuccess}
                  onError={onError}
                  className="w-full"
                  size="lg"
                />
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p 
                  className="text-sm text-gray-500"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                >
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 