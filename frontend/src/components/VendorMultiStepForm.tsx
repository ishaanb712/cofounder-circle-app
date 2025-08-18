'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import LocationDropdown from './LocationDropdown';
import YearsDropdown from './YearsDropdown';
// import { updateUserProfile } from '@/lib/firebase';

interface VendorFormData {
  // Step 1: Business Info
  business_name: string;
  url: string;
  category: string[];
  years_of_experience: number;
  locations: string[];
  team_size: string;
  
  // Step 2: Founder Contact
  name: string;
  email: string;
  phone: string;
  
  // Step 3: Client Track Record
  work_history: boolean;
  notable_clients: string[];
  past_work_links: string[];
  
  // Step 4: Engagement Details
  minimum_project_value: number;
  tat: string;
  working_model: string;
  
  // Step 5: Goals
  goals: string[];
}

interface VendorMultiStepFormProps {
  userId: string;
  initialData?: Partial<VendorFormData>;
  onComplete?: (data: VendorFormData) => Promise<void>;
  onStepChange?: (step: number) => void;
}

const CATEGORY_OPTIONS = [
  'Tech & Development',
  'Branding / Design',
  'Legal / Compliance',
  'Finance / Accounting',
  'Manufacturing / Sourcing',
  'Marketing & Growth',
  'Hiring & HR',
  'Others'
];

const TEAM_SIZE_OPTIONS = [
  '1-5 people',
  '6-10 people',
  '11-25 people',
  '26-50 people',
  '50+ people'
];

const WORKING_MODEL_OPTIONS = [
  'Retainer',
  'Project-based',
  'Ad hoc'
];

const GOALS_OPTIONS = [
  'Lead generation',
  'Brand visibility',
  'Partnership opportunities',
  'Investor/startup exposure'
];

