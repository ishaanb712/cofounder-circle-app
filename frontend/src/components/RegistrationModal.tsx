'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Mail, User, Building2, TrendingUp, Lightbulb, Briefcase, Users } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserType: string;
}

const userTypeIcons = {
  founder: Building2,
  investor: TrendingUp,
  mentor: Lightbulb,
  job_seeker: Briefcase,
  service_provider: Users
};

const userTypeLabels = {
  founder: 'Founder',
  investor: 'Investor',
  mentor: 'Mentor',
  job_seeker: 'Job Seeker',
  service_provider: 'Service Provider'
};

export default function RegistrationModal({ isOpen, onClose, selectedUserType }: RegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState(selectedUserType || '');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    useCase: '',
    linkedinUrl: '',
    phone: '',
    location: '',
    bio: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeSelect = (type: string) => {
    setUserType(type);
    setCurrentStep(2);
  };

  const handleOAuthLogin = async (provider: 'linkedin' | 'gmail') => {
    // TODO: Implement OAuth login
    console.log(`Logging in with ${provider}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission to backend
    console.log('Form submitted:', { userType, ...formData });
    onClose();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setUserType('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      useCase: '',
      linkedinUrl: '',
      phone: '',
      location: '',
      bio: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
              <h2 
                className="text-2xl font-bold text-gray-900"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 900
                }}
              >
                {currentStep === 1 ? 'Join StartupConnect' : 'Complete Your Profile'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {currentStep === 1 ? (
                // Step 1: User Type Selection
                <div>
                  <p 
                    className="text-gray-600 mb-8 text-center"
                    style={{
                      fontFamily: 'var(--font-roboto), sans-serif',
                      fontWeight: 500
                    }}
                  >
                    Choose how you'd like to join our ecosystem
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(userTypeIcons).map(([type, Icon]) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleUserTypeSelect(type)}
                        className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <Icon className="w-8 h-8 text-blue-600 mr-4" />
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">
                            {userTypeLabels[type as keyof typeof userTypeLabels]}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {type === 'founder' && 'Connect with investors, mentors, and talent'}
                            {type === 'investor' && 'Discover promising startups and opportunities'}
                            {type === 'mentor' && 'Share expertise and guide next-gen entrepreneurs'}
                            {type === 'job_seeker' && 'Find opportunities in innovative startups'}
                            {type === 'service_provider' && 'Offer your services to growing startups'}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                // Step 2: Registration Form
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      {userType && userTypeIcons[userType as keyof typeof userTypeIcons] && (
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                          {React.createElement(userTypeIcons[userType as keyof typeof userTypeIcons], {
                            className: 'w-6 h-6 text-blue-600'
                          })}
                        </div>
                      )}
                      <span className="text-lg font-semibold text-gray-900">
                        Join as {userTypeLabels[userType as keyof typeof userTypeLabels]}
                      </span>
                    </div>
                  </div>

                  {/* OAuth Buttons */}
                  <div className="mb-8">
                    <p className="text-gray-600 mb-4 text-center">Quick sign up with</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleOAuthLogin('linkedin')}
                        className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                        Continue with LinkedIn
                      </button>
                      <button
                        onClick={() => handleOAuthLogin('gmail')}
                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        Continue with Gmail
                      </button>
                    </div>
                  </div>

                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or complete your profile</span>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label 
                          className="block text-sm font-medium text-gray-700 mb-2"
                          style={{
                            fontFamily: 'var(--font-roboto), sans-serif',
                            fontWeight: 500
                          }}
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
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
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
                        />
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
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
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
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
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
                        Use Case / What are you looking for?
                      </label>
                      <textarea
                        name="useCase"
                        value={formData.useCase}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
                        placeholder="Tell us what you're looking for..."
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
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
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
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
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
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
                          placeholder="City, Country"
                        />
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
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm md:text-base"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Complete Registration
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 