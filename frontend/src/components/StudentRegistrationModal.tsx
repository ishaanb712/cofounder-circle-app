'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, CheckCircle, PartyPopper } from 'lucide-react';
import StudentMultiStepForm from './StudentMultiStepForm';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentRegistrationModal({ isOpen, onClose }: StudentRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Debug success dialog state changes
  useEffect(() => {
    console.log('🎭 Success dialog state changed:', showSuccessDialog);
  }, [showSuccessDialog]);

  const handleComplete = async (formData: any) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare the data according to the backend schema
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: parseInt(formData.phone), // Convert to integer as required by backend
        college: formData.college,
        year: formData.year,
        course: formData.course,
        city: formData.city,
        career_goals: formData.career_goals || [],
        interest_area: formData.interest_area || [],
        interest_level: formData.interest_level,
        resume_url: formData.resume_url || null,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null,
        portfolio_url: formData.portfolio_url || null,
        availability: formData.availability,
        payment_terms: formData.payment_terms,
        location_preference: formData.location_preference,
        extra_text: formData.extra_text || null
      };

      console.log('Sending student data:', requestData);
      console.log('Request data JSON:', JSON.stringify(requestData, null, 2));
      
      // Comprehensive validation
      const validationErrors = [];
      
      // Required fields validation
      const requiredFields = ['name', 'email', 'phone', 'college', 'year', 'course', 'city'];
      const missingFields = requiredFields.filter(field => !requestData[field as keyof typeof requestData]);
      if (missingFields.length > 0) {
        validationErrors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (requestData.email && !emailRegex.test(requestData.email)) {
        validationErrors.push('Please enter a valid email address');
      }
      
      // Phone number validation (10 digits)
      const phoneNumber = parseInt(formData.phone);
      if (isNaN(phoneNumber) || formData.phone.length !== 10) {
        validationErrors.push('Phone number must be exactly 10 digits');
      }
      
      // URL validation for optional links
      const urlRegex = /^https?:\/\/.+/;
      if (formData.linkedin_url && !urlRegex.test(formData.linkedin_url)) {
        validationErrors.push('LinkedIn URL must start with http:// or https://');
      }
      if (formData.github_url && !urlRegex.test(formData.github_url)) {
        validationErrors.push('GitHub URL must start with http:// or https://');
      }
      if (formData.portfolio_url && !urlRegex.test(formData.portfolio_url)) {
        validationErrors.push('Portfolio URL must start with http:// or https://');
      }
      if (formData.resume_url && !urlRegex.test(formData.resume_url)) {
        validationErrors.push('Resume URL must start with http:// or https://');
      }
      
      // Year validation
      const currentYear = new Date().getFullYear();
      if (requestData.year < 2020 || requestData.year > currentYear + 5) {
        validationErrors.push(`Year must be between 2020 and ${currentYear + 5}`);
      }
      
      if (validationErrors.length > 0) {
        setSubmitMessage(`Validation errors: ${validationErrors.join(', ')}`);
        return;
      }
      
      // Log each field for debugging
      console.log('Field validation:');
      requiredFields.forEach(field => {
        console.log(`${field}: ${requestData[field as keyof typeof requestData]} (type: ${typeof requestData[field as keyof typeof requestData]})`);
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        console.log('✅ Form submitted successfully! Showing success dialog...');
        setShowSuccessDialog(true);
        setTimeout(() => {
          console.log('⏰ Success dialog timeout - closing modal');
          setShowSuccessDialog(false);
          onClose();
          setSubmitMessage('');
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        console.error('Error details:', JSON.stringify(errorData, null, 2));
        
        // Handle validation errors more specifically
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
    setSubmitMessage('');
    setCurrentStep(1);
    onClose();
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
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
              className="relative bg-white rounded-2xl shadow-2xl max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
              style={{
                maxWidth: 'calc(100vw - 32px)',
                margin: '16px',
                maxHeight: 'calc(100vh - 32px)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
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
                      className="text-sm md:text-base text-gray-600"
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
                  <X className="w-5 h-5 md:w-6 md:h-6" />
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
                <StudentMultiStepForm
                  userId="temp-user-id" // This will be replaced with actual user ID
                  onComplete={handleComplete}
                  onStepChange={handleStepChange}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <div key="success-dialog" className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Success Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-6 md:p-8 text-center z-[10000]"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
              >
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 
                  className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3"
                  style={{
                    fontFamily: 'var(--font-montserrat), sans-serif',
                    fontWeight: 900
                  }}
                >
                  Form Submitted Successfully!
                </h3>
                <p 
                  className="text-gray-600 mb-4 md:mb-6"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500
                  }}
                >
                  Thank you for registering with CoFounder Circle. We'll be in touch soon!
                </p>
              </motion.div>

              {/* Celebration Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <PartyPopper className="w-6 h-6 text-yellow-500 animate-bounce" />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
} 