export default function VendorMultiStepForm({
  userId,
  initialData = {},
  onComplete,
  onStepChange
}: VendorMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<VendorFormData>({
    business_name: '',
    url: '',
    category: [],
    years_of_experience: 1,
    locations: [],
    team_size: '',
    name: '',
    email: '',
    phone: '',
    work_history: false,
    notable_clients: [],
    past_work_links: [],
    minimum_project_value: 0,
    tat: '',
    working_model: '',
    goals: [],
    ...initialData
  });

  const [progress, setProgress] = useState({
    business_info: 'not_started',
    founder_contact: 'not_started',
    client_track_record: 'not_started',
    engagement_details: 'not_started',
    goals: 'not_started'
  });

  const totalSteps = 5;

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const updateFormData = (field: keyof VendorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Real-time validation functions
  const validateField = (field: keyof VendorFormData, value: any): string => {
    switch (field) {
      case 'business_name':
        if (!value || value.trim().length < 2) {
          return 'Business name must be at least 2 characters long';
        }
        break;
      case 'url':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        break;
      case 'name':
        if (!value || value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value || !/^\d{10}$/.test(value)) {
          return 'Please enter a valid 10-digit phone number';
        }
        break;
      case 'tat':
        if (!value || value.trim().length === 0) {
          return 'Please enter turnaround time/availability';
        }
        break;
      case 'category':
        if (!value || value.length === 0) {
          return 'Please select at least one category';
        }
        break;
      case 'locations':
        if (!value || value.length === 0) {
          return 'Please select at least one location';
        }
        break;
      case 'team_size':
        if (!value || value === '') {
          return 'Please select a team size';
        }
        break;
      case 'working_model':
        if (!value || value === '') {
          return 'Please select a working model';
        }
        break;
      case 'goals':
        if (!value || value.length === 0) {
          return 'Please select at least one goal';
        }
        break;
    }
    return '';
  };

  const handleFieldChange = (field: keyof VendorFormData, value: any) => {
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
      console.log('🚀 Starting vendor form submission...');
      setIsSubmitting(true);
      try {
        await saveStepProgress('goals', getStepData(5));
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
    const stepKeys = ['business_info', 'founder_contact', 'client_track_record', 'engagement_details', 'goals'];
    return stepKeys[step - 1];
  };

  const getStepData = (step: number): any => {
    switch (step) {
      case 1:
        return {
          business_name: formData.business_name,
          url: formData.url,
          category: formData.category,
          years_of_experience: formData.years_of_experience,
          locations: formData.locations,
          team_size: formData.team_size
        };
      case 2:
        return {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        };
      case 3:
        return {
          work_history: formData.work_history,
          notable_clients: formData.notable_clients,
          past_work_links: formData.past_work_links
        };
      case 4:
        return {
          minimum_project_value: formData.minimum_project_value,
          tat: formData.tat,
          working_model: formData.working_model
        };
      case 5:
        return {
          goals: formData.goals
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
        return Boolean(
          formData.business_name && 
          formData.business_name.trim().length >= 2 &&
          formData.category.length > 0 && 
          formData.team_size && 
          formData.locations.length > 0
        );
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        return Boolean(
          formData.name && 
          formData.name.trim().length >= 2 &&
          formData.email && 
          emailRegex.test(formData.email) &&
          formData.phone && 
          phoneRegex.test(formData.phone)
        );
      case 3:
        return true; // All fields are optional in step 3
      case 4:
        return Boolean(formData.tat && formData.tat.trim().length > 0 && formData.working_model);
      case 5:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BusinessInfoStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      case 2:
        return <FounderContactStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      case 3:
        return <ClientTrackRecordStep formData={formData} updateFormData={updateFormData} errors={formErrors} />;
      case 4:
        return <EngagementDetailsStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
      case 5:
        return <GoalsStep formData={formData} updateFormData={updateFormData} handleFieldChange={handleFieldChange} errors={formErrors} />;
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
                i + 1 <= currentStep ? 'bg-purple-600' : 'bg-gray-300'
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
          disabled={currentStep === 1}
          className="flex items-center px-4 md:px-6 py-2 md:py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className="flex items-center px-4 md:px-6 py-2 md:py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 500
          }}
        >
          {isSubmitting ? 'Submitting...' : (currentStep === totalSteps ? 'Submit' : 'Next')}
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Step 1: Business Info
function BusinessInfoStep({ 
  formData, 
  updateFormData, 
  handleFieldChange,
  errors 
}: { 
  formData: VendorFormData; 
  updateFormData: (field: keyof VendorFormData, value: any) => void;
  handleFieldChange: (field: keyof VendorFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  const [otherCategory, setOtherCategory] = useState('');
  
  const toggleArrayItem = (field: 'category' | 'locations', value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFieldChange(field, newArray);
  };

  const handleOtherCategory = () => {
    if (otherCategory.trim()) {
      toggleArrayItem('category', otherCategory.trim());
      setOtherCategory('');
    }
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
          Business Info
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Tell us about your business
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Business Name *
          </label>
          <input
            type="text"
            value={formData.business_name}
            onChange={(e) => handleFieldChange('business_name', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your business name"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.business_name && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.business_name}</p>
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
            Website / Portfolio URL
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleFieldChange('url', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="https://yourwebsite.com"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.url}</p>
          )}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Category of Services *
          </label>
          <div className="space-y-3">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleArrayItem('category', category)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.category.includes(category)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
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
          
          {/* Other category input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
              placeholder="Add other category..."
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400
              }}
            />
            <button
              onClick={handleOtherCategory}
              disabled={!otherCategory.trim()}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500
              }}
            >
              Add
            </button>
          </div>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.category}</p>
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
            Years in Operation
          </label>
          <YearsDropdown
            value={formData.years_of_experience}
            onChange={(years) => updateFormData('years_of_experience', years)}
            placeholder="Select years in operation"
            className="w-full"
            startYear={1}
            endYear={20}
          />
          {errors.years_of_experience && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.years_of_experience}</p>
          )}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Location(s) Served *
          </label>
          <div className="space-y-3">
            {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Remote'].map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => toggleArrayItem('locations', location)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.locations.includes(location)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {location}
              </button>
            ))}
          </div>
          {errors.locations && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.locations}</p>
          )}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Team Size *
          </label>
          <div className="space-y-3">
            {TEAM_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleFieldChange('team_size', size)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.team_size === size
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              >
                {size}
              </button>
            ))}
          </div>
          {errors.team_size && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.team_size}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 2: Founder Contact
function FounderContactStep({ 
  formData, 
  updateFormData, 
  handleFieldChange,
  errors 
}: { 
  formData: VendorFormData; 
  updateFormData: (field: keyof VendorFormData, value: any) => void;
  handleFieldChange: (field: keyof VendorFormData, value: any) => void;
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
          Founder Contact
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Tell us about the primary contact person
        </p>
      </div>
      
      <div className="space-y-6">
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
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your full name"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.name}</p>
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
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="your.email@example.com"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.email}</p>
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
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="Enter your phone number"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 3: Client Track Record
function ClientTrackRecordStep({ 
  formData, 
  updateFormData, 
  errors 
}: { 
  formData: VendorFormData; 
  updateFormData: (field: keyof VendorFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  const [newClient, setNewClient] = useState('');
  const [newLink, setNewLink] = useState('');
  
  const addClient = () => {
    if (newClient.trim()) {
      updateFormData('notable_clients', [...formData.notable_clients, newClient.trim()]);
      setNewClient('');
    }
  };
  
  const addLink = () => {
    if (newLink.trim()) {
      updateFormData('past_work_links', [...formData.past_work_links, newLink.trim()]);
      setNewLink('');
    }
  };
  
  const removeClient = (index: number) => {
    updateFormData('notable_clients', formData.notable_clients.filter((_, i) => i !== index));
  };
  
  const removeLink = (index: number) => {
    updateFormData('past_work_links', formData.past_work_links.filter((_, i) => i !== index));
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
          Client Track Record
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Share your experience with startups
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
            Have you worked with startups before?
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => updateFormData('work_history', true)}
              className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                formData.work_history === true
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400
              }}
            >
              Yes, I have experience with startups
            </button>
            <button
              type="button"
              onClick={() => updateFormData('work_history', false)}
              className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                formData.work_history === false
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
              style={{
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400
              }}
            >
              No, but I'm interested in working with startups
            </button>
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
            Notable Clients
          </label>
          <div className="space-y-3">
            {formData.notable_clients.map((client, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span 
                  className="flex-1"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                >
                  {client}
                </span>
                <button
                  onClick={() => removeClient(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Add notable client..."
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              />
              <button
                onClick={addClient}
                disabled={!newClient.trim()}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500
                }}
              >
                Add
              </button>
            </div>
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
            Case Study or Past Work Links
          </label>
          <div className="space-y-3">
            {formData.past_work_links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span 
                  className="flex-1"
                  style={{
                    fontFamily: 'var(--font-roboto), sans-serif',
                    fontWeight: 400
                  }}
                >
                  {link}
                </span>
                <button
                  onClick={() => removeLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Add work link..."
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400
                }}
              />
              <button
                onClick={addLink}
                disabled={!newLink.trim()}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 500
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Engagement Details
function EngagementDetailsStep({ 
  formData, 
  updateFormData, 
  handleFieldChange,
  errors 
}: { 
  formData: VendorFormData; 
  updateFormData: (field: keyof VendorFormData, value: any) => void;
  handleFieldChange: (field: keyof VendorFormData, value: any) => void;
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
          Engagement Details
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          Set your engagement preferences
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Minimum Project Value (₹)
          </label>
          <input
            type="number"
            value={formData.minimum_project_value}
            onChange={(e) => updateFormData('minimum_project_value', parseInt(e.target.value) || 0)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="50000"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.minimum_project_value && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.minimum_project_value}</p>
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
            Turnaround Time / Availability *
          </label>
          <input
            type="text"
            value={formData.tat}
            onChange={(e) => handleFieldChange('tat', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
            placeholder="e.g., 2-3 weeks, Available immediately"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 400
            }}
          />
          {errors.tat && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.tat}</p>
          )}
        </div>
        
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-3"
            style={{
              fontFamily: 'var(--font-roboto), sans-serif',
              fontWeight: 500
            }}
          >
            Working Model *
          </label>
          <div className="space-y-3">
            {WORKING_MODEL_OPTIONS.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => handleFieldChange('working_model', model)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.working_model === model
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
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
          {errors.working_model && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.working_model}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 5: Goals
function GoalsStep({ 
  formData, 
  updateFormData, 
  handleFieldChange,
  errors 
}: { 
  formData: VendorFormData; 
  updateFormData: (field: keyof VendorFormData, value: any) => void;
  handleFieldChange: (field: keyof VendorFormData, value: any) => void;
  errors: {[key: string]: string};
}) {
  const toggleArrayItem = (field: 'goals', value: string) => {
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
          Goals
        </h2>
        <p 
          className="text-gray-600"
          style={{
            fontFamily: 'var(--font-roboto), sans-serif',
            fontWeight: 400
          }}
        >
          What are you looking for?
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
            What are you looking for: *
          </label>
          <div className="space-y-3">
            {GOALS_OPTIONS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleArrayItem('goals', goal)}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  formData.goals.includes(goal)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
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
          {errors.goals && (
            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-roboto), sans-serif', fontWeight: 400 }}>{errors.goals}</p>
          )}
        </div>
      </div>
    </div>
  );
} 