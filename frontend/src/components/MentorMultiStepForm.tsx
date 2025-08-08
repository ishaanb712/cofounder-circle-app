'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
// import { updateUserProfile } from '@/lib/firebase';

interface MentorFormData {
  // Step 1: Basic Details
  name: string;
  email: string;
  phone: string;
  organisation: string;
  url: string;
  linkedin: string;
  city: string;
  state: string;
  
  // Step 2: Incubator Profile
  incubator_type: string;
  focus_areas: string[];
  preferred_startup_stage: string[];
}

interface MentorMultiStepFormProps {
  userId: string;
  initialData?: Partial<MentorFormData>;
  onComplete?: (data: MentorFormData) => Promise<void>;
  onStepChange?: (step: number) => void;
}

const INCUBATOR_TYPE_OPTIONS = [
  'Incubator',
  'Accelerator',
  'Grant Program',
  'Bootcamp/Workshop',
  'Startup Studio',
  'Other'
];

const FOCUS_AREAS_OPTIONS = [
  'D2C',
  'SaaS',
  'Climate',
  'Social Impact',
  'Fintech',
  'Healthtech',
  'EdTech',
  'AI/ML',
  'Blockchain',
  'E-commerce',
  'Manufacturing',
  'Agriculture',
  'Clean Energy',
  'Other'
];

const STARTUP_STAGE_OPTIONS = [
  'Idea stage',
  'MVP',
  'Early Revenue',
  'Scaling',
  'Sector-specific'
];

