'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';
// import { updateUserProfile } from '@/lib/firebase';

interface StudentFormData {
  // Step 1: Basic Info
  name: string;
  email: string;
  phone: string;
  college: string;
  year: number;
  course: string;
  city: string;
  
  // Step 2: Career Goals
  career_goals: string[];
  interest_area: string[];
  interest_level: string;
  
  // Step 3: Skills & Portfolio
  resume_url: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  
  // Step 4: Preferences
  availability: string;
  payment_terms: string;
  location_preference: string;
  extra_text: string;
}

interface StudentMultiStepFormProps {
  userId: string;
  initialData?: Partial<StudentFormData>;
  onComplete?: (data: StudentFormData) => void;
  onStepChange?: (step: number) => void;
}

const CAREER_GOALS_OPTIONS = [
  'Internship',
  'Project',
  'Job',
  'Side Hustle'
];

const INTEREST_AREAS = [
  'Marketing',
  'Product',
  'Tech',
  'Operations',
  'Design',
  'Other'
];

const INTEREST_LEVELS = [
  'Curious',
  'Already tried building one',
  'Want to join one'
];

const AVAILABILITY_OPTIONS = [
  '1-5 hours/week',
  '5-10 hours/week',
  '10-20 hours/week',
  '20+ hours/week'
];

const PAYMENT_TERMS = [
  'Paid only',
  'Unpaid only',
  'Both paid and unpaid'
];

const LOCATION_PREFERENCES = [
  'Remote only',
  'On-site only',
  'Hybrid',
  'No preference'
];

