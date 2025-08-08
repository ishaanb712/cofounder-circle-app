'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket } from 'lucide-react';
import ProfessionalMultiStepForm from './ProfessionalMultiStepForm';

interface ProfessionalRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfessionalRegistrationModal({ isOpen, onClose }: ProfessionalRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleComplete = async (formData: any) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/professional/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: parseInt(formData.phone),
          years_experience: formData.years_experience
        }),
      });

      if (response.ok) {
        setSubmitMessage('Registration successful! We\'ll be in touch soon.');
        setTimeout(() => {
          onClose();
          setSubmitMessage('');
        }, 2000);
      } else {
        const error = await response.json();
        setSubmitMessage(`Error: ${error.detail || 'Something went wrong'}`);
      }
    } catch (error) {
      setSubmitMessage('Error: Could not connect to server');
    } finally {
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 
                    className="text-2xl font-bold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 900
                    }}
                  >
                    CoFounder Circle Registration
                  </h2>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 500
                    }}
                  >
                    Complete your profile in 4 simple steps
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-4 rounded-lg mb-6 ${
                  submitMessage.includes('Error') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {submitMessage}
                </div>
              )}

              {/* Multi-Step Form */}
              <ProfessionalMultiStepForm
                userId="temp-user-id" // This will be replaced with actual user ID
                onComplete={handleComplete}
                onStepChange={handleStepChange}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 