export default function MentorMultiStepForm({
  userId,
  initialData = {},
  onComplete,
  onStepChange
}: MentorMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // State for "Other" text inputs
  const [otherIncubatorType, setOtherIncubatorType] = useState('');
  const [otherFocusArea, setOtherFocusArea] = useState('');
  
  const [formData, setFormData] = useState<MentorFormData>({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    url: '',
    linkedin: '',
    city: '',
    state: '',
    incubator_type: '',
    focus_areas: [],
    preferred_startup_stage: [],
    ...initialData
  });

  const [progress, setProgress] = useState({
    basic_details: 'not_started',
    incubator_profile: 'not_started'
  });

  const totalSteps = 2;

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const updateFormData = (field: keyof MentorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Real-time validation functions
  const validateField = (field: keyof MentorFormData, value: any): string => {
    switch (field) {
      case 'name':
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        // Additional check for invalid characters
        if (value && /[`'"]/.test(value)) {
          return 'Email address contains invalid characters';
        }
        break;
      case 'phone':
        if (!value || !/^\d{10}$/.test(value)) {
          return 'Please enter a valid 10-digit phone number';
        }
        break;
      case 'organisation':
        if (!value || value.trim().length === 0) {
          return 'Please enter your organisation';
        }
        break;
      case 'city':
        if (!value || value.trim().length === 0) {
          return 'Please enter your city';
        }
        break;
      case 'url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        break;
      case 'linkedin':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        break;
      case 'incubator_type':
        if (!value || value.trim().length === 0) {
          return 'Please select an incubator type';
        }
        break;
      case 'focus_areas':
        if (!value || value.length === 0) {
          return 'Please select at least one focus area';
        }
        break;
      case 'preferred_startup_stage':
        if (!value || value.length === 0) {
          return 'Please select at least one startup stage';
        }
        break;
    }
    return '';
  };

  const handleFieldChange = (field: keyof MentorFormData, value: any) => {
    updateFormData(field, value);
    const error = validateField(field, value);
    if (error) {
      setFormErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Mock function to save step progress (Firebase commented out)
  const saveStepProgress = async (step: string, data: any) => {
    try {
      // Mock: Simulate saving progress
      console.log(`Mock: Saving progress for step ${step}:`, data);
      
      // Update local progress state
      setProgress(prev => ({
        ...prev,
        [step]: 'completed'
      }));
      
      // In real implementation, this would call Firebase:
      // await updateUserProfile(userId, {
      //   [`form_progress.${step}`]: 'completed',
      //   [step]: data
      // });
      
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      return;
    }

    if (currentStep === totalSteps) {
      if (onComplete) {
        setIsSubmitting(true);
        try {
          await onComplete(formData);
        } catch (error) {
          console.error('Error completing form:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getStepKey = (step: number): string => {
    const stepKeys = ['basic_details', 'incubator_profile'];
    return stepKeys[step - 1];
  };

  const getStepData = (step: number): any => {
    switch (step) {
      case 1:
        return {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organisation: formData.organisation,
          url: formData.url,
          linkedin: formData.linkedin,
          city: formData.city,
          state: formData.state
        };
      case 2:
        return {
          incubator_type: formData.incubator_type,
          focus_areas: formData.focus_areas,
          preferred_startup_stage: formData.preferred_startup_stage
        };
      default:
        return {};
    }
  };

  const canProceed = (): boolean => {
    // Check for validation errors first
    if (Object.keys(formErrors).some(key => formErrors[key])) {
      return false;
    }

    if (currentStep === 1) {
      return Boolean(
        formData.name && 
        formData.email && 
        formData.phone && 
        formData.organisation && 
        formData.city
      );
    }
    
    if (currentStep === 2) {
      return Boolean(
        formData.incubator_type && 
        formData.focus_areas.length > 0 && 
        formData.preferred_startup_stage.length > 0
      );
    }
    
    return false;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      case 2:
        return <IncubatorProfileStep 
          formData={formData} 
          updateFormData={updateFormData} 
          handleFieldChange={handleFieldChange} 
          errors={formErrors}
          otherIncubatorType={otherIncubatorType}
          setOtherIncubatorType={setOtherIncubatorType}
          otherFocusArea={otherFocusArea}
          setOtherFocusArea={setOtherFocusArea}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          {Array.from({ length: totalSteps }, (_, step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border-2 ${
                step < currentStep // Highlight current and previous steps
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {step < currentStep - 1 ? ( // Show checkmark for completed steps (before current)
                  <CheckCircle className="w-3 h-3 md:w-5 md:h-5" />
                ) : (
                  <span
                    className="text-xs md:text-sm font-medium"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 500
                    }}
                  >
                    {step + 1}
                  </span>
                )}
              </div>
              {step < totalSteps - 1 && (
                <div className={`w-6 md:w-12 h-0.5 md:h-1 mx-1 md:mx-2 ${
                  step < currentStep - 1 ? 'bg-indigo-600' : 'bg-gray-300' // Fill line for completed steps
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Step Indicator Text */}
        <div className="text-center mt-2 md:mt-3">
          <p 
            className="text-xs md:text-sm text-gray-600"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center px-3 md:px-6 py-2 md:py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          <ChevronLeft className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center px-3 md:px-6 py-2 md:py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base transition-all duration-200"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">{currentStep === totalSteps ? 'Submit' : 'Next'}</span>
              <span className="sm:hidden">{currentStep === totalSteps ? 'Submit' : 'Next'}</span>
              {currentStep !== totalSteps && <ChevronRight className="w-4 h-4 ml-1 md:ml-2" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Step 1: Basic Details
function BasicDetailsStep({ 
  formData, 
  updateFormData,
  handleFieldChange,
  errors
}: { 
  formData: MentorFormData; 
  updateFormData: (field: keyof MentorFormData, value: any) => void;
  handleFieldChange: (field: keyof MentorFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 900
          }}
        >
          Basic Details
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Tell us about yourself and your organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your full name"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="h-5 mt-1">
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your email"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="h-5 mt-1">
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your phone number"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="h-5 mt-1">
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Organization *
          </label>
          <input
            type="text"
            value={formData.organisation}
            onChange={(e) => handleFieldChange('organisation', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.organisation ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your organization"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="h-5 mt-1">
            {errors.organisation && <p className="text-red-500 text-sm">{errors.organisation}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your city"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="h-5 mt-1">
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.state ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your state"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Organization Website
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleFieldChange('url', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.url ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://your-organization.com"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="h-5 mt-1">
            {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleFieldChange('linkedin', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.linkedin ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://linkedin.com/in/your-profile"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="h-5 mt-1">
            {errors.linkedin && <p className="text-red-500 text-sm">{errors.linkedin}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Incubator Profile
function IncubatorProfileStep({ 
  formData, 
  updateFormData,
  handleFieldChange,
  errors,
  otherIncubatorType,
  setOtherIncubatorType,
  otherFocusArea,
  setOtherFocusArea
}: { 
  formData: MentorFormData; 
  updateFormData: (field: keyof MentorFormData, value: any) => void;
  handleFieldChange: (field: keyof MentorFormData, value: any) => void;
  errors: {[key: string]: string};
  otherIncubatorType: string;
  setOtherIncubatorType: (value: string) => void;
  otherFocusArea: string;
  setOtherFocusArea: (value: string) => void;
}) {
  const toggleArrayItem = (field: 'focus_areas' | 'preferred_startup_stage', value: string) => {
    const currentArray = formData[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFieldChange(field, newArray);
  };



  return (
    <div className="space-y-6">
      <div>
        <h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 900
          }}
        >
          Incubator Profile
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Tell us about your incubator program
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Incubator Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INCUBATOR_TYPE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (option === 'Other') {
                    handleFieldChange('incubator_type', 'Other');
                  } else {
                    handleFieldChange('incubator_type', option);
                  }
                }}
                className={`p-3 md:p-4 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.incubator_type === option
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {option}
              </button>
            ))}
          </div>
          
          {/* Other incubator type input */}
          {(formData.incubator_type === 'Other' || otherIncubatorType) && (
            <div className="mt-4">
              <label 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500
                }}
              >
                Please specify your incubator type:
              </label>
              <input
                type="text"
                value={otherIncubatorType}
                onChange={(e) => {
                  setOtherIncubatorType(e.target.value);
                  if (e.target.value.trim()) {
                    handleFieldChange('incubator_type', e.target.value);
                  } else {
                    handleFieldChange('incubator_type', 'Other');
                  }
                }}
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
                  errors.incubator_type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                placeholder="Enter your incubator type"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              />
            </div>
          )}
          
          <div className="h-5 mt-1">
            {errors.incubator_type && <p className="text-red-500 text-sm">{errors.incubator_type}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Focus Areas *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FOCUS_AREAS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (option === 'Other') {
                    toggleArrayItem('focus_areas', option);
                  } else {
                    toggleArrayItem('focus_areas', option);
                  }
                }}
                className={`p-3 md:p-4 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.focus_areas?.includes(option)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {option}
              </button>
            ))}
          </div>
          
          {/* Other focus area input */}
          {(formData.focus_areas?.includes('Other') || otherFocusArea) && (
            <div className="mt-4">
              <label 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500
                }}
              >
                Please specify your focus area:
              </label>
              <input
                type="text"
                value={otherFocusArea}
                onChange={(e) => {
                  setOtherFocusArea(e.target.value);
                  // Add the custom focus area to the array
                  const currentAreas = formData.focus_areas?.filter(area => area !== 'Other') || [];
                  if (e.target.value.trim()) {
                    handleFieldChange('focus_areas', [...currentAreas, e.target.value.trim()]);
                  } else {
                    // If empty, keep 'Other' in the array
                    handleFieldChange('focus_areas', [...currentAreas, 'Other']);
                  }
                }}
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
                  errors.focus_areas ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                }`}
                placeholder="Enter your focus area"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              />
            </div>
          )}
          
          <div className="h-5 mt-1">
            {errors.focus_areas && <p className="text-red-500 text-sm">{errors.focus_areas}</p>}
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Preferred Startup Stage *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {STARTUP_STAGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleArrayItem('preferred_startup_stage', option)}
                className={`p-3 md:p-4 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.preferred_startup_stage?.includes(option)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="h-5 mt-1">
            {errors.preferred_startup_stage && <p className="text-red-500 text-sm">{errors.preferred_startup_stage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
} 