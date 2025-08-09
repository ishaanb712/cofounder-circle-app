'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, CheckCircle } from 'lucide-react';
import VendorMultiStepForm from './VendorMultiStepForm';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorRegistrationModal({ isOpen, onClose }: VendorRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleComplete = async (formData: any): Promise<void> => {
    console.log('🚀 Starting vendor form submission...');
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/vendors/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: parseInt(formData.phone),
          years_of_experience: formData.years_of_experience,
          minimum_project_value: formData.minimum_project_value
        }),
      });

      if (response.ok) {
        console.log('✅ Vendor form submitted successfully! Showing success message...');
        setSubmitMessage('✅ Form submitted successfully! Thank you for registering with CoFounder Circle.');
        console.log('📝 Success message set:', '✅ Form submitted successfully! Thank you for registering with CoFounder Circle.');
        // Keep modal open for 4 seconds to show success message
        setTimeout(() => {
          console.log('⏰ Success timeout - closing modal');
          onClose();
          setSubmitMessage('');
        }, 4000);
      } else {
        const error = await response.json();
        setSubmitMessage(`Error: ${error.detail || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('❌ Error submitting vendor form:', error);
      setSubmitMessage('Error: Could not connect to server');
    } finally {
      console.log('🏁 Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitMessage('');
    setCurrentStep(1);
    onClose();
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              handleClose();
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <div>
                  <h2 
                    className="text-lg md:text-2xl font-bold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 900
                    }}
                  >
                    CoFounder Circle Registration
                  </h2>
                  <p 
                    className="text-gray-600 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 500
                    }}
                  >
                    Complete your profile in 5 simple steps
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 relative">
              {/* Multi-Step Form */}
              <VendorMultiStepForm
                userId="temp-user-id" // This will be replaced with actual user ID
                onComplete={handleComplete}
                onStepChange={handleStepChange}
              />
              
              {/* Success Message Overlay */}
              {submitMessage && submitMessage.includes('✅') && (
                <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 
                      className="text-xl font-semibold text-gray-900 mb-2"
                      style={{
                        fontFamily: 'var(--font-montserrat), sans-serif',
                        fontWeight: 700
                      }}
                    >
                      Form Submitted Successfully!
                    </h3>
                    <p 
                      className="text-gray-600"
                      style={{
                        fontFamily: 'var(--font-roboto), sans-serif',
                        fontWeight: 400
                      }}
                    >
                      Thank you for registering with CoFounder Circle.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 