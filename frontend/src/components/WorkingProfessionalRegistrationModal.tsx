'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, CheckCircle } from 'lucide-react';
import WorkingProfessionalMultiStepForm from './WorkingProfessionalMultiStepForm';
import { generateSecureUUID } from '@/lib/utils';

interface WorkingProfessionalRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkingProfessionalRegistrationModal({ isOpen, onClose }: WorkingProfessionalRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleComplete = async (formData: any): Promise<void> => {
    console.log('🚀 Starting working professional form submission...');
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
        city: formData.city || undefined,
        state: formData.state || undefined,
        role: formData.role || undefined,
        company: formData.company || undefined,
        linkedin: formData.linkedin || undefined,
        resume_url: formData.resume_url || undefined,
        availability: formData.availability || undefined,
        compensation_model: formData.compensation_model || undefined,
        // Ensure arrays are not empty
        startup_interest: formData.startup_interest?.length > 0 ? formData.startup_interest : undefined,
        startup_exposure: formData.startup_exposure?.length > 0 ? formData.startup_exposure : undefined,
        functional_expertise: formData.functional_expertise?.length > 0 ? formData.functional_expertise : undefined,
        industry_knowledge: formData.industry_knowledge?.length > 0 ? formData.industry_knowledge : undefined,
        stage_preference: formData.stage_preference?.length > 0 ? formData.stage_preference : undefined,
        // Ensure years_of_experience is a number
        years_of_experience: typeof formData.years_of_experience === 'number' ? formData.years_of_experience : 0
      };
      
      const requestBody = {
        ...cleanedFormData,
        user_id: userId
      };
      
      console.log('📤 Request body being sent:', requestBody);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/working-professionals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response status:', response.status);
      
      if (response.ok) {
        console.log('✅ Working professional form submitted successfully! Showing success message...');
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
        console.log('❌ Error response:', error);
        
        // Handle validation errors specifically
        if (response.status === 422) {
          let errorMessage = 'Validation error: ';
          if (error.detail) {
            if (Array.isArray(error.detail)) {
              errorMessage += error.detail.map((err: any) => err.msg).join(', ');
            } else {
              errorMessage += error.detail;
            }
          } else {
            errorMessage += 'Please check your form data';
          }
          setSubmitMessage(`Error: ${errorMessage}`);
        } else {
          setSubmitMessage(`Error: ${error.detail || 'Something went wrong'}`);
        }
      }
    } catch (error) {
      console.error('❌ Error submitting working professional form:', error);
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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
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
                    Complete the form in 4 steps
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
            <div className="p-4 md:p-6">
              {/* Success Message Only - Hide errors from users */}
              {submitMessage && submitMessage.includes('✅') && (
                <div className="p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-sm md:text-base bg-green-100 text-green-700">
                  {submitMessage}
                </div>
              )}

              {/* Multi-Step Form */}
              <WorkingProfessionalMultiStepForm
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