export default function StudentMultiStepForm({
  userId,
  initialData = {},
  onComplete,
  onStepChange
}: StudentMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    college: '',
    year: 2024,
    course: '',
    city: '',
    career_goals: [],
    interest_area: [],
    interest_level: '',
    resume_url: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    availability: '',
    payment_terms: '',
    location_preference: '',
    extra_text: '',
    ...initialData
  });

  const [progress, setProgress] = useState({
    basic_info: 'not_started',
    career_goals: 'not_started',
    skills_portfolio: 'not_started',
    preferences: 'not_started'
  });

  const totalSteps = 4;

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const updateFormData = (field: keyof StudentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Mock function to save step progress (Firebase commented out)
  const saveStepProgress = async (step: string, data: any) => {
    try {
      console.log(`Saving progress for step ${step}:`, data);
      
      // Update local progress state
      setProgress(prev => ({
        ...prev,
        [step]: 'completed'
      }));
      
      // Make API call to save progress
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://13.53.254.193:8000'}/api/students/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          step: step,
          data: data
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log(`Progress saved successfully for step ${step}`);
      
    } catch (error) {
      console.error('Error saving progress:', error);
      
      // For mobile, provide user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Unable to connect to server. Please check your internet connection and try again.');
        }
      }
      
      throw error;
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      // Save current step progress
      const stepData = getStepData(currentStep);
      try {
        setNetworkError(null);
        await saveStepProgress(getStepKey(currentStep), stepData);
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        console.error('Error saving step progress:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setNetworkError(errorMessage);
        // Show error to user (you could add a toast notification here)
        alert(`Error saving progress: ${errorMessage}`);
      }
    } else {
      // Complete the form
      setIsSubmitting(true);
      try {
        await saveStepProgress('preferences', getStepData(4));
        onComplete?.(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
        // Show error to user
        alert(`Error submitting form: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
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
    const stepKeys = ['basic_info', 'career_goals', 'skills_portfolio', 'preferences'];
    return stepKeys[step - 1];
  };

  const getStepData = (step: number): any => {
    switch (step) {
      case 1:
        return {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          year: formData.year,
          course: formData.course,
          city: formData.city
        };
      case 2:
        return {
          career_goals: formData.career_goals,
          interest_area: formData.interest_area,
          interest_level: formData.interest_level
        };
      case 3:
        return {
          resume_url: formData.resume_url,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          portfolio_url: formData.portfolio_url
        };
      case 4:
        return {
          availability: formData.availability,
          payment_terms: formData.payment_terms,
          location_preference: formData.location_preference,
          extra_text: formData.extra_text
        };
      default:
        return {};
    }
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.name && formData.email && formData.phone && 
               formData.college && formData.course && formData.city);
      case 2:
        return formData.career_goals.length > 0 && 
               formData.interest_area.length > 0 && 
               Boolean(formData.interest_level);
      case 3:
        return true; // Optional fields
      case 4:
        return Boolean(formData.availability && formData.payment_terms && 
               formData.location_preference);
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <CareerGoalsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <SkillsPortfolioStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PreferencesStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step Indicator */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="flex space-x-2">
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

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6 md:mt-8">
        <button
          onClick={handlePrevious}
          onTouchStart={(e) => e.preventDefault()}
          disabled={currentStep === 1}
          className="flex items-center px-3 md:px-6 py-2 md:py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base touch-manipulation"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500,
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <ChevronLeft className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>
        
        <button
          onClick={handleNext}
          onTouchStart={(e) => e.preventDefault()}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center px-3 md:px-6 py-2 md:py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base touch-manipulation"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500,
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">{currentStep === totalSteps ? 'Complete' : 'Next'}</span>
              <span className="sm:hidden">{currentStep === totalSteps ? 'Done' : 'Next'}</span>
              <ChevronRight className="w-4 h-4 ml-1 md:ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Phone number formatting helper
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '');
  // Limit to 10 digits
  return phoneNumber.slice(0, 10);
};

// Validation helper
const validateField = (field: string, value: string): string => {
  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return value && !emailRegex.test(value) ? 'Please enter a valid email address' : '';
    case 'phone':
      const phoneRegex = /^\d{10}$/;
      return value && !phoneRegex.test(value) ? 'Phone number must be exactly 10 digits' : '';
    case 'year':
      const currentYear = new Date().getFullYear();
      const year = parseInt(value);
      return (year < 2020 || year > currentYear + 5) ? `Year must be between 2020 and ${currentYear + 5}` : '';
    case 'resume_url':
    case 'linkedin_url':
    case 'github_url':
    case 'portfolio_url':
      if (!value) return '';
      const urlRegex = /^https?:\/\/.+/;
      return !urlRegex.test(value) ? 'URL must start with http:// or https://' : '';
    default:
      return '';
  }
};

// Step 1: Basic Info
function BasicInfoStep({ 
  formData, 
  updateFormData 
}: { 
  formData: StudentFormData; 
  updateFormData: (field: keyof StudentFormData, value: any) => void;
}) {
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
          Basic Information
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
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your full name"
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
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              formData.email && validateField('email', formData.email) 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your email"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {formData.email && validateField('email', formData.email) && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {validateField('email', formData.email)}
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
            onChange={(e) => updateFormData('phone', formatPhoneNumber(e.target.value))}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              formData.phone && validateField('phone', formData.phone) 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="Enter your phone number (10 digits)"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {formData.phone && validateField('phone', formData.phone) && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {validateField('phone', formData.phone)}
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
            College/University *
          </label>
          <input
            type="text"
            value={formData.college}
            onChange={(e) => updateFormData('college', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your college name"
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
            Year of passing *
          </label>
          <select
            value={formData.year}
            onChange={(e) => updateFormData('year', parseInt(e.target.value))}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm md:text-base appearance-none bg-white"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400,
              backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")',
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            {Array.from({ length: 7 }, (_, i) => 2024 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Course *
          </label>
          <input
            type="text"
            value={formData.course}
            onChange={(e) => updateFormData('course', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="e.g., Computer Science"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
        </div>
        
        <div className="md:col-span-2">
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
            onChange={(e) => updateFormData('city', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your city"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Career Goals
function CareerGoalsStep({ 
  formData, 
  updateFormData 
}: { 
  formData: StudentFormData; 
  updateFormData: (field: keyof StudentFormData, value: any) => void;
}) {
  const toggleArrayItem = (field: 'career_goals' | 'interest_area', value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
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
          Career Goals
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          What are you looking for?
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
            What are you looking for? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {CAREER_GOALS_OPTIONS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleArrayItem('career_goals', goal)}
                className={`p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.career_goals.includes(goal)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {goal}
              </button>
            ))}
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
            Interest Areas *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {INTEREST_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleArrayItem('interest_area', area)}
                className={`p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.interest_area.includes(area)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {area}
              </button>
            ))}
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
            Startup Interest Level *
          </label>
          <div className="space-y-2 md:space-y-3">
            {INTEREST_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => updateFormData('interest_level', level)}
                className={`w-full p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.interest_level === level
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Skills & Portfolio
function SkillsPortfolioStep({ 
  formData, 
  updateFormData 
}: { 
  formData: StudentFormData; 
  updateFormData: (field: keyof StudentFormData, value: any) => void;
}) {
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
          Skills & Portfolio
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Share your professional presence
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
            Resume URL
          </label>
          <input
            type="url"
            value={formData.resume_url}
            onChange={(e) => updateFormData('resume_url', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              formData.resume_url && validateField('resume_url', formData.resume_url) 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://drive.google.com/..."
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {formData.resume_url && validateField('resume_url', formData.resume_url) && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {validateField('resume_url', formData.resume_url)}
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
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin_url}
            onChange={(e) => updateFormData('linkedin_url', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              formData.linkedin_url && validateField('linkedin_url', formData.linkedin_url) 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://linkedin.com/in/..."
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {formData.linkedin_url && validateField('linkedin_url', formData.linkedin_url) && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {validateField('linkedin_url', formData.linkedin_url)}
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
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => updateFormData('github_url', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              formData.github_url && validateField('github_url', formData.github_url) 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://github.com/..."
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {formData.github_url && validateField('github_url', formData.github_url) && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {validateField('github_url', formData.github_url)}
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
            Portfolio/Personal Website
          </label>
          <input
            type="url"
            value={formData.portfolio_url}
            onChange={(e) => updateFormData('portfolio_url', e.target.value)}
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base ${
              formData.portfolio_url && validateField('portfolio_url', formData.portfolio_url) 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            placeholder="https://yourwebsite.com"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {formData.portfolio_url && validateField('portfolio_url', formData.portfolio_url) && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>
              {validateField('portfolio_url', formData.portfolio_url)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 4: Preferences
function PreferencesStep({ 
  formData, 
  updateFormData 
}: { 
  formData: StudentFormData; 
  updateFormData: (field: keyof StudentFormData, value: any) => void;
}) {
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
          Preferences
        </h2>
        <p 
          className="text-sm md:text-base text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          Set your work preferences
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
            Available Hours Per Week *
          </label>
          <div className="space-y-2 md:space-y-3">
            {AVAILABILITY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateFormData('availability', option)}
                className={`w-full p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.availability === option
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
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Payment Preference *
          </label>
          <div className="space-y-2 md:space-y-3">
            {PAYMENT_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => updateFormData('payment_terms', term)}
                className={`w-full p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.payment_terms === term
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {term}
              </button>
            ))}
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
            Location Preference *
          </label>
          <div className="space-y-2 md:space-y-3">
            {LOCATION_PREFERENCES.map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => updateFormData('location_preference', pref)}
                className={`w-full p-2 md:p-3 text-left rounded-lg border-2 transition-colors text-sm md:text-base ${
                  formData.location_preference === pref
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {pref}
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
            What kind of ideas do you want to work on?
          </label>
          <textarea
            value={formData.extra_text}
            onChange={(e) => updateFormData('extra_text', e.target.value)}
            rows={4}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Tell us about the types of projects or ideas you're interested in..."
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
        </div>
      </div>
    </div>
  );
} 