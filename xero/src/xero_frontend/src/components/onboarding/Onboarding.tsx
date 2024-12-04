import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserTypeSelection } from './UserTypeSelection';
import { Check } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const [userType, setUserType] = useState<'individual' | 'business' | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Progress steps
  const steps = [
    { id: 1, title: 'Verify Identity', description: 'One-time sign in with NFID / III' },
    { id: 2, title: 'Set Up Business Profile', description: 'Tell us about your business details' },
    { id: 3, title: 'Features You Use', description: 'What features of XERO will you be using' },
    { id: 4, title: 'Terms & Conditions', description: 'Agree to XERO\'s Terms before starting' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <UserTypeSelection 
            onSelect={(type) => {
              setUserType(type);
              setCurrentStep(2);
            }}
          />
        );
      // Add other steps here
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Progress Header */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${currentStep > step.id 
                    ? 'bg-[#1a6363] text-white' 
                    : currentStep === step.id
                    ? 'bg-[#1a6363]/20 text-[#1a6363] border-2 border-[#1a6363]'
                    : 'bg-white/5 text-white/30'
                  }
                `}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-white' : 'text-white/30'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs mt-1 ${
                    currentStep >= step.id ? 'text-white/60' : 'text-white/30'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-full h-0.5 mx-4
                  ${currentStep > step.id 
                    ? 'bg-[#1a6363]' 
                    : 'bg-white/5'
                  }
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};