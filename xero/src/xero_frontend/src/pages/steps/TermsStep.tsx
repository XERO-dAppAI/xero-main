import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../../context/StepContext';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LoadingTransition } from '../../components/LoadingTransition';

export const TermsStep: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useStep();
  const [accepted, setAccepted] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const terms = [
    {
      title: "Platform Usage",
      content: "By using XERO, you agree to accurately track and report food waste data. False reporting may result in account suspension."
    },
    {
      title: "Data Privacy & Security",
      content: "Your business data is securely stored on the Internet Computer blockchain. You maintain full ownership and control of your data."
    },
    {
      title: "Token Economics",
      content: "XEROW tokens are awarded based on verified waste reduction achievements. Rewards are subject to vesting schedules and platform milestones."
    },
    {
      title: "Verification Process",
      content: "All waste reduction claims must pass our AI-powered verification system. Manual audits may be conducted periodically."
    },
    {
      title: "Platform Updates",
      content: "Features and reward mechanisms may be updated through community governance. Major changes require token holder approval."
    },
    {
      title: "Compliance",
      content: "Users must comply with local food safety and waste management regulations. XERO supplements but doesn't replace legal obligations."
    }
  ];

  const handleSubmit = async () => {
    if (accepted) {
      completeStep(4);
      setShowLoading(true);
    }
  };

  const handleLoadingComplete = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <div className="flex-grow flex flex-col items-center px-16 py-8">
        <motion.h1 
          className="section-title mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Terms & Conditions
        </motion.h1>

        <motion.div 
          className="w-full max-w-3xl bg-white rounded-2xl p-8 mt-8 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
            {terms.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <h3 className="text-lg font-syne text-[#2D2654] mb-2">
                  {term.title}
                </h3>
                <p className="text-gray-600 font-raleway">
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-8 pt-6 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center
                  ${accepted 
                    ? 'bg-[#666ed2] border-[#666ed2]' 
                    : 'border-gray-300 group-hover:border-[#666ed2]'
                  } transition-colors`}
                onClick={() => setAccepted(!accepted)}
              >
                {accepted && <IoMdCheckmarkCircleOutline className="text-white" />}
              </div>
              <span className="font-raleway text-gray-600">
                I have read and agree to XERO's Terms and Conditions
              </span>
            </label>
          </motion.div>
        </motion.div>

        <motion.div 
          className="relative mt-8"
          whileHover={{ scale: accepted ? 1.02 : 1 }}
          whileTap={{ scale: accepted ? 0.98 : 1 }}
        >
          <div className={`absolute inset-0 dark-purple-glow animate-glow rounded-lg ${!accepted && 'opacity-50'}`} />
          <button
            onClick={handleSubmit}
            disabled={!accepted}
            className={`relative z-10 px-12 py-4 bg-[#666ed2] text-white rounded-lg font-raleway
              ${!accepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#666ed2]/90'}
            `}
          >
            Accept & Continue
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showLoading && (
          <LoadingTransition onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>
    </>
  );
}; 