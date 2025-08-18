'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import LocationDropdown from './LocationDropdown';
import YearsDropdown from './YearsDropdown';
// import { updateUserProfile } from '@/lib/firebase';

interface WorkingProfessionalFormData {
  // Step 1: Personal & Career Info
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  years_of_experience: number;
  role: string;
  company: string;
  linkedin: string;
  
  // Step 2: Startup Interest
  startup_interest: string[];
  startup_exposure: string[];
  
  // Step 3: Skills & Domains
  functional_expertise: string[];
  industry_knowledge: string[];
  resume_url: string;
  
  // Step 4: Preferences
  availability: string;
  compensation_model: string;
  stage_preference: string[];
}

interface WorkingProfessionalMultiStepFormProps {
  userId: string;
  initialData?: Partial<WorkingProfessionalFormData>;
  onComplete?: (data: WorkingProfessionalFormData) => Promise<void>;
  onStepChange?: (step: number) => void;
}

const STARTUP_INTEREST_OPTIONS = [
  'Join a startup',
  'Start a startup',
  'Advise/mentor startups',
  'Explore consulting/freelance gigs',
  'Invest later'
];

const STARTUP_EXPOSURE_OPTIONS = [
  'Worked at a startup',
  'Built something on the side',
  'Curious to learn/start'
];

const FUNCTIONAL_EXPERTISE_OPTIONS = [
  'Marketing',
  'Product',
  'Tech',
  'Finance',
  'Operations',
  'Sales',
  'Design',
  'HR',
  'Legal',
  'Other'
];

const INDUSTRY_KNOWLEDGE_OPTIONS = [
  'D2C',
  'SaaS',
  'Fintech',
  'Healthcare',
  'E-commerce',
  'EdTech',
  'AI/ML',
  'Blockchain',
  'Real Estate',
  'Other'
];

const AVAILABILITY_OPTIONS = [
  'Full-time',
  'Part-time',
  'Advisory',
  'Freelance'
];

const COMPENSATION_MODEL_OPTIONS = [
  'Equity',
  'Cash',
  'Both',
  'Open'
];

const STAGE_PREFERENCE_OPTIONS = [
  'Idea',
  'MVP',
  'Scaling',
  'Funded'
];

