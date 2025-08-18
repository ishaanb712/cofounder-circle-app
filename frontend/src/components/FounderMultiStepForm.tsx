'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Building2, Mail, Phone, MapPin, Linkedin, Globe, FileText, Users, Lightbulb, TrendingUp, Star } from 'lucide-react';
import LocationDropdown from './LocationDropdown';

interface FounderFormData {
  // Page 1: Founder Details
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedin: string;
  
  // Page 2: Startup Status
  startup_status: string;
  startup_name: string;
  startup_url: string;
  description: string;
  elevator_pitch: string;
  
  // Page 3: Help Needed
  help_needed: string[];
  
  // Page 4: Category
  category: string[];
}

interface FounderMultiStepFormProps {
  userId: string;
  initialData?: Partial<FounderFormData>;
  onComplete?: (data: FounderFormData) => Promise<void>;
  onStepChange?: (step: number) => void;
}

const STARTUP_STATUS_OPTIONS = [
  'Just an idea',
  'Prototype/MVP',
  'Paying users',
  'Raised funding'
];

const HELP_NEEDED_OPTIONS = [
  'Finding a cofounder',
  'Finding vendors (tech, design, branding, etc.)',
  'Finding early team/interns',
  'Getting feedback on my idea',
  'Getting incubated',
  'Fundraising',
  'Others'
];

const CATEGORY_OPTIONS = [
  'D2C',
  'SaaS',
  'Fintech',
  'Edtech',
  'Creator',
  'AI',
  'Climate',
  'Health',
  'E-commerce',
  'Gaming',
  'Real Estate',
  'Transportation',
  'Food & Beverage',
  'Fashion',
  'Entertainment',
  'Other'
];

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

const validateURL = (url: string): boolean => {
  if (!url) return true; // Optional field
  const urlRegex = /^https?:\/\/.+/;
  return urlRegex.test(url);
};

const formatPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 10);
};

const validateField = (field: string, value: string): string => {
  switch (field) {
    case 'email':
      return validateEmail(value) ? '' : 'Please enter a valid email address';
    case 'phone':
      return validatePhone(value) ? '' : 'Please enter a 10-digit phone number';
    case 'linkedin':
      return validateURL(value) ? '' : 'Please enter a valid URL starting with http:// or https://';
    case 'startup_url':
      return validateURL(value) ? '' : 'Please enter a valid URL starting with http:// or https://';
    default:
      return '';
  }
};

