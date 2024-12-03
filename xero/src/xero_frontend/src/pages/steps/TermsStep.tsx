import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStep } from '../../context/StepContext';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { LoadingTransition } from '../../components/LoadingTransition';
import { 
  LayoutDashboard, // Platform Usage
  ShieldCheck, // Data Privacy & Security
  Wallet, // Token Economics
  BadgeCheck, // Verification Process
  Settings2, // Platform Updates
  ScrollText, // Compliance
  ArrowRight // Add this import
} from 'lucide-react';

export const TermsStep: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useStep();
  const [accepted, setAccepted] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const terms = [
    {
      title: "Platform Usage",
      content: "By using XERO, you agree to accurately track and report food waste data. False reporting may result in account suspension.",
      icon: LayoutDashboard
    },
    {
      title: "Data Privacy & Security",
      content: "Your business data is securely stored on the Internet Computer blockchain. You maintain full ownership and control of your data.",
      icon: ShieldCheck
    },
    {
      title: "Token Economics",
      content: "XEROW tokens are awarded based on verified waste reduction achievements. Rewards are subject to vesting schedules and platform milestones.",
      icon: Wallet
    },
    {
      title: "Verification Process",
      content: "All waste reduction claims must pass our AI-powered verification system. Manual audits may be conducted periodically.",
      icon: BadgeCheck
    },
    {
      title: "Platform Updates",
      content: "Features and reward mechanisms may be updated through community governance. Major changes require token holder approval.",
      icon: Settings2
    },
    {
      title: "Compliance",
      content: "Users must comply with local food safety and waste management regulations. XERO supplements but doesn't replace legal obligations.",
      icon: ScrollText
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
        <motion.h2 
          className="section-title mt-5 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-[#062424]">Review our</span>{" "}
          <motion.span
            className="text-[#267c7c]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            terms
          </motion.span>
        </motion.h2>

        <motion.div 
          className="w-full max-w-3xl bg-white/40 backdrop-blur-[2px] rounded-2xl p-8 mt-8 border border-white/50"
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
                whileHover={{ x: 5 }}
                className="group"
              >
                <div className="flex items-start gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-[#062424]/5"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    <term.icon className="w-5 h-5 text-[#1a6363] group-hover:text-[#062424] transition-colors" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-syne text-[#062424] mb-2 group-hover:text-[#1a6363] transition-colors">
                      {term.title}
                    </h3>
                    <p className="text-[#062424]/70 font-raleway">
                      {term.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-8 pt-6 border-t border-[#062424]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center
                  ${accepted 
                    ? 'bg-[#1a6363] border-[#1a6363]' 
                    : 'border-[#062424]/30 group-hover:border-[#1a6363]'
                  } transition-colors`}
                onClick={() => setAccepted(!accepted)}
              >
                {accepted && <IoMdCheckmarkCircleOutline className="text-white" />}
              </div>
              <span className="font-raleway text-[#062424]/70">
                I have read and agree to XERO's Terms and Conditions
              </span>
            </label>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex justify-center mt-12"
          whileHover={{ scale: accepted ? 1.02 : 1 }}
          whileTap={{ scale: accepted ? 0.98 : 1 }}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={!accepted}
            className={`group relative overflow-hidden rounded-xl font-syne px-12 py-4 w-[380px] ${!accepted && 'opacity-50 cursor-not-allowed'}`}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#062424]/90 to-[#1a6363]/90 backdrop-blur-[4px]" />
            
            <div className="absolute inset-0">
              <div 
                className="absolute inset-0 transform -translate-x-full animate-windshield bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </div>

            <div 
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />

            <div className="relative z-10 flex items-center justify-center gap-2 text-white">
              <span>Accept & Continue</span>
              <motion.div
                animate={{ 
                  x: [0, 5, 0] 
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.button>
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