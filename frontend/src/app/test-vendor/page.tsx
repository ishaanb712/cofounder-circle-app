'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import VendorMultiStepForm from '@/components/VendorMultiStepForm';

export default function TestVendorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(null);

  const handleComplete = async (data: any) => {
    console.log('Vendor form completed:', data);
    setFormData(data);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vendor Multi-Step Form Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing the new vendor multi-step form implementation
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <VendorMultiStepForm
            userId="test-vendor-123"
            onComplete={handleComplete}
            onStepChange={handleStepChange}
          />
        </div>

        {formData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-purple-50 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
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

        <div className="mt-8 bg-purple-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            Vendor Form Features
          </h2>
          <ul className="space-y-2 text-purple-800">
            <li>✅ 5-step progressive form for vendors</li>
            <li>✅ Business information collection</li>
            <li>✅ Founder contact details</li>
            <li>✅ Client track record and work history</li>
            <li>✅ Engagement details and pricing</li>
            <li>✅ Business goals and objectives</li>
            <li>✅ Progress tracking and validation</li>
            <li>✅ Auto-save between steps</li>
            <li>✅ Responsive design with smooth animations</li>
            <li>✅ Purple color scheme for vendor theme</li>
          </ul>
        </div>

        <div className="mt-8 bg-purple-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">
            Form Steps Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Step 1: Business Info</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Business name and website</li>
                <li>• Service categories</li>
                <li>• Years of experience</li>
                <li>• Locations served</li>
                <li>• Team size</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Step 2: Founder Contact</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Contact person name</li>
                <li>• Email address</li>
                <li>• Phone number</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Step 3: Client Track Record</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Startup work experience</li>
                <li>• Notable clients</li>
                <li>• Past work links</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Step 4: Engagement Details</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Minimum project value</li>
                <li>• Turnaround time</li>
                <li>• Working model</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 md:col-span-2">
              <h3 className="font-semibold text-purple-900 mb-2">Step 5: Goals</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Lead generation</li>
                <li>• Brand visibility</li>
                <li>• Partnership opportunities</li>
                <li>• Investor/startup exposure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 