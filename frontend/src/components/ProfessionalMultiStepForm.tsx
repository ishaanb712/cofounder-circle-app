'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
// import { updateUserProfile } from '@/lib/firebase';

interface ProfessionalFormData {
  // Step 1: Personal & Career Info
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  years_experience: number;
  current_role: string;
  current_company: string;
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

interface ProfessionalMultiStepFormProps {
  userId: string;
  initialData?: Partial<ProfessionalFormData>;
  onComplete?: (data: ProfessionalFormData) => void;
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

export default function ProfessionalMultiStepForm({
  userId,
  initialData = {},
  onComplete,
  onStepChange
}: ProfessionalMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfessionalFormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    years_experience: 1,
    current_role: '',
    current_company: '',
    linkedin: '',
    startup_interest: [],
    startup_exposure: [],
    functional_expertise: [],
    industry_knowledge: [],
    resume_url: '',
    availability: '',
    compensation_model: '',
    stage_preference: [],
    ...initialData
  });

  const [progress, setProgress] = useState({
    personal_career: 'not_started',
    startup_interest: 'not_started',
    skills_domains: 'not_started',
    preferences: 'not_started'
  });

  const totalSteps = 4;

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const updateFormData = (field: keyof ProfessionalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (currentStep < totalSteps) {
      // Save current step progress
      const stepData = getStepData(currentStep);
      await saveStepProgress(getStepKey(currentStep), stepData);
      
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete the form
      await saveStepProgress('preferences', getStepData(4));
      onComplete?.(formData);
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
          years_experience: formData.years_experience,
          current_role: formData.current_role,
          current_company: formData.current_company,
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
    switch (currentStep) {
      case 1:
        return Boolean(formData.name && formData.email && formData.phone && 
               formData.city && formData.current_role && formData.current_company);
      case 2:
        return formData.startup_interest.length > 0 && 
               formData.startup_exposure.length > 0;
      case 3:
        return formData.functional_expertise.length > 0 && 
               formData.industry_knowledge.length > 0;
      case 4:
        return Boolean(formData.availability && formData.compensation_model && 
               formData.stage_preference.length > 0);
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalCareerStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <StartupInterestStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <SkillsDomainsStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <PreferencesStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step <= currentStep 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
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
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Step 1: Personal & Career Info
function PersonalCareerStep({ 
  formData, 
  updateFormData 
}: { 
  formData: ProfessionalFormData; 
  updateFormData: (field: keyof ProfessionalFormData, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal & Career Info</h2>
        <p className="text-gray-600">Tell us about your professional background</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your phone number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your city"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => updateFormData('state', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your state"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <select
            value={formData.years_experience}
            onChange={(e) => updateFormData('years_experience', parseInt(e.target.value))}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 text-sm md:text-base"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map(year => (
              <option key={year} value={year}>{year} year{year !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Role *
          </label>
          <input
            type="text"
            value={formData.current_role}
            onChange={(e) => updateFormData('current_role', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="e.g., Senior Product Manager"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Company *
          </label>
          <input
            type="text"
            value={formData.current_company}
            onChange={(e) => updateFormData('current_company', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="e.g., Google"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => updateFormData('linkedin', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Startup Interest
function StartupInterestStep({ 
  formData, 
  updateFormData 
}: { 
  formData: ProfessionalFormData; 
  updateFormData: (field: keyof ProfessionalFormData, value: any) => void;
}) {
  const toggleArrayItem = (field: 'startup_interest' | 'startup_exposure', value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Startup Interest</h2>
        <p className="text-gray-600">What brings you to the startup ecosystem?</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I'm here to: *
          </label>
          <div className="space-y-3">
            {STARTUP_INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleArrayItem('startup_interest', interest)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.startup_interest.includes(interest)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Startup exposure: *
          </label>
          <div className="space-y-3">
            {STARTUP_EXPOSURE_OPTIONS.map((exposure) => (
              <button
                key={exposure}
                type="button"
                onClick={() => toggleArrayItem('startup_exposure', exposure)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.startup_exposure.includes(exposure)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {exposure}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 3: Skills & Domains
function SkillsDomainsStep({ 
  formData, 
  updateFormData 
}: { 
  formData: ProfessionalFormData; 
  updateFormData: (field: keyof ProfessionalFormData, value: any) => void;
}) {
  const toggleArrayItem = (field: 'functional_expertise' | 'industry_knowledge', value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & Domains</h2>
        <p className="text-gray-600">What are your areas of expertise?</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Functional expertise: *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {FUNCTIONAL_EXPERTISE_OPTIONS.map((expertise) => (
              <button
                key={expertise}
                type="button"
                onClick={() => toggleArrayItem('functional_expertise', expertise)}
                className={`p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.functional_expertise.includes(expertise)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {expertise}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Industry knowledge: *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {INDUSTRY_KNOWLEDGE_OPTIONS.map((industry) => (
              <button
                key={industry}
                type="button"
                onClick={() => toggleArrayItem('industry_knowledge', industry)}
                className={`p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.industry_knowledge.includes(industry)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume/Portfolio URL
          </label>
          <input
            type="url"
            value={formData.resume_url}
            onChange={(e) => updateFormData('resume_url', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://drive.google.com/..."
          />
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
  formData: ProfessionalFormData; 
  updateFormData: (field: keyof ProfessionalFormData, value: any) => void;
}) {
  const toggleArrayItem = (field: 'stage_preference', value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferences</h2>
        <p className="text-gray-600">Set your work preferences</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Time availability: *
          </label>
          <div className="space-y-3">
            {AVAILABILITY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => updateFormData('availability', option)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.availability === option
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Compensation model: *
          </label>
          <div className="space-y-3">
            {COMPENSATION_MODEL_OPTIONS.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => updateFormData('compensation_model', model)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.compensation_model === model
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Stage preference: *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {STAGE_PREFERENCE_OPTIONS.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => toggleArrayItem('stage_preference', stage)}
                className={`p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.stage_preference.includes(stage)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 