export default function FounderMultiStepForm({
  userId,
  initialData = {},
  onComplete,
  onStepChange
}: FounderMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FounderFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    linkedin: '',
    startup_status: '',
    startup_name: '',
    startup_url: '',
    description: '',
    elevator_pitch: '',
    help_needed: [],
    category: [],
    ...initialData
  });

  const updateFormData = (field: keyof FounderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      onStepChange?.(currentStep + 1);
    } else {
      // Complete the form
      console.log('🚀 Starting form submission...');
      setIsSubmitting(true);
      try {
        if (onComplete) {
          console.log('📤 Calling onComplete with form data:', formData);
          await onComplete(formData);
          console.log('✅ onComplete completed successfully');
        }
      } catch (error) {
        console.error('❌ Error submitting form:', error);
      } finally {
        console.log('🏁 Setting isSubmitting to false');
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.name && formData.email && formData.phone && formData.city);
      case 2:
        return Boolean(formData.startup_status && formData.description);
      case 3:
        return formData.help_needed.length > 0;
      case 4:
        return formData.category.length > 0;
      default:
        return false;
    }
  };

  const toggleArrayItem = (field: 'help_needed' | 'category', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const addOtherItem = (field: 'help_needed' | 'category', otherText: string) => {
    if (otherText.trim()) {
      const currentArray = formData[field];
      // Remove "Others" or "Other" if it exists and add the custom text
      const filteredArray = currentArray.filter(item => item !== 'Others' && item !== 'Other');
      const newArray = [...filteredArray, otherText.trim()];
      updateFormData(field, newArray);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FounderDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <StartupStatusStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <HelpNeededStep formData={formData} updateFormData={updateFormData} toggleArrayItem={toggleArrayItem} addOtherItem={addOtherItem} />;
      case 4:
        return <CategoryStep formData={formData} updateFormData={updateFormData} toggleArrayItem={toggleArrayItem} addOtherItem={addOtherItem} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <div className="flex space-x-2 mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i + 1}
              className={`w-3 h-3 rounded-full ${
                i + 1 <= currentStep ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <div 
          className="text-center text-sm text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Step {currentStep} of {totalSteps}
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

// Page 1: Founder Details
function FounderDetailsStep({ 
  formData, 
  updateFormData 
}: { 
  formData: FounderFormData; 
  updateFormData: (field: keyof FounderFormData, value: any) => void;
}) {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleFieldChange = (field: keyof FounderFormData, value: string) => {
    updateFormData(field, value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldBlur = (field: keyof FounderFormData, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    updateFormData('phone', formatted);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 900
          }}
        >
          Founder Details
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Tell us about yourself
        </p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
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
          {errors.name && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={(e) => handleFieldBlur('email', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="your.email@example.com"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {errors.email}
            </p>
          )}
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
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={(e) => handleFieldBlur('phone', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="1234567890"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {errors.phone}
            </p>
          )}
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
          <LocationDropdown
            value={formData.city}
            onChange={(city: string) => updateFormData('city', city)}
            placeholder="Select your city"
            className="w-full"
            type="all"
          />
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
          <LocationDropdown
            value={formData.state}
            onChange={(state: string) => updateFormData('state', state)}
            placeholder="Select your state"
            className="w-full"
            type="state"
            country="India"
          />
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            LinkedIn Profile URL (Optional)
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => updateFormData('linkedin', e.target.value)}
            onBlur={(e) => handleFieldBlur('linkedin', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.linkedin ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://linkedin.com/in/yourprofile"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.linkedin && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {errors.linkedin}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Page 2: Startup Status
function StartupStatusStep({ 
  formData, 
  updateFormData 
}: { 
  formData: FounderFormData; 
  updateFormData: (field: keyof FounderFormData, value: any) => void;
}) {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleFieldChange = (field: keyof FounderFormData, value: string) => {
    updateFormData(field, value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldBlur = (field: keyof FounderFormData, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 900
          }}
        >
          Startup Status
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Tell us about your startup journey
        </p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            I have: *
          </label>
          <div className="space-y-2 md:space-y-3">
            {STARTUP_STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateFormData('startup_status', status)}
                className={`w-full p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.startup_status === status
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {status}
              </button>
            ))}
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
            Startup Name (if any)
          </label>
          <input
            type="text"
            value={formData.startup_name}
            onChange={(e) => updateFormData('startup_name', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base border-gray-300 focus:ring-indigo-500"
            placeholder="Your startup name"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Website (if available)
          </label>
          <input
            type="url"
            value={formData.startup_url}
            onChange={(e) => handleFieldChange('startup_url', e.target.value)}
            onBlur={(e) => handleFieldBlur('startup_url', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              errors.startup_url ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://yourstartup.com"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.startup_url && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {errors.startup_url}
            </p>
          )}
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Describe your idea/startup in one line *
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base border-gray-300 focus:ring-indigo-500"
            placeholder="Brief description of your startup"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Elevator Pitch (max 300 characters)
          </label>
          <textarea
            value={formData.elevator_pitch}
            onChange={(e) => updateFormData('elevator_pitch', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base border-gray-300 focus:ring-indigo-500"
            placeholder="Your elevator pitch..."
            rows={4}
            maxLength={300}
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.elevator_pitch.length}/300 characters
          </div>
        </div>
      </div>
    </div>
  );
}

// Page 3: Help Needed
function HelpNeededStep({ 
  formData, 
  updateFormData,
  toggleArrayItem,
  addOtherItem
}: { 
  formData: FounderFormData; 
  updateFormData: (field: keyof FounderFormData, value: any) => void;
  toggleArrayItem: (field: 'help_needed' | 'category', value: string) => void;
  addOtherItem: (field: 'help_needed' | 'category', otherText: string) => void;
}) {
  const [otherText, setOtherText] = useState('');

  const handleOtherSubmit = () => {
    if (otherText.trim()) {
      addOtherItem('help_needed', otherText);
      setOtherText('');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 900
          }}
        >
          What do you need help with?
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Select all that apply
        </p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Help Needed (multi-select) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {HELP_NEEDED_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleArrayItem('help_needed', option)}
                className={`p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.help_needed.includes(option)
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
          
          {/* Others text field */}
          {formData.help_needed.includes('Others') && (
            <div className="mt-4">
              <label 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500
                }}
              >
                Please specify:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleOtherSubmit()}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base border-gray-300 focus:ring-indigo-500"
                  placeholder="Describe what you need help with"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                />
                <button
                  type="button"
                  onClick={handleOtherSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Page 4: Category
function CategoryStep({ 
  formData, 
  updateFormData,
  toggleArrayItem,
  addOtherItem
}: { 
  formData: FounderFormData; 
  updateFormData: (field: keyof FounderFormData, value: any) => void;
  toggleArrayItem: (field: 'help_needed' | 'category', value: string) => void;
  addOtherItem: (field: 'help_needed' | 'category', otherText: string) => void;
}) {
  const [otherText, setOtherText] = useState('');

  const handleOtherSubmit = () => {
    if (otherText.trim()) {
      addOtherItem('category', otherText);
      setOtherText('');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 900
          }}
        >
          Category / Industry
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Select all that apply
        </p>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Category (multi-select) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleArrayItem('category', category)}
                className={`p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.category.includes(category)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Others text field */}
          {formData.category.includes('Other') && (
            <div className="mt-4">
              <label 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500
                }}
              >
                Please specify:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleOtherSubmit()}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base border-gray-300 focus:ring-indigo-500"
                  placeholder="Describe your category/industry"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                />
                <button
                  type="button"
                  onClick={handleOtherSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 500
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 