'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Rocket, 
  User, 
  Building2, 
  Briefcase,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { updateUserProfile, AuthUser } from '@/lib/auth';
import LoadingSpinner from './LoadingSpinner';

interface UserProfileSetupProps {
  user: AuthUser;
  onComplete: () => void;
  onSkip: () => void;
}

export default function UserProfileSetup({ user, onComplete, onSkip }: UserProfileSetupProps) {
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const userTypes = [
    {
      id: 'student',
      title: 'Student',
      description: 'Looking for internships, mentorship, and career guidance',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      id: 'founder',
      title: 'Founder',
      description: 'Building a startup and seeking investors, mentors, and talent',
      icon: Rocket,
      color: 'green'
    },
    {
      id: 'mentor',
      title: 'Mentor',
      description: 'Experienced professional wanting to guide others',
      icon: User,
      color: 'purple'
    },
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'Service provider looking to work with startups',
      icon: Building2,
      color: 'orange'
    },
    {
      id: 'professional',
      title: 'Working Professional',
      description: 'Seeking career opportunities and professional growth',
      icon: Briefcase,
      color: 'teal'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedUserType) {
      setError('Please select a user type');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await updateUserProfile(user.id, {
        user_type: selectedUserType as AuthUser['user_type']
      });

      if (result.error) {
        setError(result.error);
      } else {
        onComplete();
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to The CoFounder Circle!
          </h2>
          <p className="text-gray-600">
            Hi {user.full_name || user.email}, let's set up your profile to connect you with the right opportunities.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            What best describes you?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTypes.map((userType) => (
              <motion.div
                key={userType.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedUserType === userType.id
                    ? `border-${userType.color}-500 bg-${userType.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedUserType(userType.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-${userType.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <userType.icon className={`w-5 h-5 text-${userType.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {userType.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {userType.description}
                    </p>
                  </div>
                  {selectedUserType === userType.id && (
                    <CheckCircle className={`w-5 h-5 text-${userType.color}-600`} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedUserType}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                Setting up...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
} 