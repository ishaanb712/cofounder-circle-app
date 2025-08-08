'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StudentMultiStepForm from '@/components/StudentMultiStepForm';

export default function TestMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(null);

  const handleComplete = async (data: any) => {
    console.log('Form completed:', data);
    setFormData(data);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Multi-Step Student Form Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing the new multi-step form implementation
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <StudentMultiStepForm
            userId="test-user-123"
            onComplete={handleComplete}
            onStepChange={handleStepChange}
          />
        </div>

        {formData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-green-50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-green-900 mb-4">
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

        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Form Features
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>✅ 4-step progressive form</li>
            <li>✅ Progress tracking and validation</li>
            <li>✅ Auto-save between steps</li>
            <li>✅ Responsive design</li>
            <li>✅ Smooth animations</li>
            <li>✅ Form validation</li>
            <li>✅ Firebase integration ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 