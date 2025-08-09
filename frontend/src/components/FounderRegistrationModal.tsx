'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import FounderMultiStepForm from './FounderMultiStepForm';

interface FounderRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FounderRegistrationModal({ isOpen, onClose }: FounderRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleComplete = async (formData: any): Promise<void> => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare request data
      const requestData = {
        ...formData,
        phone: formData.phone ? parseInt(formData.phone) : null,
        user_id: 'temp-user-id' // This should come from auth context
      };

      console.log('Submitting founder data:', requestData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/founders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        console.log('✅ Form submitted successfully! Showing success message...');
        setSubmitMessage('✅ Form submitted successfully! Thank you for registering with CoFounder Circle.');
        console.log('📝 Success message set:', '✅ Form submitted successfully! Thank you for registering with CoFounder Circle.');
        // Keep modal open for 4 seconds to show success message
        setTimeout(() => {
          console.log('⏰ Success timeout - closing modal');
          onClose();
          setSubmitMessage('');
        }, 4000);
      } else {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        console.error('Error details:', JSON.stringify(errorData, null, 2));
        
        if (response.status === 422) {
          let errorMessage = 'Validation error: ';
          if (errorData.detail && Array.isArray(errorData.detail)) {
            errorMessage += errorData.detail.map((err: any) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ');
          } else {
            errorMessage += errorData.detail || 'Invalid data format';
          }
          setSubmitMessage(errorMessage);
        } else {
          setSubmitMessage(`Error: ${errorData.detail || 'Something went wrong'}`);
        }
      }
    } catch (error) {
      setSubmitMessage('Error: Could not connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSubmitMessage('');
    onClose();
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSubmitting) {
                onClose();
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 
                      className="text-lg md:text-xl font-bold text-gray-900"
                      style={{
                        fontFamily: 'var(--font-montserrat), sans-serif',
                        fontWeight: 900
                      }}
                    >
                      CoFounder Circle registration
                    </h2>
                    <p
                      className="text-gray-600 mt-1"
                      style={{
                        fontFamily: 'var(--font-roboto), sans-serif',
                        fontWeight: 500
                      }}
                    >
                      Complete the form in 4 steps
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                {/* Success Message Only - Hide errors from users */}
                {submitMessage && submitMessage.includes('✅') && (
                  <div className="p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-sm md:text-base bg-green-100 text-green-700">
                    {submitMessage}
                  </div>
                )}

                {/* Multi-Step Form */}
                <FounderMultiStepForm
                  userId="temp-user-id" // This will be replaced with actual user ID
                  onComplete={handleComplete}
                  onStepChange={handleStepChange}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
} 