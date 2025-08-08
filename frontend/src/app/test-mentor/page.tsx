'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MentorMultiStepForm from '@/components/MentorMultiStepForm';

export default function TestMentorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(null);

  const handleComplete = (data: any) => {
    console.log('Mentor form completed:', data);
    setFormData(data);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mentor Multi-Step Form Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing the new mentor multi-step form implementation
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <MentorMultiStepForm
            userId="test-mentor-123"
            onComplete={handleComplete}
            onStepChange={handleStepChange}
          />
        </div>

        {formData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-indigo-50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">
              Form Completed Successfully!
            </h2>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Submitted Data:</h3>
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}

        <div className="mt-8 bg-indigo-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            Mentor Form Features
          </h2>
          <ul className="space-y-2 text-indigo-800">
            <li>✅ 2-step progressive form for mentors</li>
            <li>✅ Basic details collection</li>
            <li>✅ Incubator profile and focus areas</li>
            <li>✅ Startup stage preferences</li>
            <li>✅ Progress tracking and validation</li>
            <li>✅ Auto-save between steps</li>
            <li>✅ Responsive design with smooth animations</li>
            <li>✅ Indigo color scheme for mentor theme</li>
          </ul>
        </div>

        <div className="mt-8 bg-indigo-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            Form Steps Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-indigo-900 mb-3">Step 1: Basic Details</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Full name and contact information</li>
                <li>• Organization name</li>
                <li>• Website/LinkedIn/Program URL</li>
                <li>• City/Location (or Remote)</li>
                <li>• State (optional)</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-indigo-900 mb-3">Step 2: Incubator Profile</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Incubator type selection</li>
                <li>• Focus areas (D2C, SaaS, Climate, etc.)</li>
                <li>• Preferred startup stages</li>
                <li>• Custom type and focus area options</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-indigo-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            Incubator Types Supported
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Incubator', 'Accelerator', 'Grant Program', 'Bootcamp/Workshop', 'Startup Studio', 'Other'].map((type) => (
              <div key={type} className="bg-white rounded-lg p-3 text-center">
                <span className="text-sm font-medium text-indigo-700">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-indigo-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            Focus Areas Available
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['D2C', 'SaaS', 'Climate', 'Social Impact', 'Fintech', 'Healthtech', 'EdTech', 'AI/ML', 'Blockchain', 'E-commerce', 'Manufacturing', 'Agriculture', 'Clean Energy', 'Other'].map((area) => (
              <div key={area} className="bg-white rounded-lg p-3 text-center">
                <span className="text-sm font-medium text-indigo-700">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 