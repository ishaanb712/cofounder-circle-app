'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, CheckCircle } from 'lucide-react';
import MentorMultiStepForm from './MentorMultiStepForm';
import { generateSecureUUID } from '@/lib/utils';

interface MentorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MentorRegistrationModal({ isOpen, onClose }: MentorRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleComplete = async (formData: any): Promise<void> => {
    console.log('🚀 Starting mentor form submission...');
    console.log('📊 Form data being sent:', formData);
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Generate a proper UUID for the form submission
      const userId = generateSecureUUID();
      
      // Clean up the form data - remove empty strings and ensure proper types
      const cleanedFormData = {
        ...formData,
        // Remove empty strings
        name: formData.name || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        organisation: formData.organisation || undefined,
        url: formData.url || undefined,
        linkedin: formData.linkedin || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        incubator_type: formData.incubator_type || undefined,
        // Ensure arrays are not empty
        focus_areas: formData.focus_areas?.length > 0 ? formData.focus_areas : undefined,
        preferred_startup_stage: formData.preferred_startup_stage?.length > 0 ? formData.preferred_startup_stage : undefined
      };
      
      const requestBody = {
        ...cleanedFormData,
        user_id: userId
      };
      
      console.log('📤 Request body being sent:', requestBody);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.101:8000'}/api/mentors/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);
      
      if (response.ok) {
        console.log('✅ Mentor form submitted successfully! Showing success message...');
        const successMsg = '✅ Form submitted successfully! Thank you for registering with CoFounder Circle.';
        setSubmitMessage(successMsg);
        console.log('📝 Success message set:', successMsg);
        console.log('🔍 Current submitMessage state:', submitMessage);
        
        // Force a re-render to ensure the success message shows
        setTimeout(() => {
          console.log('🔄 Forcing re-render for success message');
          setSubmitMessage(successMsg);
        }, 100);
        
        // Keep modal open for 4 seconds to show success message
        setTimeout(() => {
          console.log('⏰ Success timeout - closing modal');
          onClose();
          setSubmitMessage('');
        }, 4000);
      } else {
        const error = await response.json();
        console.log('❌ Error response:', error);
        
        // Handle validation errors specifically
        if (response.status === 422) {
          let errorMessage = 'Please fix the following issues:';
          if (error.detail) {
            if (Array.isArray(error.detail)) {
              const errorList = error.detail.map((err: any) => {
                // Make error messages more user-friendly
                let field = err.loc ? err.loc[err.loc.length - 1] : '';
                let message = err.msg || '';
                
                // Map technical field names to user-friendly names
                const fieldMap: { [key: string]: string } = {
                  'email': 'Email address',
                  'phone': 'Phone number',
                  'name': 'Full name',
                  'organisation': 'Organization',
                  'linkedin': 'LinkedIn URL',
                  'city': 'City',
                  'state': 'State',
                  'focus_areas': 'Focus areas',
                  'preferred_startup_stage': 'Preferred startup stage'
                };
                
                field = fieldMap[field] || field;
                
                // Make error messages more user-friendly
                if (message.includes('field required')) {
                  message = `${field} is required`;
                } else if (message.includes('value is not a valid email')) {
                  message = `${field} must be a valid email address`;
                } else if (message.includes('value is not a valid phone')) {
                  message = `${field} must be a valid phone number`;
                } else if (message.includes('ensure this value has at least')) {
                  message = `${field} is too short`;
                } else if (message.includes('ensure this value has at most')) {
                  message = `${field} is too long`;
                }
                
                return `• ${message}`;
              });
              errorMessage += '\n' + errorList.join('\n');
            } else {
              errorMessage += '\n• ' + error.detail;
            }
          } else {
            errorMessage += '\n• Please check your form data';
          }
          setSubmitMessage(errorMessage);
        } else {
          setSubmitMessage(`Error: ${error.detail || 'Something went wrong. Please try again.'}`);
        }
      }
    } catch (error) {
      console.error('❌ Error submitting mentor form:', error);
      setSubmitMessage('Error: Could not connect to server');
    } finally {
      console.log('🏁 Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitMessage('');
      setCurrentStep(1);
      onClose();
    }
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Success Banner */}
            {submitMessage && submitMessage.includes('✅') && (
              <div className="bg-green-50 border-b border-green-200 p-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-800 font-medium">Form submitted successfully!</span>
                </div>
              </div>
            )}
            
            {/* Error Banner */}
            {submitMessage && !submitMessage.includes('✅') && (
              <div className="bg-red-50 border-b border-red-200 p-4">
                <div className="flex items-start justify-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Please fix the following issues:</h3>
                    <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                      {submitMessage.replace('Please fix the following issues:', '')}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => setSubmitMessage('')}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 
                    className="text-lg md:text-2xl font-bold text-gray-900"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 700
                    }}
                  >
                    CoFounder Circle Registration
                  </h2>
                  <p 
                    className="text-gray-600 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 400
                    }}
                  >
                    Complete your profile in 2 simple steps
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-full h-full" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 relative overflow-y-auto max-h-[calc(90vh-120px)]">
              <MentorMultiStepForm
                userId="temp-user-id" // This will be replaced with actual user ID
                onComplete={handleComplete}
                onStepChange={handleStepChange}
              />
              
              {/* Debug: Show submitMessage for debugging */}
              {submitMessage && (
                <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs">
                  Debug - submitMessage: "{submitMessage}" | Length: {submitMessage.length} | Contains ✅: {submitMessage.includes('✅') ? 'YES' : 'NO'}
                </div>
              )}

              {/* Error Message */}
              {submitMessage && submitMessage.includes('Error') && (
                <div className="p-4 rounded-lg mb-6 bg-red-100 text-red-700">
                  {submitMessage}
                </div>
              )}
            </div>
            
            {/* Success Message Overlay - Moved outside content div for better mobile coverage */}
            {submitMessage && submitMessage.includes('✅') && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-50 rounded-2xl shadow-lg">
                <div className="text-center p-6 max-w-sm mx-auto">
                  <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4" />
                  <h3 
                    className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 700
                    }}
                  >
                    Form Submitted Successfully!
                  </h3>
                  <p 
                    className="text-gray-600 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 400
                    }}
                  >
                    Thank you for registering with CoFounder Circle. We'll be in touch soon!
                  </p>
                  <div className="mt-4 text-xs text-gray-500">
                    This window will close automatically...
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 