export default function WorkingProfessionalMultiStepForm({
  userId,
  initialData = {},
  onComplete,
  onStepChange
}: WorkingProfessionalMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const totalSteps = 4;

  const [formData, setFormData] = useState<WorkingProfessionalFormData>({
    // Step 1: Personal & Career Info
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    years_of_experience: 0,
    role: '',
    company: '',
    linkedin: '',
    
    // Step 2: Startup Interest
    startup_interest: [],
    startup_exposure: [],
    
    // Step 3: Skills & Domains
    functional_expertise: [],
    industry_knowledge: [],
    resume_url: '',
    
    // Step 4: Preferences
    availability: '',
    compensation_model: '',
    stage_preference: [],
    
    ...initialData
  });

  const updateFormData = (field: keyof WorkingProfessionalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Real-time validation functions
  const validateField = (field: keyof WorkingProfessionalFormData, value: any): string => {
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
      case 'city':
        if (!value || value.trim().length === 0) {
          return 'Please enter your city';
        }
        break;
      case 'role':
        if (!value || value.trim().length === 0) {
          return 'Please enter your role';
        }
        break;
      case 'company':
        if (!value || value.trim().length === 0) {
          return 'Please enter your company';
        }
        break;
      case 'linkedin':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        break;
      case 'resume_url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        break;
      case 'startup_interest':
        if (!value || value.length === 0) {
          return 'Please select at least one startup interest';
        }
        break;
      case 'startup_exposure':
        if (!value || value.length === 0) {
          return 'Please select at least one startup exposure';
        }
        break;
      case 'functional_expertise':
        if (!value || value.length === 0) {
          return 'Please select at least one functional expertise';
        }
        break;
      case 'industry_knowledge':
        if (!value || value.length === 0) {
          return 'Please select at least one industry knowledge';
        }
        break;
      case 'availability':
        if (!value || value.trim().length === 0) {
          return 'Please select your availability';
        }
        break;
      case 'compensation_model':
        if (!value || value.trim().length === 0) {
          return 'Please select your compensation model';
        }
        break;
      case 'stage_preference':
        if (!value || value.length === 0) {
          return 'Please select at least one stage preference';
        }
        break;
    }
    return '';
  };

  const handleFieldChange = (field: keyof WorkingProfessionalFormData, value: any) => {
    updateFormData(field, value);
    
    // Validate the field in real-time
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
      // setProgress(prev => ({
      //   ...prev,
      //   [step]: 'completed'
      // }));
      
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
    // If canProceed is false, don't proceed (real-time validation handles this)
    if (!canProceed()) {
      return;
    }

    // Clear any remaining errors
    setFormErrors({});

    if (currentStep < totalSteps) {
      // Save current step progress
      const stepData = getStepData(currentStep);
      await saveStepProgress(getStepKey(currentStep), stepData);
      
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete the form
      console.log('🚀 Starting working professional form submission...');
      setIsSubmitting(true);
      try {
        await saveStepProgress('preferences', getStepData(4));
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
      setCurrentStep(prev => prev - 1);
    }
  };

  const getStepKey = (step: number): string => {
    const stepKeys = ['personal_career', 'startup_interest', 'skills_domains', 'preferences'];
    return stepKeys[step - 1];
  };

  const getStepData = (step: number): any => {
    switch (step) {
      case 1:
        return {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          state: formData.state,
          years_of_experience: formData.years_of_experience,
          role: formData.role,
          company: formData.company,
          linkedin: formData.linkedin
        };
      case 2:
        return {
          startup_interest: formData.startup_interest,
          startup_exposure: formData.startup_exposure
        };
      case 3:
        return {
          functional_expertise: formData.functional_expertise,
          industry_knowledge: formData.industry_knowledge,
          resume_url: formData.resume_url
        };
      case 4:
        return {
          availability: formData.availability,
          compensation_model: formData.compensation_model,
          stage_preference: formData.stage_preference
        };
      default:
        return {};
    }
  };

  const canProceed = (): boolean => {
    // Check if there are any current validation errors
    if (Object.keys(formErrors).some(key => formErrors[key])) {
      return false;
    }

    switch (currentStep) {
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        return Boolean(
          formData.name && 
          formData.name.trim().length >= 2 &&
          formData.email && 
          emailRegex.test(formData.email) &&
          formData.phone && 
          phoneRegex.test(formData.phone) &&
          formData.city && 
          formData.city.trim().length > 0 &&
          formData.role && 
          formData.role.trim().length > 0 &&
          formData.company && 
          formData.company.trim().length > 0
        );
      case 2:
        return Boolean(
          formData.startup_interest.length > 0 && 
          formData.startup_exposure.length > 0
        );
      case 3:
        return Boolean(
          formData.functional_expertise.length > 0 && 
          formData.industry_knowledge.length > 0
        );
      case 4:
        return Boolean(
          formData.availability && 
          formData.compensation_model && 
          formData.stage_preference.length > 0
        );
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalCareerStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      case 2:
        return <StartupInterestStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      case 3:
        return <SkillsDomainsStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      case 4:
        return <PreferencesStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Progress Bar */}
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <div className="flex space-x-2 mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i + 1}
              className={`w-3 h-3 rounded-full ${
                i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
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
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6 md:mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors ${
            !canProceed() || isSubmitting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : currentStep === totalSteps ? (
            'Submit'
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  );
}

// Step 1: Personal & Career Info
function PersonalCareerStep({ 
  formData, 
  updateFormData,
  handleFieldChange,
  errors
}: { 
  formData: WorkingProfessionalFormData; 
  updateFormData: (field: keyof WorkingProfessionalFormData, value: any) => void;
  handleFieldChange: (field: keyof WorkingProfessionalFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{
            fontFamily: 'var(--font-montserrat), sans-serif',
            fontWeight: 700
          }}
        >
          Personal & Career Information
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Tell us about your professional background and experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your full name"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.name}</p>}
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
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your email"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.email}</p>}
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
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your phone number"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.phone}</p>}
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
            onChange={(city: string) => handleFieldChange('city', city)}
            placeholder="Select your city"
            className="w-full"
            type="all"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.city}</p>}
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
            onChange={(state: string) => handleFieldChange('state', state)}
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
            Years of Experience *
          </label>
          <YearsDropdown
            value={formData.years_of_experience}
            onChange={(years) => handleFieldChange('years_of_experience', years)}
            placeholder="Select years of experience"
            className="w-full"
            startYear={1}
            endYear={10}
          />
          {errors.years_of_experience && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.years_of_experience}</p>}
        </div>
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
            Current Role *
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => handleFieldChange('role', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="e.g., Senior Product Manager"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.role && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.role}</p>}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Company *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleFieldChange('company', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="e.g., Google"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.company && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.company}</p>}
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
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
            placeholder="https://linkedin.com/in/..."
          />
          {errors.linkedin && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.linkedin}</p>}
        </div>
      </div>
    </div>
  );
}

// Step 2: Startup Interest
function StartupInterestStep({ 
  formData, 
  updateFormData,
  handleFieldChange,
  errors
}: { 
  formData: WorkingProfessionalFormData; 
  updateFormData: (field: keyof WorkingProfessionalFormData, value: any) => void;
  handleFieldChange: (field: keyof WorkingProfessionalFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  const toggleArrayItem = (field: 'startup_interest' | 'startup_exposure', value: string) => {
    const currentArray = formData[field] as string[];
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
            fontWeight: 700
          }}
        >
          Startup Interest & Exposure
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Tell us about your startup interests and experience
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
            What interests you about startups? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STARTUP_INTEREST_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleArrayItem('startup_interest', option)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.startup_interest.includes(option)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          {errors.startup_interest && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.startup_interest}</p>}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            What's your startup exposure? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STARTUP_EXPOSURE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleArrayItem('startup_exposure', option)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.startup_exposure.includes(option)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          {errors.startup_exposure && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.startup_exposure}</p>}
        </div>
      </div>
    </div>
  );
}

// Step 3: Skills & Domains
function SkillsDomainsStep({ 
  formData, 
  updateFormData,
  handleFieldChange,
  errors
}: { 
  formData: WorkingProfessionalFormData; 
  updateFormData: (field: keyof WorkingProfessionalFormData, value: any) => void;
  handleFieldChange: (field: keyof WorkingProfessionalFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  const toggleArrayItem = (field: 'functional_expertise' | 'industry_knowledge', value: string) => {
    const currentArray = formData[field] as string[];
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
            fontWeight: 700
          }}
        >
          Skills & Domain Expertise
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Tell us about your functional expertise and industry knowledge
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
            Functional Expertise *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FUNCTIONAL_EXPERTISE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleArrayItem('functional_expertise', option)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.functional_expertise.includes(option)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          {errors.functional_expertise && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.functional_expertise}</p>}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Industry Knowledge *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INDUSTRY_KNOWLEDGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleArrayItem('industry_knowledge', option)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.industry_knowledge.includes(option)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          {errors.industry_knowledge && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.industry_knowledge}</p>}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Resume URL
          </label>
          <input
            type="url"
            value={formData.resume_url}
            onChange={(e) => handleFieldChange('resume_url', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="https://drive.google.com/..."
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.resume_url && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.resume_url}</p>}
        </div>
      </div>
    </div>
  );
}

// Step 4: Preferences
function PreferencesStep({ 
  formData, 
  updateFormData,
  handleFieldChange,
  errors
}: { 
  formData: WorkingProfessionalFormData; 
  updateFormData: (field: keyof WorkingProfessionalFormData, value: any) => void;
  handleFieldChange: (field: keyof WorkingProfessionalFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  const toggleArrayItem = (field: 'stage_preference', value: string) => {
    const currentArray = formData[field] as string[];
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
            fontWeight: 700
          }}
        >
          Engagement Preferences
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Tell us about your availability and preferences
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
            Availability *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABILITY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleFieldChange('availability', option)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.availability === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          {errors.availability && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.availability}</p>}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Compensation Model *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMPENSATION_MODEL_OPTIONS.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => handleFieldChange('compensation_model', model)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.compensation_model === model
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {model}
              </button>
            ))}
          </div>
          {errors.compensation_model && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.compensation_model}</p>}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Stage Preference *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STAGE_PREFERENCE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggleArrayItem('stage_preference', option)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.stage_preference.includes(option)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
          {errors.stage_preference && <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.stage_preference}</p>}
        </div>
      </div>
    </div>
  );
} 