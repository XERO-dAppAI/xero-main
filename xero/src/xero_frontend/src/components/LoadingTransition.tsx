import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import xeroLogo from '../assets/xero.png';

interface LoadingTransitionProps {
  onComplete: () => void;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-white flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-16"
      >
        <motion.div
          className="absolute -inset-8 rounded-full"
          animate={{ 
            boxShadow: ['0 0 20px rgba(102, 110, 210, 0.2)', '0 0 40px rgba(102, 110, 210, 0.4)', '0 0 20px rgba(102, 110, 210, 0.2)'],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img 
          src={xeroLogo} 
          alt="XERO" 
          className="w-48 h-48 relative z-10"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <div className="w-80">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#666ED2] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.p 
          className="text-[#2D2654]/60 text-sm mt-4 text-center font-raleway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading your dashboard...
        </motion.p>
      </div>
    </motion.div>
  );
}; 